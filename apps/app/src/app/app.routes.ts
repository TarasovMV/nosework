import {Route} from '@angular/router';
import {authGuard} from './guards/auth.guard';
import {loginGuard} from './guards/login.guard';

export const appRoutes: Route[] = [
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/plan/plan.page').then(c => c.PlanPage),
    },
    {
        path: 'auth',
        canActivate: [loginGuard],
        loadComponent: () => import('./pages/auth/auth.page').then(c => c.AuthPage),
    },
];
