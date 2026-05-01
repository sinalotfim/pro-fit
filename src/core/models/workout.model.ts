export type WorkoutExerciseListItem = {
    name: string;
    equipment: string;
    sets: number;
    rep: string;
};

export type WorkoutListItem = {
    id: number;
    name: string;
    exerciseCount: number;
    image?: string;
    exercises: WorkoutExerciseListItem[];
};
