import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {TuiLetModule} from '@taiga-ui/cdk';
import {TuiButtonModule} from '@taiga-ui/core';

@Component({
    selector: 'nw-trainings',
    standalone: true,
    imports: [CommonModule, RouterLink, TuiLetModule, TuiButtonModule],
    templateUrl: './trainings.page.html',
    styleUrls: ['./trainings.page.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingsPage {
    constructor(private readonly router: Router) {}

    create() {
        this.router.navigate(['training']);
    }
}
