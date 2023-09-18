import {Injectable} from '@angular/core';
import {
    AuthChangeEvent,
    AuthSession,
    createClient,
    Session,
    SupabaseClient,
    User,
} from '@supabase/supabase-js';
import {environment} from '../../environments/environment';
import {from, of, switchMap, tap, throwError} from 'rxjs';
import {PlanDb} from '../models';

export interface Profile {
    id?: string;
    username: string;
    website: string;
    avatar_url: string;
}

@Injectable({
    providedIn: 'root',
})
export class SupabaseService {
    private supabase: SupabaseClient;
    session: AuthSession | null = null;

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }

    getSession() {
        return from(this.supabase.auth.getSession()).pipe(
            tap(res => (this.session = res.data.session)),
        );
    }

    addPlan(data: PlanDb) {
        return from(this.supabase.from('plans').insert(data));
    }

    getPlanById(id: string) {
        return from(
            this.supabase
                .from('plans')
                .select(`*`)
                .eq('user_id', this.session?.user.id)
                .eq('id', id)
                .single(),
        );
    }

    getPlans() {
        return from(
            this.supabase
                .from('plans')
                .select(`*`)
                .eq('user_id', this.session?.user.id),
        );
    }

    profile(user: User) {
        return this.supabase
            .from('profiles')
            .select(`username, website, avatar_url`)
            .eq('id', user.id)
            .single();
    }

    authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
        return this.supabase.auth.onAuthStateChange(callback);
    }

    signIn(email: string, password: string) {
        return from(this.supabase.auth.signInWithPassword({email, password})).pipe(
            switchMap(res => (res.error ? throwError(() => '') : of(res))),
        );
    }

    signUp(email: string, password: string) {
        return from(this.supabase.auth.signUp({email, password})).pipe(
            switchMap(res => (res.error ? throwError(() => '') : of(res))),
        );
    }

    signOut() {
        return this.supabase.auth.signOut();
    }

    updateProfile(profile: Profile) {
        const update = {
            ...profile,
            updated_at: new Date(),
        };

        return this.supabase.from('profiles').upsert(update);
    }

    downloadPlanImage(path: string) {
        return from(
            this.supabase.storage.from('plan_images').download('private/' + path),
        );
    }

    uploadPlanImage(filePath: string, file: File) {
        return from(
            this.supabase.storage.from('plan_images').upload('private/' + filePath, file),
        );
    }
}
