import { Component, output } from '@angular/core';
import { Dumbbell, LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'pf-workout-empty',
    templateUrl: './workout-empty.component.html',
    styleUrls: ['./workout-empty.component.scss'],
    imports: [LucideAngularModule],
})
export class WorkoutEmptyComponent {
    readonly createClick = output<void>();

    protected readonly dumbbellIcon = Dumbbell;

    protected onCreateClick(): void {
        this.createClick.emit();
    }
}
