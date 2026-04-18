import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../features/tab-bar/tab-bar.component').then(m => m.TabBarComponent),
    children: [
      {
        path: 'workout',
        loadComponent: () =>
          import('../features/workout/workout.component').then(m => m.WorkoutComponent),
      },
      {
        path: 'exercise',
        loadComponent: () =>
          import('../features/exercise/exercise.component').then(m => m.ExerciseComponent),
      },
      {
        path: 'statistic',
        loadComponent: () =>
          import('../features/statistic/statistic.component').then(m => m.StatisticComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../features/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: '',
        redirectTo: '/workout',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/workout',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
