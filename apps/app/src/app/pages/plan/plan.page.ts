import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'nw-plan',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './plan.page.html',
    styleUrls: ['./plan.page.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanPage {}
