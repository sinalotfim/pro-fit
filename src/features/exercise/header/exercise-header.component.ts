import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    ViewChild,
    input,
    output,
} from '@angular/core';
import { LucideAngularModule, Funnel, Search, X } from 'lucide-angular';

import { BodyPart } from '../../../core/models/exercise.model';

export type ActiveFilterChip =
    | { kind: 'bodyPart'; value: BodyPart; label: string }
    | { kind: 'equipment'; value: string; label: string };

@Component({
    selector: 'pf-exercise-header',
    templateUrl: './exercise-header.component.html',
    styleUrls: ['./exercise-header.component.scss'],
    imports: [LucideAngularModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseHeaderComponent {
    readonly title = input('Exercises');

    readonly searchActive = input.required<boolean>();
    readonly query = input.required<string>();
    readonly hasActiveFilter = input.required<boolean>();
    readonly filterOpen = input.required<boolean>();
    readonly count = input.required<number>();
    readonly activeFilterChips = input.required<readonly ActiveFilterChip[]>();

    readonly searchOpen = output<void>();
    readonly searchClose = output<void>();
    readonly queryInput = output<Event>();
    readonly filterClick = output<void>();
    readonly clearFilters = output<void>();
    readonly removeChip = output<ActiveFilterChip>();

    protected readonly icons = {
        search: Search,
        close: X,
        filter: Funnel,
    };

    @ViewChild('searchBox')
    private searchBox?: ElementRef<HTMLInputElement>;

    focusSearch(): void {
        this.searchBox?.nativeElement.focus();
    }

    protected onQueryInput(event: Event): void {
        this.queryInput.emit(event);
    }
}
