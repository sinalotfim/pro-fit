import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChevronRight, Clock, Dumbbell, List, LucideAngularModule, User } from 'lucide-angular';

import { WORKOUT_SESSION_LOGS } from '../../../core/constants/statistic.constant';

@Component({
    selector: 'pf-statistic-history',
    templateUrl: './statistic-history.component.html',
    styleUrls: ['./statistic-history.component.scss'],
    imports: [CommonModule, LucideAngularModule],
})
export class StatisticHistoryComponent {
    readonly icons = { user: User, clock: Clock, list: List, dumbbell: Dumbbell, chevron: ChevronRight };

    readonly sessions = WORKOUT_SESSION_LOGS;

    formatVolume(volumeKg: number): string {
        return `${volumeKg.toLocaleString('en-US')} kg`;
    }
}
