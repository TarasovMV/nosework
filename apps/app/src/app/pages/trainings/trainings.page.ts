import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TuiLetModule} from '@taiga-ui/cdk';

@Component({
    selector: 'nw-trainings',
    standalone: true,
    imports: [CommonModule, RouterLink, TuiLetModule],
    templateUrl: './trainings.page.html',
    styleUrls: ['./trainings.page.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingsPage {}
