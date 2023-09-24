import {ChangeDetectionStrategy, Component, NgZone, OnInit} from '@angular/core';
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
import {TuiDestroyService, tuiMarkControlAsTouchedAndValidate} from '@taiga-ui/cdk';
import {SupabaseService} from '../../services/supabase.service';
import {
    compressImage,
    planFromDbMapper,
    planToDbMapper,
    uuidGenerator,
} from '@nw-app/utils';
import {ActivatedRoute, Router} from '@angular/router';
import {PlanDb} from '@nw-app/models';
import {fromPromise} from 'rxjs/internal/observable/innerFrom';

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
    providers: [TuiDestroyService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanPage implements OnInit {
    private initialData: PlanDb | null = null;

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
        private readonly ngZone: NgZone,
        private destroy$: TuiDestroyService,
    ) {}

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');

        if (id) {
            this.formLoader$.next(true);
            this.supabaseService
                .getPlanById(id)
                .pipe(
                    tap(({data}) => this.form.setValue(planFromDbMapper(data))),
                    tap(({data}) => (this.initialData = data)),
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
                    takeUntil(this.destroy$),
                )
                .subscribe();
        }
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

        const imageName = uuidGenerator();

        const addObserver = of(this.form.controls.image.value).pipe(
            switchMap(file =>
                file
                    ? this.supabaseService
                          .uploadPlanImage(imageName, file)
                          .pipe(map(() => true))
                    : of(false),
            ),
            switchMap(isImage => {
                const data = planToDbMapper(this.form.value, isImage ? imageName : null);
                return this.supabaseService.addPlan(data);
            }),
        );

        const updateObserver = of(this.initialData?.image).pipe(
            switchMap(imageName =>
                imageName ? this.supabaseService.deletePlanImage(imageName) : of(null),
            ),
            map(() => this.form.controls.image.value),
            switchMap(file =>
                file
                    ? this.uploadImage(imageName, file).pipe(map(() => true))
                    : of(false),
            ),
            switchMap(isImage => {
                const data = planToDbMapper(this.form.value, isImage ? imageName : null);
                return this.supabaseService.updatePlan({...this.initialData, ...data});
            }),
        );

        const observer = this.initialData ? updateObserver : addObserver;

        this.submitLoader$.next(true);

        observer
            .pipe(
                finalize(() => this.submitLoader$.next(false)),
                takeUntil(this.destroy$),
            )
            .subscribe(() => this.router.navigate(['plans']));
    }

    private uploadImage(fileName: string, file: File) {
        // return this.ngZone
        //     .run(() => compressImage$(file))
        return fromPromise(compressImage(file)).pipe(
            switchMap(compressFile =>
                this.supabaseService.uploadPlanImage(fileName, compressFile as File),
            ),
        );
    }
}
