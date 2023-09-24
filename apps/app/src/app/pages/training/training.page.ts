import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {
    TuiContextWithImplicit,
    TuiLetModule,
    tuiMarkControlAsTouchedAndValidate,
    tuiPure,
    TuiStringHandler,
} from '@taiga-ui/cdk';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {
    TuiDataListWrapperModule,
    TuiInputDateModule,
    TuiInputModule,
    TuiInputNumberModule,
    TuiInputSliderModule,
    TuiInputTimeModule,
    TuiRadioBlockModule,
    TuiSelectModule,
    TuiTextareaModule,
} from '@taiga-ui/kit';
import {
    TuiButtonModule,
    TuiDataListModule,
    TuiGroupModule,
    TuiLoaderModule,
    TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {BehaviorSubject, finalize, map, of, shareReplay, switchMap, tap} from 'rxjs';
import {CATEGORIES} from '@nw-app/constants';
import {PlanDb, TrainingDb} from '@nw-app/models';
import {SupabaseService} from '@nw-app/services/supabase.service';
import {trainingFromDbMapper, trainingToDbMapper} from '@nw-app/utils';

@Component({
    selector: 'nw-training',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        TuiLetModule,
        ReactiveFormsModule,
        TuiInputDateModule,
        TuiInputTimeModule,
        TuiInputModule,
        TuiInputSliderModule,
        TuiTextfieldControllerModule,
        TuiInputNumberModule,
        TuiTextareaModule,
        TuiButtonModule,
        TuiSelectModule,
        TuiDataListWrapperModule,
        TuiGroupModule,
        TuiRadioBlockModule,
        TuiDataListModule,
        TuiLoaderModule,
    ],
    templateUrl: './training.page.html',
    styleUrls: ['./training.page.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingPage implements OnInit {
    private initialData: TrainingDb | null = null;

    protected readonly plans$ = this.supabaseService.getPlans().pipe(
        map(({data}) => data),
        shareReplay({bufferSize: 1, refCount: true}),
    );
    protected readonly categories = CATEGORIES;
    protected readonly routeId = this.route.snapshot.paramMap.get('id');

    protected readonly formLoader$ = new BehaviorSubject<boolean>(false);
    protected readonly submitLoader$ = new BehaviorSubject<boolean>(false);

    protected readonly form = new FormGroup({
        date: new FormControl(),
        time: new FormControl(),
        place: new FormControl(),
        target: new FormControl(),
        category: new FormControl(),
        searchType: new FormControl(),
        source: new FormControl(),
        count: new FormControl(1),
        sourcePlace: new FormControl(),
        waitTime: new FormControl(),
        distractions: new FormControl(),
        temperature: new FormControl(),
        humidity: new FormControl(),
        wind: new FormControl(),
        conclusion: new FormControl(),
        planId: new FormControl(null),
    });

    get submitText() {
        return this.routeId ? 'Обновить' : 'Сохранить';
    }

    constructor(
        private readonly supabaseService: SupabaseService,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
    ) {}

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');

        if (id) {
            this.formLoader$.next(true);
            this.supabaseService
                .getTrainingById(id)
                .pipe(finalize(() => this.formLoader$.next(false)))
                .subscribe(({data}) => {
                    this.form.setValue(trainingFromDbMapper(data));
                    this.initialData = data;
                });
        }
    }

    save(e: Event) {
        e.stopPropagation();

        if (!this.form.valid) {
            tuiMarkControlAsTouchedAndValidate(this.form);
            return;
        }

        this.submitLoader$.next(true);

        const data = trainingToDbMapper(this.form.value);

        const observable = this.initialData
            ? this.supabaseService.updateTraining({...this.initialData, ...data})
            : this.supabaseService.addTraining(data);

        observable
            .pipe(finalize(() => this.submitLoader$.next(false)))
            .subscribe(() => this.router.navigate(['trainings']));
    }

    @tuiPure
    planStringify(
        items: readonly PlanDb[],
    ): TuiStringHandler<TuiContextWithImplicit<number>> {
        const map = new Map(
            items.map(({id, title}) => [id, `${id} ${title}`] as [number, string]),
        );

        return ({$implicit}: TuiContextWithImplicit<number>) => map.get($implicit) || '';
    }
}
