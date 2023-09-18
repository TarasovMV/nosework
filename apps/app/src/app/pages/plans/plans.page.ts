import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SupabaseService} from '../../services/supabase.service';
import {map, shareReplay} from 'rxjs';
import {TuiLetModule} from '@taiga-ui/cdk';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'nw-plans',
    standalone: true,
    imports: [CommonModule, TuiLetModule, RouterLink],
    templateUrl: './plans.page.html',
    styleUrls: ['./plans.page.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlansPage {
    readonly plans$ = this.supabaseService.getPlans().pipe(
        map(({data}) => data),
        shareReplay({bufferSize: 1, refCount: true}),
    );

    constructor(private readonly supabaseService: SupabaseService) {}
}
