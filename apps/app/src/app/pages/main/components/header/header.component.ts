import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderWrapperComponent} from '@nw-app/components/header-wrapper/header-wrapper.component';
import {ThemeToggleComponent} from '@nw-app/components/theme-toggle/theme-toggle.component';
import {Router, RouterLink} from '@angular/router';
import {TUI_IS_MOBILE} from '@taiga-ui/cdk';
import {
    TuiButtonModule,
    TuiDataListModule,
    TuiHostedDropdownModule,
} from '@taiga-ui/core';

@Component({
    selector: 'nw-header',
    standalone: true,
    imports: [
        CommonModule,
        HeaderWrapperComponent,
        ThemeToggleComponent,
        RouterLink,
        TuiHostedDropdownModule,
        TuiButtonModule,
        TuiDataListModule,
    ],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    protected isDotMenuOpen = false;

    protected readonly menu = [
        {
            label: 'Планы',
            action: () => this.router.navigate(['plans']),
            disabled: !this.isMobile,
        },
        {
            label: 'Тренировки',
            action: () => this.router.navigate(['trainings']),
            disabled: !this.isMobile,
        },
        {
            label: 'Выход',
            action: () => console.log('logout'),
        },
    ].filter(({disabled}) => !disabled);

    constructor(
        @Inject(TUI_IS_MOBILE) protected readonly isMobile: boolean,
        private readonly router: Router,
    ) {}
}
