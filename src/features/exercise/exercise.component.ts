import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'pf-exercise',
    templateUrl: 'exercise.component.html',
    styleUrls: ['exercise.component.scss'],
    standalone: true,
    imports: [CommonModule],
})
export class ExerciseComponent {
    constructor() {}
}
