import {Route} from '@angular/router';
import {authGuard, loginGuard} from '@nw-app/guards';

export const appRoutes: Route[] = [
    {
        path: 'auth',
        canActivate: [loginGuard],
        loadComponent: () => import('./pages/auth/auth.page').then(c => c.AuthPage),
    },
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
            {
                path: 'plan/:id',
                loadComponent: () =>
                    import('./pages/plan/plan.page').then(c => c.PlanPage),
            },
            {
                path: 'plans',
                loadComponent: () =>
                    import('./pages/plans/plans.page').then(c => c.PlansPage),
            },
            {
                path: 'training',
                loadComponent: () =>
                    import('./pages/training/training.page').then(c => c.TrainingPage),
            },
            {
                path: 'training/:id',
                loadComponent: () =>
                    import('./pages/training/training.page').then(c => c.TrainingPage),
            },
            {
                path: '**',
                redirectTo: 'plans',
            },
        ],
    },
    {
        path: '**',
        redirectTo: '',
    },
];
