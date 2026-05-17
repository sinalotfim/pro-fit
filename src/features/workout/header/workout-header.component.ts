import { Component, input, output } from '@angular/core';
import { LucideAngularModule, Plus } from 'lucide-angular';

@Component({
    selector: 'pf-workout-header',
    templateUrl: './workout-header.component.html',
    styleUrls: ['./workout-header.component.scss'],
    imports: [LucideAngularModule],
})
export class WorkoutHeaderComponent {
    readonly title = input('Workouts');

    readonly createClick = output<void>();

    protected readonly plusIcon = Plus;

    protected onCreateClick(): void {
        this.createClick.emit();
    }
}
