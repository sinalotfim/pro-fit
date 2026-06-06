import { MuscleGroupStat, StatisticSummary, VolumePoint, WorkoutSessionLog } from '../models/statistic.model';

export const STATISTIC_SUMMARY: StatisticSummary = {
    weeklyWorkouts: 4,
    weeklyDuration: '2h 15m',
    streakDays: 5,
    weeklyVolumeKg: 12400,
};

export const VOLUME_SERIES: VolumePoint[] = [
    { label: '8 wk ago', valueKg: 4200 },
    { label: '7 wk ago', valueKg: 5100 },
    { label: '6 wk ago', valueKg: 6800 },
    { label: '5 wk ago', valueKg: 7500 },
    { label: '4 wk ago', valueKg: 8500 },
    { label: '3 wk ago', valueKg: 9200 },
    { label: '2 wk ago', valueKg: 10800 },
    { label: 'This week', valueKg: 12400 },
];

export const MUSCLE_GROUP_STATS: MuscleGroupStat[] = [
    { name: 'Chest', volumeKg: 2850 },
    { name: 'Back', volumeKg: 2420 },
    { name: 'Legs', volumeKg: 1980 },
    { name: 'Shoulders', volumeKg: 1560 },
    { name: 'Arms', volumeKg: 1240 },
];

export const WORKOUT_SESSION_LOGS: WorkoutSessionLog[] = [
    { id: '1', name: 'Push Day', date: 'Mon, Jun 2', duration: '45 min', exerciseCount: 8, volumeKg: 4200 },
    { id: '2', name: 'Leg Day', date: 'Sat, May 31', duration: '52 min', exerciseCount: 7, volumeKg: 5100 },
    { id: '3', name: 'Pull Day', date: 'Thu, May 29', duration: '41 min', exerciseCount: 8, volumeKg: 3900 },
    { id: '4', name: 'Push Day', date: 'Tue, May 27', duration: '48 min', exerciseCount: 8, volumeKg: 4050 },
    { id: '5', name: 'Leg Day', date: 'Sun, May 25', duration: '55 min', exerciseCount: 7, volumeKg: 5300 },
];
