import { Component, ElementRef, ViewChild, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Check, ChevronLeft, LucideAngularModule, Pencil, Save } from 'lucide-angular';

@Component({
    selector: 'pf-workout-new-header',
    templateUrl: './workout-new-header.component.html',
    styleUrls: ['./workout-new-header.component.scss'],
    imports: [CommonModule, FormsModule, LucideAngularModule],
})
export class WorkoutNewHeaderComponent {
    readonly title = input.required<string>();
    readonly saveVisible = input(false);

    readonly titleChange = output<string>();
    readonly backClick = output<void>();
    readonly saveClick = output<void>();

    readonly editing = signal(false);
    readonly draftTitle = signal('');

    protected readonly backIcon = ChevronLeft;
    protected readonly pencilIcon = Pencil;
    protected readonly checkIcon = Check;
    protected readonly saveIcon = Save;

    @ViewChild('titleInput') private titleInput?: ElementRef<HTMLInputElement>;

    protected onBack(): void {
        this.backClick.emit();
    }

    protected onSave(): void {
        this.saveClick.emit();
    }

    protected startEdit(): void {
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

    protected saveEdit(): void {
        const next = this.draftTitle().trim();
        if (next.length > 0) {
            this.titleChange.emit(next);
        }
        this.editing.set(false);
    }

    protected onDraftInput(value: string): void {
        this.draftTitle.set(value);
    }

    protected onTitleKeydown(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.saveEdit();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            this.editing.set(false);
        }
    }
}
