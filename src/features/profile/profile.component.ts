import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    Bell,
    ChevronRight,
    Dumbbell,
    LucideAngularModule,
    Palette,
    Scale,
    Timer,
} from 'lucide-angular';

import { ProfileSettingRow, UserProfile } from '../../core/models/profile.model';

@Component({
    selector: 'pf-profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.scss'],
    imports: [CommonModule, LucideAngularModule],
})
export class ProfileComponent {
    readonly icons = { scale: Scale, timer: Timer, palette: Palette, bell: Bell, chevron: ChevronRight, dumbbell: Dumbbell };

    readonly profile: UserProfile = {
        name: 'Alex',
        initial: 'A',
        email: 'alex@email.com',
        memberSince: 2025,
        age: 28,
        heightCm: 178,
        weightKg: 78,
        streakDays: 12,
        totalWorkouts: 142,
        weeklyDone: 3,
        weeklyTarget: 4,
        units: 'kg',
        restTimerSec: 90,
        theme: 'Dark',
        notificationsEnabled: true,
    };

    readonly stats = [
        { label: 'Age', value: `${this.profile.age}` },
        { label: 'Height', value: `${this.profile.heightCm} cm` },
        { label: 'Weight', value: `${this.profile.weightKg} kg` },
        { label: 'Streak', value: `${this.profile.streakDays}d` },
    ];

    readonly settings: ProfileSettingRow[] = [
        { id: 'units', label: 'Units', value: this.profile.units, icon: 'scale' },
        { id: 'timer', label: 'Rest timer', value: `${this.profile.restTimerSec}s`, icon: 'timer' },
        { id: 'theme', label: 'Theme', value: this.profile.theme, icon: 'palette' },
        {
            id: 'notifications',
            label: 'Notifications',
            value: this.profile.notificationsEnabled ? 'On' : 'Off',
            icon: 'bell',
        },
    ];

    get weeklyProgress(): number {
        return Math.min(1, this.profile.weeklyDone / this.profile.weeklyTarget);
    }

    get weeklyPercent(): number {
        return Math.round(this.weeklyProgress * 100);
    }
}
