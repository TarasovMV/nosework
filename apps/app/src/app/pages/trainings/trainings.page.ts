import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {TuiLetModule} from '@taiga-ui/cdk';
import {TuiButtonModule, TuiLinkModule} from '@taiga-ui/core';
import {map, shareReplay} from 'rxjs';
import {SupabaseService} from '@nw-app/services/supabase.service';

@Component({
    selector: 'nw-trainings',
    standalone: true,
    imports: [CommonModule, RouterLink, TuiLetModule, TuiButtonModule, TuiLinkModule],
    templateUrl: './trainings.page.html',
    styleUrls: ['./trainings.page.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingsPage {
    protected readonly trainings$ = this.supabaseService.getTrainings().pipe(
        map(({data}) => data),
        shareReplay({bufferSize: 1, refCount: true}),
    );

    constructor(
        private readonly supabaseService: SupabaseService,
        private readonly router: Router,
    ) {}

    create() {
        this.router.navigate(['training']);
    }
}
