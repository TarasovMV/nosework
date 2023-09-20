import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DOCUMENT} from '@angular/common';

const APP_LIGHT_COLOR = '#ffffff';
const APP_DARK_COLOR = '#222';
const THEME_KEY = 'theme';

@Injectable({providedIn: 'root'})
export class ThemeService {
    readonly isDark$ = new BehaviorSubject<boolean>(this.storageGet());

    constructor(@Inject(DOCUMENT) private readonly document: Document) {}

    setDarkTheme() {
        this.isDark$.next(true);
        this.setAppThemeColor(APP_DARK_COLOR);
        this.storageSave(true);
    }

    setLightTheme() {
        this.isDark$.next(false);
        this.setAppThemeColor(APP_LIGHT_COLOR);
        this.storageSave(false);
    }

    toggleTheme() {
        if (this.isDark$.getValue()) {
            this.setLightTheme();
        } else {
            this.setDarkTheme();
        }
    }

    private setAppThemeColor(color: string) {
        (this.document.getElementById('themeColor') as any).content = color;
    }

    private storageSave(isDark: boolean) {
        const key = isDark ? 'dark' : 'light';
        localStorage.setItem(THEME_KEY, key);
    }

    private storageGet() {
        const key = localStorage.getItem('theme');
        if (!key || key === 'light') {
            return false;
        }
        return true;
    }
}
