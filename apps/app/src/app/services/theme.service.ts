import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DOCUMENT} from '@angular/common';

const APP_LIGHT_COLOR = '#ffffff';
const APP_DARK_COLOR = '#000000';

@Injectable({providedIn: 'root'})
export class ThemeService {
    readonly isDark$ = new BehaviorSubject<boolean>(false);

    constructor(@Inject(DOCUMENT) document: Document) {}

    setDarkTheme() {
        this.isDark$.next(true);
    }

    setLightTheme() {
        this.isDark$.next(false);
    }

    toggleTheme() {
        const currentColor = this.isDark$.getValue();
        this.isDark$.next(!currentColor);
        this.setAppThemeColor(currentColor ? APP_LIGHT_COLOR : APP_DARK_COLOR);
    }

    private setAppThemeColor(color: string) {
        (document.getElementById('themeColor') as any).content = color;
    }
}
