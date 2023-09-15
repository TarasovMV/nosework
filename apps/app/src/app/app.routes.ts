import {Route} from '@angular/router';
import {authGuard, loginGuard} from '@nw-app/guards';

export const appRoutes: Route[] = [
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/main/main.page').then(c => c.MainPage),
        children: [
            {
                path: 'plan',
                loadComponent: () =>
                    import('./pages/plan/plan.page').then(c => c.PlanPage),
            },
        ],
    },
    {
        path: 'auth',
        canActivate: [loginGuard],
        loadComponent: () => import('./pages/auth/auth.page').then(c => c.AuthPage),
    },
    {
        path: '**',
        redirectTo: '',
    },
];
