import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    computed,
    signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

import { EXERCISES } from '../../../core/constants/exercise.constant';
import { BodyPart, Exercise } from '../../../core/models/exercise.model';
import {
    ExerciseFilterComponent,
    ExerciseFilterState,
} from '../../exercise/exercise-filter/exercise-filter.component';

type HighlightPart = { text: string; match: boolean };

export type ActiveFilterChip =
    | { kind: 'bodyPart'; value: BodyPart; label: string }
    | { kind: 'equipment'; value: string; label: string };

const PLACEHOLDER_IMAGE = 'assets/exercises/placeholder.svg';

@Component({
    selector: 'pf-add-exercises-sheet',
    templateUrl: 'add-exercises-sheet.component.html',
    styleUrls: ['add-exercises-sheet.component.scss'],
    imports: [CommonModule, FormsModule, ExerciseFilterComponent, LucideAngularModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddExercisesSheetComponent {
    @Input() recents: readonly Exercise[] = [];
    @Input() allExercises: readonly Exercise[] = EXERCISES;

    @Output() readonly add = new EventEmitter<Exercise[]>();
    @Output() readonly close = new EventEmitter<void>();

    readonly placeholderImage = PLACEHOLDER_IMAGE;

    readonly query = signal('');
    readonly selectedIds = signal<ReadonlySet<number>>(new Set());

    readonly bodyPartFilter = signal<ReadonlySet<BodyPart>>(new Set());
    readonly equipmentFilter = signal<ReadonlySet<string>>(new Set());
    readonly filterOpen = signal(false);

    readonly hasActiveFilter = computed(
        () => this.bodyPartFilter().size > 0 || this.equipmentFilter().size > 0,
    );

    readonly activeFilterChips = computed<ActiveFilterChip[]>(() => {
        const chips: ActiveFilterChip[] = [];
        for (const value of this.bodyPartFilter()) {
            chips.push({ kind: 'bodyPart', value, label: value });
        }
        for (const value of this.equipmentFilter()) {
            chips.push({ kind: 'equipment', value, label: value });
        }
        return chips;
    });

    readonly filterState = computed<ExerciseFilterState>(() => ({
        bodyParts: this.bodyPartFilter(),
        equipment: this.equipmentFilter(),
    }));

    readonly filtered = computed<Exercise[]>(() => {
        const q = this.query().trim().toLowerCase();
        const bodyParts = this.bodyPartFilter();
        const equipment = this.equipmentFilter();
        const useQuery = q.length > 0;
        const useBodyParts = bodyParts.size > 0;
        const useEquipment = equipment.size > 0;

        if (!useQuery && !useBodyParts && !useEquipment) {
            return [...this.allExercises];
        }

        return this.allExercises.filter((ex) => {
            if (useQuery && !ex.name.toLowerCase().includes(q)) return false;
            if (useBodyParts && !ex.bodyPart.some((p) => bodyParts.has(p))) return false;
            if (useEquipment && !equipment.has(ex.equipment)) return false;
            return true;
        });
    });

    readonly count = computed(() => this.filtered().length);

    readonly selectedCount = computed(() => this.selectedIds().size);

    readonly recentsFiltered = computed<Exercise[]>(() => {
        const q = this.query().trim().toLowerCase();
        const bodyParts = this.bodyPartFilter();
        const equipment = this.equipmentFilter();
        const useQuery = q.length > 0;
        const useBodyParts = bodyParts.size > 0;
        const useEquipment = equipment.size > 0;

        if (!useQuery && !useBodyParts && !useEquipment) {
            return [...this.recents];
        }

        return this.recents.filter((ex) => {
            if (useQuery && !ex.name.toLowerCase().includes(q)) return false;
            if (useBodyParts && !ex.bodyPart.some((p) => bodyParts.has(p))) return false;
            if (useEquipment && !equipment.has(ex.equipment)) return false;
            return true;
        });
    });

    isSelected(id: number): boolean {
        return this.selectedIds().has(id);
    }

    toggleSelect(ex: Exercise): void {
        const next = new Set(this.selectedIds());
        if (next.has(ex.id)) {
            next.delete(ex.id);
        } else {
            next.add(ex.id);
        }
        this.selectedIds.set(next);
    }

    onQueryInput(event: Event): void {
        const value = (event.target as HTMLInputElement | null)?.value ?? '';
        this.query.set(value);
    }

    openFilter(): void {
        this.filterOpen.set(true);
    }

    closeFilter(): void {
        this.filterOpen.set(false);
    }

    onFilterChange(state: ExerciseFilterState): void {
        this.bodyPartFilter.set(new Set(state.bodyParts));
        this.equipmentFilter.set(new Set(state.equipment));
    }

    removeFilterChip(chip: ActiveFilterChip): void {
        if (chip.kind === 'bodyPart') {
            const next = new Set(this.bodyPartFilter());
            next.delete(chip.value);
            this.bodyPartFilter.set(next);
        } else {
            const next = new Set(this.equipmentFilter());
            next.delete(chip.value);
            this.equipmentFilter.set(next);
        }
    }

    clearAllFilters(): void {
        if (!this.hasActiveFilter()) return;
        this.bodyPartFilter.set(new Set());
        this.equipmentFilter.set(new Set());
    }

    confirm(): void {
        if (this.selectedIds().size === 0) return;
        const ids = this.selectedIds();
        const list = this.allExercises.filter((ex) => ids.has(ex.id));
        this.add.emit(list);
        this.close.emit();
    }

    onClose(): void {
        this.close.emit();
    }

    onBackdropClick(): void {
        this.onClose();
    }

    splitForHighlight(name: string): HighlightPart[] {
        const q = this.query().trim();
        if (!q) return [{ text: name, match: false }];
        const lowerName = name.toLowerCase();
        const lowerQ = q.toLowerCase();
        const parts: HighlightPart[] = [];
        let i = 0;
        while (i < name.length) {
            const idx = lowerName.indexOf(lowerQ, i);
            if (idx === -1) {
                parts.push({ text: name.slice(i), match: false });
                break;
            }
            if (idx > i) {
                parts.push({ text: name.slice(i, idx), match: false });
            }
            parts.push({ text: name.slice(idx, idx + lowerQ.length), match: true });
            i = idx + lowerQ.length;
        }
        return parts;
    }

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement | null;
        if (img && !img.src.endsWith(PLACEHOLDER_IMAGE)) {
            img.src = PLACEHOLDER_IMAGE;
        }
    }

    trackById = (_: number, ex: Exercise): number => ex.id;
    trackByChip = (_: number, chip: ActiveFilterChip): string => `${chip.kind}:${chip.value}`;
}
