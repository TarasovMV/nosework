export interface TrainingDb {
    date: DateString;
    time: TimeString;
    place: string;
    target: string;
    category: string;
    search_type: string;
    source: string;
    count: number;
    source_place: string;
    wait_time: number;
    distractions: string;
    temperature: number;
    humidity: number;
    wind: number;
    conclusion: number;
    plan_id: number;
}
