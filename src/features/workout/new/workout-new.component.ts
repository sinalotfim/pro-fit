import { Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChevronRight, CirclePlay, LucideAngularModule, Trash2 } from 'lucide-angular';

import { Exercise, WorkoutExerciseListItem, WorkoutListItem } from '../../../core/models';
import { WorkoutService } from '../../../core/services';
import { WorkoutNewAddExercisesSheetComponent } from './add-exercises-sheet/workout-new-add-exercises-sheet.component';
import { WorkoutNewEmptyComponent } from './empty/workout-new-empty.component';
import { WorkoutNewHeaderComponent } from './header/workout-new-header.component';

export type TrainingSet = { id: number; kg: number | null; reps: number | null };

export type TrainingExerciseEntry = {
    uid: number;
    exercise: Exercise;
    sets: TrainingSet[];
    expanded: boolean;
};

const RECENTS_LIMIT = 8;
const DEFAULT_SET_COUNT = 2;

@Component({
    selector: 'pf-workout-new',
    templateUrl: 'workout-new.component.html',
    styleUrls: ['workout-new.component.scss'],
    imports: [
        CommonModule,
        WorkoutNewAddExercisesSheetComponent,
        WorkoutNewEmptyComponent,
        LucideAngularModule,
        WorkoutNewHeaderComponent,
    ],
})
export class WorkoutNewComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly location = inject(Location);
    private readonly router = inject(Router);
    private readonly store = inject(WorkoutService);

    readonly title = signal(this.buildInitialTitle());

    readonly addOpen = signal(false);
    readonly addedExercises = signal<TrainingExerciseEntry[]>([]);
    readonly recents = signal<readonly Exercise[]>([]);
    readonly activeSet = signal<{ entryUid: number; setId: number } | null>(null);

    protected readonly activeSetIcon = ChevronRight;
    protected readonly videoIcon = CirclePlay;
    protected readonly trashIcon = Trash2;

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
            const sets: TrainingSet[] = [];
            for (let i = 0; i < DEFAULT_SET_COUNT; i++) {
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
            const firstEntry = additions[0];
            const firstSet = firstEntry.sets[0];
            this.focusSet(firstEntry.uid, firstSet.id);
        }
        this.updateRecents(list);
        this.addOpen.set(false);
    }

    isActiveSet(entry: TrainingExerciseEntry, set: TrainingSet): boolean {
        const active = this.activeSet();
        return active?.entryUid === entry.uid && active?.setId === set.id;
    }

    setActiveSet(entry: TrainingExerciseEntry, set: TrainingSet): void {
        this.activeSet.set({ entryUid: entry.uid, setId: set.id });
    }

    setInputId(entryUid: number, setId: number, field: 'kg' | 'reps'): string {
        return `set-${field}-${entryUid}-${setId}`;
    }

    private focusSet(entryUid: number, setId: number): void {
        this.activeSet.set({ entryUid, setId });
        queueMicrotask(() => {
            document.getElementById(this.setInputId(entryUid, setId, 'kg'))?.focus();
        });
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

    removeEntry(entry: TrainingExerciseEntry): void {
        this.addedExercises.update((arr) => arr.filter((e) => e.uid !== entry.uid));
        const active = this.activeSet();
        if (active?.entryUid === entry.uid) {
            this.activeSet.set(null);
        }
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

        const exercises: WorkoutExerciseListItem[] = entries.slice(0, 3).map((entry) => ({
            name: entry.exercise.name,
            equipment: entry.exercise.equipment,
            sets: entry.sets.length,
            rep: this.formatRep(entry),
        }));

        const workout: WorkoutListItem = {
            id: this.store.newWorkoutId(),
            name: this.title(),
            exerciseCount: entries.length,
            image: entries[0]?.exercise.imageUrl || undefined,
            exercises,
        };

        this.store.store(workout);
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
