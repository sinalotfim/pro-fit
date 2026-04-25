export type BodyPart =
    | 'Arm'
    | 'Back'
    | 'Chest'
    | 'Core'
    | 'Leg'
    | 'Shoulder'
    | 'Glutes'
    | 'Full Body';

export interface Exercise {
    id: number;
    name: string;
    otherNames: string[];
    equipment: string;
    sets: number;
    reps: number;
    imageUrl: string;
    videoUrls: string[];
    focusArea: string;
    bodyPart: BodyPart[];
    preparation: string;
    execution: string[];
    keyTips: string[];
}
