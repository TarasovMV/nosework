import {PlanDb} from '@nw-app/models';

export const planToDbMapper = (data: any): PlanDb => {
    return {
        training_aims: ['h'],
        smell_affections: ['h'],
        smell_factors: ['h'],
        training_aims_description: '',
        smell_affections_descriptions: '',
        smell_factors_descriptions: '',
    };
};

export const planFromDbMapper = (data: PlanDb): any => {
    return {} as any;
};
