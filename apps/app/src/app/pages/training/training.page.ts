import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TuiLetModule} from '@taiga-ui/cdk';
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
    TuiGroupModule,
    TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {BehaviorSubject} from 'rxjs';
import {CATEGORIES} from '@nw-app/constants';

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
    ],
    templateUrl: './training.page.html',
    styleUrls: ['./training.page.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingPage {
    protected readonly categories = CATEGORIES;

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
    });

    save(e: Event) {
        e.stopPropagation();
    }
}
