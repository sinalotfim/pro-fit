export type StatisticSegment = 'overview' | 'history';

export type StatisticSummary = {
    weeklyWorkouts: number;
    weeklyDuration: string;
    streakDays: number;
    weeklyVolumeKg: number;
};

export type VolumePoint = {
    label: string;
    valueKg: number;
};

export type MuscleGroupStat = {
    name: string;
    volumeKg: number;
};

export type WorkoutSessionLog = {
    id: string;
    name: string;
    date: string;
    duration: string;
    exerciseCount: number;
    volumeKg: number;
};
