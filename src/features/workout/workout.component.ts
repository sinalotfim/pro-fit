import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type WorkoutPreviewExercise = {
    name: string;
    equipment: string;
    sets: number;
    rep: string;
};

type WorkoutPreview = {
    name: string;
    exerciseCount: number;
    image?: string;
    preview: WorkoutPreviewExercise[];
};

const PLACEHOLDER_IMAGE = 'assets/workouts/placeholder.svg';
const EMPTY_STATE_IMAGE = 'assets/workouts/barbell.svg';

@Component({
    selector: 'pf-workout',
    templateUrl: 'workout.component.html',
    styleUrls: ['workout.component.scss'],
    imports: [CommonModule],
})
export class WorkoutComponent {
    readonly placeholderImage = PLACEHOLDER_IMAGE;
    readonly emptyStateImage = EMPTY_STATE_IMAGE;

    readonly workouts: WorkoutPreview[] = [
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

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement | null;
        if (img && img.src && !img.src.endsWith(PLACEHOLDER_IMAGE)) {
            img.src = PLACEHOLDER_IMAGE;
        }
    }

    onCreateWorkout(): void {
        // TODO: navigate to workout creation flow
    }
}
