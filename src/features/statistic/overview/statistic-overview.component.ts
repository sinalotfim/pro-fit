import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Calendar, Clock, Dumbbell, Flame, LucideAngularModule } from 'lucide-angular';

import {
    MUSCLE_GROUP_STATS,
    STATISTIC_SUMMARY,
    VOLUME_SERIES,
} from '../../../core/constants/statistic.constant';

const CHART_WIDTH = 300;
const CHART_HEIGHT = 140;
const CHART_MAX_KG = 15000;

@Component({
    selector: 'pf-statistic-overview',
    templateUrl: './statistic-overview.component.html',
    styleUrls: ['./statistic-overview.component.scss'],
    imports: [CommonModule, LucideAngularModule],
})
export class StatisticOverviewComponent {
    readonly icons = { calendar: Calendar, clock: Clock, flame: Flame, dumbbell: Dumbbell };

    readonly summary = STATISTIC_SUMMARY;
    readonly volumeSeries = VOLUME_SERIES;
    readonly muscleGroups = MUSCLE_GROUP_STATS;

    readonly chartWidth = CHART_WIDTH;
    readonly chartHeight = CHART_HEIGHT;

    readonly yTicks = [
        { value: 0, label: '0' },
        { value: 3000, label: '3K' },
        { value: 6000, label: '6K' },
        { value: 9000, label: '9K' },
        { value: 12000, label: '12K' },
        { value: 15000, label: '15K' },
    ];

    get maxMuscleVolume(): number {
        return this.muscleGroups[0]?.volumeKg ?? 1;
    }

    get chartPoints(): { x: number; y: number }[] {
        const count = this.volumeSeries.length;
        if (count === 0) {
            return [];
        }

        return this.volumeSeries.map((point, index) => ({
            x: count === 1 ? CHART_WIDTH / 2 : (index / (count - 1)) * CHART_WIDTH,
            y: CHART_HEIGHT - (point.valueKg / CHART_MAX_KG) * CHART_HEIGHT,
        }));
    }

    get chartLinePath(): string {
        return this.chartPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    }

    get chartAreaPath(): string {
        const points = this.chartPoints;
        if (points.length === 0) {
            return '';
        }

        const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
        const last = points[points.length - 1];
        const first = points[0];
        return `${line} L ${last.x} ${CHART_HEIGHT} L ${first.x} ${CHART_HEIGHT} Z`;
    }

    formatVolume(value: number): string {
        return `${value.toLocaleString('en-US').replace(/,/g, ' ')} kg`;
    }

    barWidth(volumeKg: number): number {
        return Math.round((volumeKg / this.maxMuscleVolume) * 100);
    }
}
