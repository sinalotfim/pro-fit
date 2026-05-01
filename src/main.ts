import { importProvidersFrom, isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { PreloadAllModules, provideRouter, RouteReuseStrategy, Routes, withPreloading } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { provideServiceWorker } from '@angular/service-worker';
import {
    LucideAngularModule,
    ChartBar,
    Check,
    ChevronDown,
    ChevronLeft,
    CircleUser,
    CircleX,
    Dumbbell,
    EllipsisVertical,
    Funnel,
    List,
    Pencil,
    Play,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-angular';

import { AppComponent } from './app/app.component';

const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/tab-bar/tab-bar.component').then((m) => m.TabBarComponent),
        children: [
            {
                path: 'workout',
                loadComponent: () => import('./features/workout/workout.component').then((m) => m.WorkoutComponent),
            },
            {
                path: 'exercise',
                loadComponent: () => import('./features/exercise/exercise.component').then((m) => m.ExerciseComponent),
            },
            {
                path: 'statistic',
                loadComponent: () =>
                    import('./features/statistic/statistic.component').then((m) => m.StatisticComponent),
            },
            {
                path: 'profile',
                loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent),
            },
            {
                path: '',
                redirectTo: '/workout',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: 'workout/new',
        loadComponent: () =>
            import('./features/new-training/new-training.component').then((m) => m.NewTrainingComponent),
    },
    {
        path: '',
        redirectTo: '/workout',
        pathMatch: 'full',
    },
];

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(IonicModule.forRoot()),
        importProvidersFrom(
            LucideAngularModule.pick({
                ChartBar,
                Check,
                ChevronDown,
                ChevronLeft,
                CircleUser,
                CircleX,
                Dumbbell,
                EllipsisVertical,
                Funnel,
                List,
                Pencil,
                Play,
                Plus,
                Search,
                Trash2,
                X,
            }),
        ),
        provideRouter(routes, withPreloading(PreloadAllModules)),
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ],
}).catch((err) => console.log(err));
