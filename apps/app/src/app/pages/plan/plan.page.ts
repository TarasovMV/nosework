import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    TuiDataListWrapperModule,
    TuiInputFilesModule,
    TuiMultiSelectModule,
    TuiTextareaModule,
} from '@taiga-ui/kit';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    TuiButtonModule,
    TuiDataListModule,
    TuiDropdownModule,
    TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {TuiAppBarModule} from '@taiga-ui/addon-mobile';
import {SMELL_AFFECTIONS, SMELL_FACTORS, TRAINING_AIMS} from '@nw-app/constants';
import {Observable, of, switchMap} from 'rxjs';
import {DeletableImageComponent} from '../../components/deletable-image/deletable-image.component';
import {tuiMarkControlAsTouchedAndValidate} from '@taiga-ui/cdk';
import {SupabaseService} from '../../services/supabase.service';
import {planToDbMapper} from '@nw-app/utils';

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
    ],
    templateUrl: './plan.page.html',
    styleUrls: ['./plan.page.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanPage {
    private readonly multiselectOpen = new Map<string, boolean>();

    protected readonly trainingAims = TRAINING_AIMS;
    protected readonly smellAffections = SMELL_AFFECTIONS;
    protected readonly smellFactors = SMELL_FACTORS;

    protected readonly form = new FormGroup({
        trainingAim: new FormControl([]),
        image: new FormControl<any>(null),
        smellAffection: new FormControl([]),
        smellAffectionDescription: new FormControl(''),
        smellFactor: new FormControl([]),
        smellFactorDescription: new FormControl(''),
    });

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

    constructor(private readonly supabaseService: SupabaseService) {}

    protected checkOpen(key: string): boolean {
        return !!this.multiselectOpen.get(key);
    }

    protected changeOpen(key: string): void {
        this.multiselectOpen.set(key, !this.checkOpen(key));
    }

    protected deleteImage(): void {
        this.form.controls.image.setValue(null);
    }

    protected save(e: Event) {
        e.preventDefault();

        this.supabaseService.getPlans().subscribe(r => console.log(r));

        // if (!this.form.valid) {
        //     tuiMarkControlAsTouchedAndValidate(this.form);
        //     return;
        // }
        //
        // const data = planToDbMapper(this.form);
        //
        // this.supabaseService.addPlan(data).subscribe();
    }
}
