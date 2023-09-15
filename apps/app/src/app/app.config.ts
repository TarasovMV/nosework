import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TuiRootModule} from '@taiga-ui/core';
import {ApplicationConfig, importProvidersFrom, isDevMode} from '@angular/core';
import {provideRouter, withEnabledBlockingInitialNavigation} from '@angular/router';
import {appRoutes} from './app.routes';
import {provideServiceWorker} from '@angular/service-worker';

export const appConfig = (): ApplicationConfig => ({
    providers: [
        provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
        importProvidersFrom(TuiRootModule, BrowserAnimationsModule),
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),
    ],
});
