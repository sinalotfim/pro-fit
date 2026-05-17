import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Exercise } from '../../../core/models/exercise.model';

export type ExerciseNamePart = { text: string; match: boolean };

const PLACEHOLDER_IMAGE = 'assets/exercises/placeholder.svg';

@Component({
    selector: 'pf-exercise-item',
    templateUrl: './exercise-item.component.html',
    styleUrls: ['./exercise-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseItemComponent {
    readonly exercise = input.required<Exercise>();
    readonly nameParts = input.required<readonly ExerciseNamePart[]>();

    protected readonly placeholderImage = PLACEHOLDER_IMAGE;

    protected onImageError(event: Event): void {
        const img = event.target as HTMLImageElement | null;
        if (img && !img.src.endsWith(PLACEHOLDER_IMAGE)) {
            img.src = PLACEHOLDER_IMAGE;
        }
    }
}
