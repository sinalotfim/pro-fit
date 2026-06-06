import { AfterViewInit, Component, DestroyRef, inject, NgZone, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { BicepsFlexed, ChartBar, CircleUser, Dumbbell, LucideAngularModule } from 'lucide-angular';
import { filter } from 'rxjs/operators';

const SCROLL_THRESHOLD = 8;

@Component({
    selector: 'pf-tab-bar',
    templateUrl: 'tab-bar.component.html',
    styleUrls: ['tab-bar.component.scss'],
    imports: [IonTabs, IonTabBar, IonTabButton, LucideAngularModule],
})
export class TabBarComponent implements AfterViewInit {
    private readonly router = inject(Router);
    private readonly ngZone = inject(NgZone);
    private readonly destroyRef = inject(DestroyRef);

    protected readonly isCompact = signal(false);

    protected readonly icons = {
        workout: Dumbbell,
        exercise: BicepsFlexed,
        statistic: ChartBar,
        profile: CircleUser,
    };

    private scrollRoot: HTMLElement | null = null;
    private lastScrollTop = 0;
    private scrollHandler: (() => void) | null = null;

    ngAfterViewInit(): void {
        this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(() => this.scheduleScrollBind());

        this.scheduleScrollBind();
        this.destroyRef.onDestroy(() => this.detachScrollListener());
    }

    private scheduleScrollBind(): void {
        requestAnimationFrame(() => {
            this.detachScrollListener();
            this.isCompact.set(false);
            this.lastScrollTop = 0;

            const root = this.resolveScrollRoot();
            if (root) {
                this.attachScrollListener(root);
            }
        });
    }

    private resolveScrollRoot(): HTMLElement | null {
        const viewport = document.querySelector('cdk-virtual-scroll-viewport');
        if (viewport instanceof HTMLElement) {
            return viewport;
        }

        const pfPage = document.querySelector('.pf-page');
        if (pfPage instanceof HTMLElement && pfPage.scrollHeight > pfPage.clientHeight) {
            return pfPage;
        }

        for (const selector of ['pf-workout', 'pf-exercise', 'pf-statistic', 'pf-profile']) {
            const host = document.querySelector(selector);
            if (host instanceof HTMLElement && host.scrollHeight > host.clientHeight) {
                return host;
            }
        }

        return pfPage instanceof HTMLElement ? pfPage : null;
    }

    private attachScrollListener(root: HTMLElement): void {
        this.scrollRoot = root;
        this.lastScrollTop = root.scrollTop;

        this.scrollHandler = () => {
            const scrollTop = root.scrollTop;
            const currentCompact = this.isCompact();
            let nextCompact = currentCompact;

            if (scrollTop <= 0) {
                nextCompact = false;
            } else if (scrollTop - this.lastScrollTop > SCROLL_THRESHOLD) {
                nextCompact = true;
            } else if (this.lastScrollTop - scrollTop > SCROLL_THRESHOLD) {
                nextCompact = false;
            }

            this.lastScrollTop = scrollTop;

            if (nextCompact !== currentCompact) {
                this.ngZone.run(() => this.isCompact.set(nextCompact));
            }
        };

        this.ngZone.runOutsideAngular(() => {
            root.addEventListener('scroll', this.scrollHandler!, { passive: true });
        });
    }

    private detachScrollListener(): void {
        if (this.scrollRoot && this.scrollHandler) {
            this.scrollRoot.removeEventListener('scroll', this.scrollHandler);
        }
        this.scrollRoot = null;
        this.scrollHandler = null;
    }
}
