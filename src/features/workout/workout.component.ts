import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { WorkoutStore } from '../../core/stores/workout.store';

const PLACEHOLDER_IMAGE = 'assets/workouts/placeholder.svg';
const EMPTY_STATE_IMAGE = 'assets/workouts/barbell.svg';

@Component({
    selector: 'pf-workout',
    templateUrl: 'workout.component.html',
    styleUrls: ['workout.component.scss'],
    imports: [CommonModule],
})
export class WorkoutComponent {
    private readonly router = inject(Router);
    private readonly store = inject(WorkoutStore);

    readonly placeholderImage = PLACEHOLDER_IMAGE;
    readonly emptyStateImage = EMPTY_STATE_IMAGE;

    readonly workouts = this.store.workouts;

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement | null;
        if (img && img.src && !img.src.endsWith(PLACEHOLDER_IMAGE)) {
            img.src = PLACEHOLDER_IMAGE;
        }
    }

    onCreateWorkout(): void {
        this.router.navigate(['/workout/new'], {
            queryParams: { n: this.store.nextNewTrainingNumber() },
        });
    }
}
