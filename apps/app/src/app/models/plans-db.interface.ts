export interface PlanDb {
    id?: number;
    created_at?: DateString;
    user_id?: UUID;
    title: string;
    image: UUID | null;
    training_aims: string[];
    smell_affections: string[];
    smell_factors: string[];
    smell_affections_descriptions: string;
    smell_factors_descriptions: string;
}
