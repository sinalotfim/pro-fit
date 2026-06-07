import { Component, output } from '@angular/core';
import { Dumbbell, LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'pf-workout-new-empty',
    templateUrl: './workout-new-empty.component.html',
    styleUrls: ['./workout-new-empty.component.scss'],
    imports: [LucideAngularModule],
})
export class WorkoutNewEmptyComponent {
    readonly addClick = output<void>();

    protected readonly dumbbellIcon = Dumbbell;

    protected onAddClick(): void {
        this.addClick.emit();
    }
}
