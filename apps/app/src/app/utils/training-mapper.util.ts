import {TrainingDb} from '@nw-app/models';
import {TuiDay, TuiTime} from '@taiga-ui/cdk';

export const trainingToDbMapper = (data: any): TrainingDb => {
    return {
        date: data.date,
        time: data.time?.toString('HH:MM'),
        place: data.place,
        target: data.target,
        category: data.category,
        search_type: data.searchType,
        source: data.source,
        count: data.count,
        source_place: data.sourcePlace,
        wait_time: data.waitTime,
        distractions: data.distractions,
        temperature: data.temperature,
        humidity: data.humidity,
        wind: data.wind,
        conclusion: data.conclusion,
        plan_id: data.planId,
    };
};

export const trainingFromDbMapper = (data: TrainingDb): any => {
    return {
        date: data.date ? TuiDay.jsonParse(data.date) : null,
        time: data.time ? TuiTime.fromString(data.time) : null,
        place: data.place,
        target: data.target,
        category: data.category,
        searchType: data.search_type,
        source: data.source,
        count: data.count,
        sourcePlace: data.source_place,
        waitTime: data.wait_time,
        distractions: data.distractions,
        temperature: data.temperature,
        humidity: data.humidity,
        wind: data.wind,
        conclusion: data.conclusion,
        planId: data.plan_id,
    };
};
