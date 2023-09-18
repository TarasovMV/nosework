import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ApplicationConfig, importProvidersFrom, isDevMode} from '@angular/core';
import {provideRouter, withEnabledBlockingInitialNavigation} from '@angular/router';
import {TuiRootModule} from '@taiga-ui/core';
import {TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE} from '@taiga-ui/i18n';
import {appRoutes} from './app.routes';
import {provideServiceWorker} from '@angular/service-worker';
import {of} from 'rxjs';

export const appConfig = (): ApplicationConfig => ({
    providers: [
        provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
        importProvidersFrom(BrowserAnimationsModule, TuiRootModule),
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),
        {
            provide: TUI_LANGUAGE,
            useValue: of(TUI_RUSSIAN_LANGUAGE),
        },
    ],
});
