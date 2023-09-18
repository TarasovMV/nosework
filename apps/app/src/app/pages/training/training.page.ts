import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TuiLetModule} from '@taiga-ui/cdk';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'nw-training',
    standalone: true,
    imports: [CommonModule, RouterLink, TuiLetModule, ReactiveFormsModule],
    templateUrl: './training.page.html',
    styleUrls: ['./training.page.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingPage {
    protected readonly form = new FormGroup({});

    save(e: Event) {
        e.stopPropagation();
    }
}
