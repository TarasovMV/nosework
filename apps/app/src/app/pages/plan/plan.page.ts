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
    TuiDataListModule,
    TuiDropdownModule,
    TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {SMELL_AFFECTIONS, SMELL_FACTORS, TRAINING_AIMS} from '../../constants';
import {
    TUI_DEFAULT_MATCHER,
    TuiClickOutsideModule,
    TuiFocusedModule,
    tuiPure,
} from '@taiga-ui/cdk';
import {Observable, switchMap} from 'rxjs';

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

    readonly form = new FormGroup({
        trainingAim: new FormControl([]),
        image: new FormControl<any>(null),
        smellAffection: new FormControl([]),
        smellAffectionDescription: new FormControl(''),
        smellFactor: new FormControl([]),
        smellFactorDescription: new FormControl(''),
    });

    readonly imageSrc$ = this.form.controls.image.valueChanges.pipe(
        switchMap(file => {
            return new Observable(sub => {
                const reader = new FileReader();
                reader.onload = (event: any) => {
                    sub.next(event.target.result);
                };
                reader.onerror = event => {
                    sub.next(null);
                };
                reader.readAsDataURL(file);
            });
        }),
    );

    checkOpen(key: string): boolean {
        console.log(this.form.value.image);
        return !!this.multiselectOpen.get(key);
    }

    changeOpen(key: string): void {
        this.multiselectOpen.set(key, !this.checkOpen(key));
    }
}
