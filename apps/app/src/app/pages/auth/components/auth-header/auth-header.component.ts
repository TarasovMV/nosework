import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderWrapperComponent} from '@nw-app/components/header-wrapper/header-wrapper.component';
import {RouterLink} from '@angular/router';
import {ThemeToggleComponent} from '@nw-app/components/theme-toggle/theme-toggle.component';

@Component({
    selector: 'nw-auth-header',
    standalone: true,
    imports: [CommonModule, HeaderWrapperComponent, RouterLink, ThemeToggleComponent],
    templateUrl: './auth-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthHeaderComponent {}
