import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TuiInputModule} from '@taiga-ui/kit';
import {TuiButtonModule, TuiLinkModule} from '@taiga-ui/core';
import {SupabaseService} from '../../services/supabase.service';
import {tuiMarkControlAsTouchedAndValidate} from '@taiga-ui/cdk';
import {BehaviorSubject, finalize, from, map} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

enum AuthPageType {
    Auth = 'AUTH',
    Registration = 'REGISTRATION',
}

@Component({
    selector: 'nw-auth',
    standalone: true,
    imports: [
        CommonModule,
        TuiInputModule,
        ReactiveFormsModule,
        TuiButtonModule,
        TuiLinkModule,
    ],
    templateUrl: './auth.page.html',
    styleUrls: ['./auth.page.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPage {
    private readonly pageType$ = new BehaviorSubject<AuthPageType>(AuthPageType.Auth);

    readonly form = new FormGroup({
        email: new FormControl<string>('', {
            validators: [Validators.required, Validators.email],
            nonNullable: true,
        }),
        password: new FormControl<string>('', {
            validators: [Validators.required, Validators.minLength(6)],
            nonNullable: true,
        }),
    });

    readonly buttonText$ = this.pageType$.pipe(
        map(type => (type === AuthPageType.Auth ? 'Войти' : 'Зарегистрироваться')),
    );

    readonly linkText$ = this.pageType$.pipe(
        map(type =>
            type === AuthPageType.Auth ? 'Зерегистрироваться' : 'Уже есть аккаунт',
        ),
    );

    readonly isLoad$ = new BehaviorSubject<boolean>(false);

    constructor(private readonly supabaseService: SupabaseService) {}

    changeType(event: Event) {
        event.preventDefault();

        this.pageType$.next(
            this.pageType$.getValue() === AuthPageType.Auth
                ? AuthPageType.Registration
                : AuthPageType.Auth,
        );
    }

    sign(event: Event) {
        event.preventDefault();

        if (!this.form.valid) {
            tuiMarkControlAsTouchedAndValidate(this.form);
            return;
        }

        const {email, password} = this.form.value;

        if (!email || !password) {
            return;
        }

        const methodMapper = {
            [AuthPageType.Auth]: () => this.supabaseService.signIn(email, password),
            [AuthPageType.Registration]: () =>
                this.supabaseService.signUp(email, password),
        };

        this.isLoad$.next(true);
        from(methodMapper[this.pageType$.getValue()]())
            .pipe(
                finalize(() => this.isLoad$.next(false)),
                takeUntilDestroyed(),
            )
            .subscribe();
    }
}
