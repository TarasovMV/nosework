import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TuiButtonModule} from '@taiga-ui/core';
import {ThemeService} from '@nw-app/services/theme.service';
import {map} from 'rxjs';

@Component({
    selector: 'nw-theme-toggle',
    standalone: true,
    imports: [CommonModule, TuiButtonModule],
    templateUrl: './theme-toggle.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
    protected readonly icon$ = this.themeService.isDark$.pipe(
        map(dark => (dark ? 'tuiIconMoonLarge' : 'tuiIconSunLarge')),
    );

    constructor(private readonly themeService: ThemeService) {}

    toggle() {
        this.themeService.toggleTheme();
    }
}
