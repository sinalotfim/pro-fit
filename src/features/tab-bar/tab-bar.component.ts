import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'pf-tab-bar',
    templateUrl: 'tab-bar.component.html',
    styleUrls: ['tab-bar.component.scss'],
    imports: [IonicModule, LucideAngularModule],
})
export class TabBarComponent {
    constructor() {}
}
