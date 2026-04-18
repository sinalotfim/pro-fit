# Pro Fit

An Angular + Ionic fitness PWA.

## Stack

- **Angular 20** (NgModule based starter)
- **Ionic Angular** — used ONLY for the mobile tab shell (`ion-tabs`, `ion-tab-bar`, `ion-tab-button`, `ion-router-outlet`, `ion-app`). Nothing else.
- All page content is **plain HTML + SCSS + TypeScript + Angular** (`<button>`, `<a [routerLink]>`, `<form>`, etc.). No `ion-button`, `ion-card`, `ion-header`, etc.
- **Angular PWA** for service worker + installability.

## Why Ionic is here and where it is used

The only hard-to-hand-roll mobile UX piece is a tab bar that keeps **per-tab navigation history**. That is what `ion-tabs` + `ion-router-outlet` give us. Everything else uses plain HTML/CSS, so you keep full control over the look and markup.

The Ionic-using files are:

- `src/app/app.component.html` — `<ion-app>` + `<ion-router-outlet>` (app root)
- `src/app/tabs/tabs.page.html` — the bottom tab bar

If you ever want to remove Ionic entirely, replacing those two files with a plain `<nav>` + `<router-outlet>` and dropping `IonicModule.forRoot()` from `src/app/app.module.ts` is a contained change (~40 lines).

## Design tokens

CSS custom properties live in `src/styles/_tokens.scss` and are consumed by the plain-HTML pages (`.card`, `.btn`, `.page-header`, etc.) defined in `src/global.scss`. Dark mode is handled automatically via `prefers-color-scheme`.

## Project layout

```
src/
  index.html
  main.ts
  global.scss              # design tokens + page primitives (card, btn, header)
  styles/_tokens.scss      # CSS custom properties
  theme/variables.scss     # Ionic's default tokens (only the tab bar reads these)
  app/
    app.module.ts
    app.component.*        # <ion-app><ion-router-outlet></ion-router-outlet></ion-app>
    app-routing.module.ts
    tabs/                  # ONLY place that uses ion-tabs / ion-tab-bar
    tab1/ tab2/ tab3/      # plain HTML/SCSS/Angular pages
public/
  manifest.webmanifest
  icons/
```

## Scripts

```bash
# Install
npm install

# Dev server (http://localhost:4200)
npm start

# Production build (emits www/ with ngsw.json + manifest.webmanifest)
npm run build -- --configuration production

# Preview the PWA locally (the service worker only runs on a prod build served
# over HTTP, not from ng serve).
npx http-server -p 8080 -c-1 www
# then open http://localhost:8080
```

## Routes

```
/                 -> redirects to /tabs/tab1
/tabs/tab1        -> Home
/tabs/tab2        -> Progress
/tabs/tab3        -> Profile
```

Each tab has its own navigation history, courtesy of `ion-router-outlet`.

## Next steps

Feature work (workouts, session tracker, progress charts, profile, rest timer, etc.) is intentionally out of scope for this starter and will be added next.
