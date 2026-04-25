import { CommonModule } from '@angular/common';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    ViewChild,
    computed,
    signal,
} from '@angular/core';

import { EXERCISES } from '../../core/constants/exercise.constant';
import { BodyPart, Exercise } from '../../core/models/exercise.model';
import {
    ExerciseFilterComponent,
    ExerciseFilterState,
} from './exercise-filter/exercise-filter.component';

type HighlightPart = { text: string; match: boolean };
type ExerciseGroup = { letter: string; items: Exercise[] };
type Row =
    | { kind: 'header'; letter: string }
    | { kind: 'item'; exercise: Exercise };
export type ActiveFilterChip =
    | { kind: 'bodyPart'; value: BodyPart; label: string }
    | { kind: 'equipment'; value: string; label: string };

const PLACEHOLDER_IMAGE = 'assets/exercises/placeholder.svg';

@Component({
    selector: 'pf-exercise',
    templateUrl: 'exercise.component.html',
    styleUrls: ['exercise.component.scss'],
    imports: [CommonModule, ScrollingModule, ExerciseFilterComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseComponent {
    @ViewChild('searchBox')
    private searchBox?: ElementRef<HTMLInputElement>;

    @ViewChild(CdkVirtualScrollViewport)
    private viewport?: CdkVirtualScrollViewport;

    readonly placeholderImage = PLACEHOLDER_IMAGE;

    readonly all = signal<Exercise[]>(EXERCISES);

    readonly query = signal('');
    readonly searchActive = signal(false);
    readonly currentLetter = signal('');

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
        const useQuery = this.searchActive() && q.length > 0;
        const bodyParts = this.bodyPartFilter();
        const equipment = this.equipmentFilter();
        const useBodyParts = bodyParts.size > 0;
        const useEquipment = equipment.size > 0;

        if (!useQuery && !useBodyParts && !useEquipment) {
            return this.all();
        }

        return this.all().filter((ex) => {
            if (useQuery && !ex.name.toLowerCase().includes(q)) return false;
            if (useBodyParts && !ex.bodyPart.some((p) => bodyParts.has(p))) return false;
            if (useEquipment && !equipment.has(ex.equipment)) return false;
            return true;
        });
    });

    readonly groups = computed<ExerciseGroup[]>(() => {
        const buckets = new Map<string, Exercise[]>();
        for (const ex of this.filtered()) {
            const first = ex.name.charAt(0).toUpperCase();
            const letter = /[A-Z]/.test(first) ? first : '#';
            const arr = buckets.get(letter);
            if (arr) {
                arr.push(ex);
            } else {
                buckets.set(letter, [ex]);
            }
        }
        return Array.from(buckets.entries())
            .map(([letter, items]) => ({
                letter,
                items: [...items].sort((a, b) => a.name.localeCompare(b.name)),
            }))
            .sort((a, b) => {
                if (a.letter === '#') return 1;
                if (b.letter === '#') return -1;
                return a.letter.localeCompare(b.letter);
            });
    });

    readonly count = computed(() => this.filtered().length);

    readonly rows = computed<Row[]>(() => {
        const list: Row[] = [];
        const showHeaders = !this.searchActive() && !this.hasActiveFilter();
        for (const g of this.groups()) {
            if (showHeaders) {
                list.push({ kind: 'header', letter: g.letter });
            }
            for (const exercise of g.items) {
                list.push({ kind: 'item', exercise });
            }
        }
        return list;
    });

    onScrolledIndexChange(index: number): void {
        const list = this.rows();
        if (list.length === 0) {
            if (this.currentLetter() !== '') this.currentLetter.set('');
            return;
        }
        const safeIndex = Math.max(0, Math.min(index, list.length - 1));
        for (let i = safeIndex; i >= 0; i--) {
            const row = list[i];
            if (row.kind === 'header') {
                if (this.currentLetter() !== row.letter) {
                    this.currentLetter.set(row.letter);
                }
                return;
            }
        }
        if (this.currentLetter() !== '') this.currentLetter.set('');
    }

    openSearch(): void {
        this.searchActive.set(true);
        this.scrollToTop();
        setTimeout(() => this.searchBox?.nativeElement.focus(), 0);
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
        this.scrollToTop();
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
        this.scrollToTop();
    }

    clearAllFilters(): void {
        if (!this.hasActiveFilter()) return;
        this.bodyPartFilter.set(new Set());
        this.equipmentFilter.set(new Set());
        this.scrollToTop();
    }

    trackByChip = (_: number, chip: ActiveFilterChip): string =>
        `${chip.kind}:${chip.value}`;

    closeSearch(): void {
        this.query.set('');
        this.searchActive.set(false);
    }

    onQueryInput(event: Event): void {
        const value = (event.target as HTMLInputElement | null)?.value ?? '';
        this.query.set(value);
        this.scrollToTop();
    }

    private scrollToTop(): void {
        queueMicrotask(() => this.viewport?.scrollToIndex(0));
    }

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement | null;
        if (img && !img.src.endsWith(PLACEHOLDER_IMAGE)) {
            img.src = PLACEHOLDER_IMAGE;
        }
    }

    splitForHighlight(name: string): HighlightPart[] {
        const q = this.query().trim();
        if (!this.searchActive() || !q) {
            return [{ text: name, match: false }];
        }
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

    trackByLetter(_: number, group: ExerciseGroup): string {
        return group.letter;
    }

    trackById(_: number, ex: Exercise): number {
        return ex.id;
    }

    trackByRow = (_: number, row: Row): string =>
        row.kind === 'header' ? `header-${row.letter}` : `item-${row.exercise.id}`;
}
