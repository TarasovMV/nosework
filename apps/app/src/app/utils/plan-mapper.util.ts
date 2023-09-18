import {PlanDb} from '@nw-app/models';

export const planToDbMapper = (data: any, imageName: string | null): PlanDb => {
    return {
        title: data.title,
        training_aims: data.trainingAim,
        smell_affections: data.smellAffection,
        smell_factors: data.smellFactor,
        image: imageName,
        smell_affections_descriptions: data.smellAffectionDescription,
        smell_factors_descriptions: data.smellFactorDescription,
    };
};

export const planFromDbMapper = (data: PlanDb): any => {
    return {
        title: data.title,
        image: null,
        trainingAim: data.training_aims,
        smellAffection: data.smell_affections,
        smellFactor: data.smell_factors,
        smellAffectionDescription: data.smell_affections_descriptions,
        smellFactorDescription: data.smell_factors_descriptions,
    } as any;
};
