import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {map, shareReplay} from 'rxjs';
import {TuiLetModule} from '@taiga-ui/cdk';
import {Router, RouterLink} from '@angular/router';
import {TuiButtonModule} from '@taiga-ui/core';
import {SupabaseService} from '@nw-app/services/supabase.service';

@Component({
    selector: 'nw-plans',
    standalone: true,
    imports: [CommonModule, TuiLetModule, RouterLink, TuiButtonModule],
    templateUrl: './plans.page.html',
    styleUrls: ['./plans.page.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlansPage {
    readonly plans$ = this.supabaseService.getPlans().pipe(
        map(({data}) => data),
        shareReplay({bufferSize: 1, refCount: true}),
    );

    constructor(
        private readonly supabaseService: SupabaseService,
        private readonly router: Router,
    ) {}

    create() {
        this.router.navigate(['plan']);
    }
}
