import { Component } from '@angular/core';
import { IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { ChartBar, CircleUser, Dumbbell, List, LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'pf-tab-bar',
    templateUrl: 'tab-bar.component.html',
    styleUrls: ['tab-bar.component.scss'],
    imports: [IonTabs, IonTabBar, IonTabButton, LucideAngularModule],
})
export class TabBarComponent {
    protected readonly icons = {
        workout: Dumbbell,
        exercise: List,
        statistic: ChartBar,
        profile: CircleUser,
    };
}
