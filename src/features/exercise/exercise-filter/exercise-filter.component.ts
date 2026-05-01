import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    computed,
    signal,
} from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import { BodyPart, Exercise } from '../../../core/models/exercise.model';

export interface ExerciseFilterState {
    bodyParts: ReadonlySet<BodyPart>;
    equipment: ReadonlySet<string>;
}

const PLACEHOLDER_IMAGE = 'assets/exercises/placeholder.svg';

const BODY_PART_ORDER: BodyPart[] = [
    'Arm',
    'Back',
    'Chest',
    'Core',
    'Leg',
    'Shoulder',
    'Glutes',
    'Full Body',
];

@Component({
    selector: 'pf-exercise-filter',
    templateUrl: 'exercise-filter.component.html',
    styleUrls: ['exercise-filter.component.scss'],
    imports: [CommonModule, LucideAngularModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseFilterComponent implements OnInit {
    @Input({ required: true }) initial!: ExerciseFilterState;
    @Input({ required: true }) allExercises!: readonly Exercise[];

    @Output() readonly change = new EventEmitter<ExerciseFilterState>();
    @Output() readonly close = new EventEmitter<void>();

    readonly placeholderImage = PLACEHOLDER_IMAGE;
    readonly bodyParts = BODY_PART_ORDER;

    readonly selectedBodyParts = signal<ReadonlySet<BodyPart>>(new Set());
    readonly selectedEquipment = signal<ReadonlySet<string>>(new Set());

    readonly equipmentOptions = computed<string[]>(() => {
        const set = new Set<string>();
        for (const ex of this.allExercises) {
            set.add(ex.equipment);
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    });

    readonly previewCount = computed<number>(() => {
        const bodyParts = this.selectedBodyParts();
        const equipment = this.selectedEquipment();
        if (bodyParts.size === 0 && equipment.size === 0) {
            return this.allExercises.length;
        }
        return this.allExercises.reduce((acc, ex) => {
            const bodyPartOk =
                bodyParts.size === 0 || ex.bodyPart.some((p) => bodyParts.has(p));
            const equipmentOk = equipment.size === 0 || equipment.has(ex.equipment);
            return acc + (bodyPartOk && equipmentOk ? 1 : 0);
        }, 0);
    });

    readonly hasSelection = computed<boolean>(
        () => this.selectedBodyParts().size > 0 || this.selectedEquipment().size > 0,
    );

    ngOnInit(): void {
        this.selectedBodyParts.set(new Set(this.initial.bodyParts));
        this.selectedEquipment.set(new Set(this.initial.equipment));
    }

    isBodyPartSelected(part: BodyPart): boolean {
        return this.selectedBodyParts().has(part);
    }

    isEquipmentSelected(name: string): boolean {
        return this.selectedEquipment().has(name);
    }

    toggleBodyPart(part: BodyPart): void {
        const next = new Set(this.selectedBodyParts());
        if (next.has(part)) {
            next.delete(part);
        } else {
            next.add(part);
        }
        this.selectedBodyParts.set(next);
        this.emitChange();
    }

    toggleEquipment(name: string): void {
        const next = new Set(this.selectedEquipment());
        if (next.has(name)) {
            next.delete(name);
        } else {
            next.add(name);
        }
        this.selectedEquipment.set(next);
        this.emitChange();
    }

    clearAll(): void {
        this.selectedBodyParts.set(new Set());
        this.selectedEquipment.set(new Set());
        this.emitChange();
    }

    onClose(): void {
        this.close.emit();
    }

    onBackdropClick(): void {
        this.onClose();
    }

    private emitChange(): void {
        this.change.emit({
            bodyParts: this.selectedBodyParts(),
            equipment: this.selectedEquipment(),
        });
    }

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement | null;
        if (img && !img.src.endsWith(PLACEHOLDER_IMAGE)) {
            img.src = PLACEHOLDER_IMAGE;
        }
    }

    trackByBodyPart(_: number, part: BodyPart): string {
        return part;
    }

    trackByEquipment(_: number, name: string): string {
        return name;
    }
}
