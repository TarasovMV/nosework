import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TuiInputModule, TuiInputPasswordModule} from '@taiga-ui/kit';
import {
    TuiAlertService,
    TuiButtonModule,
    TuiDialogService,
    TuiHintModule,
    TuiLinkModule,
} from '@taiga-ui/core';
import {SupabaseService} from '../../services/supabase.service';
import {tuiMarkControlAsTouchedAndValidate} from '@taiga-ui/cdk';
import {BehaviorSubject, finalize, map} from 'rxjs';
import {Router} from '@angular/router';
import {AuthHeaderComponent} from './components/auth-header/auth-header.component';

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
        TuiInputPasswordModule,
        TuiHintModule,
        AuthHeaderComponent,
    ],
    templateUrl: './auth.page.html',
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

    readonly title$ = this.pageType$.pipe(
        map(type => (type === AuthPageType.Auth ? 'Вход' : 'Регистрация')),
    );

    readonly linkText$ = this.pageType$.pipe(
        map(type =>
            type === AuthPageType.Auth ? 'Зерегистрироваться' : 'Уже есть аккаунт',
        ),
    );

    readonly isLoad$ = new BehaviorSubject<boolean>(false);

    constructor(
        private readonly supabaseService: SupabaseService,
        private readonly alertService: TuiAlertService,
        private readonly dialogService: TuiDialogService,
        private readonly router: Router,
    ) {}

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
        methodMapper[this.pageType$.getValue()]()
            .pipe(
                finalize(() => this.isLoad$.next(false)),
                // takeUntilDestroyed(),
            )
            .subscribe({
                next: () => this.successSign(),
                error: () => this.errorSign(),
            });
    }

    private successSign() {
        if (this.pageType$.getValue() === AuthPageType.Auth) {
            this.router.navigate(['/']).then();
            return;
        }

        this.pageType$.next(AuthPageType.Auth);
        this.dialogService
            .open('Перейдите в указанную почту, чтобы подтвердить ее', {
                closeable: false,
                label: 'Регистрация',
            })
            .subscribe();
    }

    private errorSign() {
        const showAlert = (msg: string) =>
            this.alertService.open(msg, {status: 'error'}).subscribe();

        if (this.pageType$.getValue() === AuthPageType.Auth) {
            showAlert('Ошибка авторизации');
            return;
        }

        showAlert('Ошибка регистрации');
    }
}
