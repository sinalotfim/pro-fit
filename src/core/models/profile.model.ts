export interface UserProfile {
    name: string;
    initial: string;
    email: string;
    memberSince: number;
    age: number;
    heightCm: number;
    weightKg: number;
    streakDays: number;
    totalWorkouts: number;
    weeklyDone: number;
    weeklyTarget: number;
    units: string;
    restTimerSec: number;
    theme: string;
    notificationsEnabled: boolean;
}

export interface ProfileSettingRow {
    id: string;
    label: string;
    value: string;
    icon: 'scale' | 'timer' | 'palette' | 'bell';
}
