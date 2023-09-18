import {
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiThemeNightModule,
    TuiModeModule,
} from '@taiga-ui/core';
import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ThemeService} from './services/theme.service';
import {map, Observable} from 'rxjs';
import {AsyncPipe, NgIf} from '@angular/common';
import {TuiBrightness} from '@taiga-ui/core/types';

@Component({
    standalone: true,
    imports: [
        RouterModule,
        TuiRootModule,
        TuiDialogModule,
        TuiAlertModule,
        TuiThemeNightModule,
        TuiModeModule,
        AsyncPipe,
        NgIf,
    ],
    selector: 'nw-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent {
    protected readonly theme$: Observable<TuiBrightness | null> =
        this.themeService.isDark$.pipe(map(dark => (dark ? 'onDark' : null)));

    constructor(private readonly themeService: ThemeService) {}
}
