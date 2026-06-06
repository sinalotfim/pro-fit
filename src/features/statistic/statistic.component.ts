import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Calendar, LucideAngularModule } from 'lucide-angular';

import { StatisticSegment } from '../../core/models/statistic.model';
import { StatisticHistoryComponent } from './history/statistic-history.component';
import { StatisticOverviewComponent } from './overview/statistic-overview.component';

@Component({
    selector: 'pf-statistic',
    templateUrl: 'statistic.component.html',
    styleUrls: ['statistic.component.scss'],
    imports: [CommonModule, LucideAngularModule, StatisticOverviewComponent, StatisticHistoryComponent],
})
export class StatisticComponent {
    readonly icons = { calendar: Calendar };

    readonly activeSegment = signal<StatisticSegment>('overview');

    readonly segments: { id: StatisticSegment; label: string }[] = [
        { id: 'overview', label: 'Overview' },
        { id: 'history', label: 'History' },
    ];

    setSegment(segment: StatisticSegment): void {
        this.activeSegment.set(segment);
    }
}
