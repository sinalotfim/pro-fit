import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import { WorkoutService } from '../../core/services/workout.service';

const PLACEHOLDER_IMAGE = 'assets/workouts/placeholder.svg';
const EMPTY_STATE_IMAGE = 'assets/workouts/barbell.svg';

@Component({
    selector: 'pf-workout',
    templateUrl: 'workout.component.html',
    styleUrls: ['workout.component.scss'],
    imports: [CommonModule, LucideAngularModule],
})
export class WorkoutComponent {
    private readonly router = inject(Router);
    private readonly store = inject(WorkoutService);

    readonly placeholderImage = PLACEHOLDER_IMAGE;
    readonly emptyStateImage = EMPTY_STATE_IMAGE;

    readonly workouts = this.store.workoutList;

    handleImageError(event: Event): void {
        const img = event.target as HTMLImageElement;
        if (!img.src.endsWith(PLACEHOLDER_IMAGE)) {
            img.src = PLACEHOLDER_IMAGE;
        }
    }

    handleCreate(): void {
        this.router.navigate(['/workout/new'], {
            queryParams: { n: this.store.newWorkoutId() },
        });
    }
}
