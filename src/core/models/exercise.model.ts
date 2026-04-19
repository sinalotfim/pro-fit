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
    preparation: string;
    execution: string[];
    keyTips: string[];
}
