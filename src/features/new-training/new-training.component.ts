import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Exercise } from '../../core/models/exercise.model';
import {
    WorkoutPreview,
    WorkoutPreviewExercise,
    WorkoutStore,
} from '../../core/stores/workout.store';
import { AddExercisesSheetComponent } from './add-exercises-sheet/add-exercises-sheet.component';

export type TrainingSet = { id: number; kg: number | null; reps: number | null };

export type TrainingExerciseEntry = {
    uid: number;
    exercise: Exercise;
    sets: TrainingSet[];
    expanded: boolean;
};

const RECENTS_LIMIT = 8;

@Component({
    selector: 'pf-new-training',
    templateUrl: 'new-training.component.html',
    styleUrls: ['new-training.component.scss'],
    imports: [CommonModule, FormsModule, AddExercisesSheetComponent],
})
export class NewTrainingComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly location = inject(Location);
    private readonly router = inject(Router);
    private readonly store = inject(WorkoutStore);

    readonly title = signal(this.buildInitialTitle());
    readonly editing = signal(false);
    readonly draftTitle = signal(this.title());

    readonly addOpen = signal(false);
    readonly addedExercises = signal<TrainingExerciseEntry[]>([]);
    readonly recents = signal<readonly Exercise[]>([]);

    @ViewChild('titleInput') private titleInput?: ElementRef<HTMLInputElement>;

    private nextEntryUid = 1;
    private nextSetId = 1;

    private buildInitialTitle(): string {
        const raw = this.route.snapshot.queryParamMap.get('n');
        const parsed = raw ? Number.parseInt(raw, 10) : NaN;
        const n = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
        return `New Training ${n}`;
    }

    onBack(): void {
        this.location.back();
    }

    startEdit(): void {
        this.draftTitle.set(this.title());
        this.editing.set(true);
        queueMicrotask(() => {
            const el = this.titleInput?.nativeElement;
            if (el) {
                el.focus();
                el.select();
            }
        });
    }

    saveEdit(): void {
        const next = this.draftTitle().trim();
        if (next.length > 0) {
            this.title.set(next);
        }
        this.editing.set(false);
    }

    onDraftInput(value: string): void {
        this.draftTitle.set(value);
    }

    onTitleKeydown(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.saveEdit();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            this.editing.set(false);
        }
    }

    onAddExercises(): void {
        this.addOpen.set(true);
    }

    onCloseAdd(): void {
        this.addOpen.set(false);
    }

    onExercisesAdded(list: Exercise[]): void {
        if (list.length === 0) {
            this.addOpen.set(false);
            return;
        }
        const existingIds = new Set(this.addedExercises().map((e) => e.exercise.id));
        const additions: TrainingExerciseEntry[] = [];
        for (const ex of list) {
            if (existingIds.has(ex.id)) continue;
            existingIds.add(ex.id);
            const initialSetCount = ex.sets > 0 ? ex.sets : 1;
            const sets: TrainingSet[] = [];
            for (let i = 0; i < initialSetCount; i++) {
                sets.push({ id: this.nextSetId++, kg: null, reps: null });
            }
            additions.push({
                uid: this.nextEntryUid++,
                exercise: ex,
                sets,
                expanded: true,
            });
        }
        if (additions.length > 0) {
            this.addedExercises.update((arr) => [...arr, ...additions]);
        }
        this.updateRecents(list);
        this.addOpen.set(false);
    }

    private updateRecents(list: readonly Exercise[]): void {
        if (list.length === 0) return;
        const seen = new Set<number>();
        const merged: Exercise[] = [];
        for (let i = list.length - 1; i >= 0; i--) {
            const ex = list[i];
            if (seen.has(ex.id)) continue;
            seen.add(ex.id);
            merged.push(ex);
        }
        for (const ex of this.recents()) {
            if (seen.has(ex.id)) continue;
            seen.add(ex.id);
            merged.push(ex);
        }
        this.recents.set(merged.slice(0, RECENTS_LIMIT));
    }

    toggleExpand(entry: TrainingExerciseEntry): void {
        this.addedExercises.update((arr) =>
            arr.map((e) => (e.uid === entry.uid ? { ...e, expanded: !e.expanded } : e)),
        );
    }

    addSet(entry: TrainingExerciseEntry): void {
        const newSet: TrainingSet = { id: this.nextSetId++, kg: null, reps: null };
        this.addedExercises.update((arr) =>
            arr.map((e) => (e.uid === entry.uid ? { ...e, sets: [...e.sets, newSet] } : e)),
        );
    }

    onKgInput(entry: TrainingExerciseEntry, setId: number, raw: string): void {
        const value = this.parseNumber(raw);
        this.addedExercises.update((arr) =>
            arr.map((e) =>
                e.uid === entry.uid
                    ? { ...e, sets: e.sets.map((s) => (s.id === setId ? { ...s, kg: value } : s)) }
                    : e,
            ),
        );
    }

    onRepsInput(entry: TrainingExerciseEntry, setId: number, raw: string): void {
        const value = this.parseNumber(raw);
        this.addedExercises.update((arr) =>
            arr.map((e) =>
                e.uid === entry.uid
                    ? { ...e, sets: e.sets.map((s) => (s.id === setId ? { ...s, reps: value } : s)) }
                    : e,
            ),
        );
    }

    private parseNumber(raw: string): number | null {
        if (raw == null) return null;
        const trimmed = String(raw).trim();
        if (trimmed.length === 0) return null;
        const n = Number(trimmed);
        return Number.isFinite(n) ? n : null;
    }

    onSave(): void {
        const entries = this.addedExercises();
        if (entries.length === 0) {
            this.router.navigate(['/workout']);
            return;
        }

        const preview: WorkoutPreviewExercise[] = entries.slice(0, 3).map((entry) => ({
            name: entry.exercise.name,
            equipment: entry.exercise.equipment,
            sets: entry.sets.length,
            rep: this.formatRep(entry),
        }));

        const workout: WorkoutPreview = {
            name: this.title(),
            exerciseCount: entries.length,
            image: entries[0]?.exercise.imageUrl || undefined,
            preview,
        };

        this.store.addWorkout(workout);
        this.router.navigate(['/workout']);
    }

    private formatRep(entry: TrainingExerciseEntry): string {
        const firstReps = entry.sets[0]?.reps;
        if (firstReps != null && firstReps > 0) return String(firstReps);
        const fallback = entry.exercise.reps;
        return fallback > 0 ? String(fallback) : '–';
    }

    trackByEntry = (_: number, entry: TrainingExerciseEntry): number => entry.uid;
    trackBySet = (_: number, set: TrainingSet): number => set.id;
}
