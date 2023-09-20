import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ThemeService} from '@nw-app/services/theme.service';
import {map} from 'rxjs';

@Component({
    selector: 'nw-header-wrapper',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header-wrapper.component.html',
    styleUrls: ['./header-wrapper.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderWrapperComponent {
    protected readonly logoSrc$ = this.themeService.isDark$.pipe(
        map(isDark => `assets/images/nosework-logo-${isDark ? 'dark' : 'light'}.png`),
    );

    constructor(private readonly themeService: ThemeService) {}
}
