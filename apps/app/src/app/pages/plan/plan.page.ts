import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    TuiDataListWrapperModule,
    TuiFieldErrorPipeModule,
    TuiInputFilesModule,
    TuiInputModule,
    TuiMultiSelectModule,
    TuiTextareaModule,
} from '@taiga-ui/kit';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    TuiButtonModule,
    TuiDataListModule,
    TuiDropdownModule,
    TuiErrorModule,
    TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {TuiAppBarModule} from '@taiga-ui/addon-mobile';
import {SMELL_AFFECTIONS, SMELL_FACTORS, TRAINING_AIMS} from '@nw-app/constants';
import {
    BehaviorSubject,
    finalize,
    map,
    Observable,
    of,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs';
import {DeletableImageComponent} from '../../components/deletable-image/deletable-image.component';
import {tuiMarkControlAsTouchedAndValidate} from '@taiga-ui/cdk';
import {SupabaseService} from '../../services/supabase.service';
import {planFromDbMapper, planToDbMapper, uuidGenerator} from '@nw-app/utils';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'nw-plan',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TuiMultiSelectModule,
        TuiDataListModule,
        TuiDataListWrapperModule,
        TuiTextfieldControllerModule,
        TuiDropdownModule,
        TuiTextareaModule,
        TuiInputFilesModule,
        TuiButtonModule,
        DeletableImageComponent,
        TuiAppBarModule,
        TuiInputModule,
        TuiErrorModule,
        TuiFieldErrorPipeModule,
    ],
    templateUrl: './plan.page.html',
    styleUrls: ['./plan.page.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanPage implements OnInit {
    private readonly multiselectOpen = new Map<string, boolean>();

    protected readonly trainingAims = TRAINING_AIMS;
    protected readonly smellAffections = SMELL_AFFECTIONS;
    protected readonly smellFactors = SMELL_FACTORS;

    protected readonly form = new FormGroup({
        title: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
        trainingAim: new FormControl([]),
        image: new FormControl<File | null>(null),
        smellAffection: new FormControl([]),
        smellAffectionDescription: new FormControl(''),
        smellFactor: new FormControl([]),
        smellFactorDescription: new FormControl(''),
    });

    protected readonly formLoader$ = new BehaviorSubject<boolean>(false);
    protected readonly submitLoader$ = new BehaviorSubject<boolean>(false);
    protected readonly imageSrc$ = this.form.controls.image.valueChanges.pipe(
        switchMap(file => {
            return !file
                ? of(null)
                : (new Observable(sub => {
                      const reader = new FileReader();
                      reader.onload = (event: any) => {
                          sub.next(event.target.result);
                      };
                      reader.onerror = event => {
                          sub.next(null);
                      };
                      reader.readAsDataURL(file);
                  }) as Observable<string | null>);
        }),
    );

    constructor(
        private readonly supabaseService: SupabaseService,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
    ) {}

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');

        if (id) {
            this.formLoader$.next(true);
            this.supabaseService
                .getPlanById(id)
                .pipe(
                    tap(({data}) => this.form.setValue(planFromDbMapper(data))),
                    switchMap(({data}) =>
                        data?.image
                            ? this.supabaseService.downloadPlanImage(data.image)
                            : of({data: null}),
                    ),
                    tap(
                        ({data}) =>
                            data &&
                            this.form.controls.image.setValue(new File([data], '')),
                    ),
                    finalize(() => this.formLoader$.next(false)),
                )
                .subscribe(x => {
                    console.log(x);
                });
        }
    }

    protected checkOpen(key: string): boolean {
        return !!this.multiselectOpen.get(key);
    }

    protected changeOpen(key: string, forceState: boolean | null = null): void {
        this.multiselectOpen.set(key, !this.checkOpen(key));
        // console.log('change', key);
        // if (forceState === null) {
        //     this.multiselectOpen.set(key, !this.checkOpen(key));
        //     return;
        // }
        //
        // if (this.checkOpen(key) === forceState) {
        //     this.multiselectOpen.set(key, !forceState);
        // }
    }

    protected deleteImage(): void {
        this.form.controls.image.setValue(null);
    }

    protected save(e: Event) {
        e.preventDefault();

        if (!this.form.valid) {
            tuiMarkControlAsTouchedAndValidate(this.form);
            return;
        }

        const image = this.form.controls.image.value;
        const imageName = uuidGenerator();

        let observer = of(false);

        if (image) {
            observer = this.supabaseService
                .uploadPlanImage(imageName, image)
                .pipe(map(() => true));
        }

        this.submitLoader$.next(true);

        observer
            .pipe(
                switchMap(isImage => {
                    const data = planToDbMapper(
                        this.form.value,
                        isImage ? imageName : null,
                    );
                    return this.supabaseService.addPlan(data);
                }),
                finalize(() => this.submitLoader$.next(false)),
            )
            .subscribe(() => this.router.navigate(['plans']));
    }
}
