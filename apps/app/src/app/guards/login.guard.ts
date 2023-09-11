import {inject} from '@angular/core';
import {SupabaseService} from '../services/supabase.service';
import {map} from 'rxjs';
import {Router} from '@angular/router';

export const loginGuard = () => {
    const supabaseService = inject(SupabaseService);
    const router = inject(Router);

    return supabaseService
        .getSession()
        .pipe(map(res => (!res.data.session ? true : router.createUrlTree(['']))));
};
