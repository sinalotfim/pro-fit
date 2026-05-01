import { Injectable, Signal, computed, signal } from '@angular/core';

import { WorkoutListItem } from '../models';

const SEED: WorkoutListItem[] = [
    {
        id: 1,
        name: 'Full Body Workout',
        exerciseCount: 7,
        image: 'assets/workouts/full-body.png',
        exercises: [
            { name: 'Front Raise', equipment: 'Dumbbell', sets: 3, rep: '12' },
            { name: 'Side Lunge', equipment: 'Dumbbell', sets: 3, rep: '12' },
            { name: 'Russian Twist', equipment: 'Dumbbell', sets: 3, rep: '40s' },
        ],
    },
    {
        id: 2,
        name: 'Chest Workout',
        exerciseCount: 5,
        image: 'assets/workouts/chest.png',
        exercises: [
            { name: 'Bench Press', equipment: 'Dumbbell', sets: 3, rep: '12' },
            { name: 'Pec Deck Fly', equipment: 'Machine', sets: 3, rep: '12' },
            { name: 'Bench Press', equipment: 'Smith Machine', sets: 3, rep: '12' },
        ],
    },
    {
        id: 3,
        name: 'Back Workout',
        exerciseCount: 5,
        image: 'assets/workouts/back.png',
        exercises: [
            { name: 'Bent-over Row', equipment: 'Barbell', sets: 3, rep: '12' },
            { name: 'Lat Pulldown', equipment: 'Cable', sets: 3, rep: '12' },
            { name: 'Deadlift', equipment: 'Barbell', sets: 3, rep: '12' },
        ],
    },
];

@Injectable({ providedIn: 'root' })
export class WorkoutService {
    private readonly workouts = signal<WorkoutListItem[]>(SEED);

    readonly workoutList: Signal<WorkoutListItem[]> = this.workouts.asReadonly();
    readonly newWorkoutCount: Signal<number> = computed(() => {
        const regex: RegExp = /^new training\b/i;
        return this.workouts().filter((workout) => regex.test(workout.name)).length;
    });
    readonly newWorkoutId: Signal<number> = computed(() => {
        return this.newWorkoutCount() + 1;
    });

    store(workout: WorkoutListItem): void {
        this.workouts.update((list) => [...list, workout]);
    }
}
