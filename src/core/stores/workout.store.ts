import { Injectable, computed, signal } from '@angular/core';

export type WorkoutPreviewExercise = {
    name: string;
    equipment: string;
    sets: number;
    rep: string;
};

export type WorkoutPreview = {
    name: string;
    exerciseCount: number;
    image?: string;
    preview: WorkoutPreviewExercise[];
};

const SEED: WorkoutPreview[] = [
    {
        name: 'Full Body Workout',
        exerciseCount: 7,
        image: 'assets/workouts/full-body.png',
        preview: [
            { name: 'Front Raise', equipment: 'Dumbbell', sets: 3, rep: '12' },
            { name: 'Side Lunge', equipment: 'Dumbbell', sets: 3, rep: '12' },
            { name: 'Russian Twist', equipment: 'Dumbbell', sets: 3, rep: '40s' },
        ],
    },
    {
        name: 'Chest Workout',
        exerciseCount: 5,
        image: 'assets/workouts/chest.png',
        preview: [
            { name: 'Bench Press', equipment: 'Dumbbell', sets: 3, rep: '12' },
            { name: 'Pec Deck Fly', equipment: 'Machine', sets: 3, rep: '12' },
            { name: 'Bench Press', equipment: 'Smith Machine', sets: 3, rep: '12' },
        ],
    },
    {
        name: 'Back Workout',
        exerciseCount: 5,
        image: 'assets/workouts/back.png',
        preview: [
            { name: 'Bent-over Row', equipment: 'Barbell', sets: 3, rep: '12' },
            { name: 'Lat Pulldown', equipment: 'Cable', sets: 3, rep: '12' },
            { name: 'Deadlift', equipment: 'Barbell', sets: 3, rep: '12' },
        ],
    },
];

@Injectable({ providedIn: 'root' })
export class WorkoutStore {
    private readonly _workouts = signal<WorkoutPreview[]>(SEED);

    readonly workouts = this._workouts.asReadonly();

    readonly newTrainingCount = computed(
        () => this._workouts().filter((w) => /^new training\b/i.test(w.name)).length,
    );

    addWorkout(workout: WorkoutPreview): void {
        this._workouts.update((arr) => [...arr, workout]);
    }

    nextNewTrainingNumber(): number {
        return this.newTrainingCount() + 1;
    }
}
