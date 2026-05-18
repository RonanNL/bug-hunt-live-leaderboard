# Website-Zugriffsdaten

- **IZugriff auf Ihre Website unter: https://livebughunt.com
- **IZugriff auf Ihre Website mit www: https://www.livebughunt.com
- **IIP-Adresse der Website: 82.198.229.163
- **IWebsite-Vorschau ansehen unter: powderblue-gerbil-197610.hostingersite.com

# Bug Hunt Live Leaderboard

A browser-based live leaderboard for facilitating exploratory bug hunt sessions.
Track bug counts per participant or team, view live rankings, manage the session timer, and export results as JSON — all without any backend, server, or data storage.

---

## Features

- **Individual and Team-based modes** — compete as individuals or group participants into teams
- **Live scoring** — + / − controls update rankings instantly with dense ranking (no gaps)
- **Session timer** — start, pause, and reset a count-up timer for the bug hunt duration
- **Visibility filter** — show all entries, Top 3, or Top 10 on the leaderboard
- **JSON export / import** — the only persistence mechanism; no data is stored automatically
- **Privacy by design** — entirely in-browser, no backend, no analytics, no cookies
- **Usage disclaimer** — acknowledgement gate before starting or loading a session
- **Modals** — User Guide, Bug Hunt Setup Tips, Privacy Notice

---

## Project Structure

```
src/
  assets/                        Static assets (SVGs, images)
  components/
    landing/                     Cards and panels used only on the Landing page
      FileDropzone.tsx
      ImportSessionCard.tsx
      InfoPanel.tsx
      StartSessionCard.tsx
    layout/                      Shared navigation components (all pages)
      AppHeader.tsx
      AppTabs.tsx
    leaderboard/                 Components used on the Leaderboard page
      DashboardMetricCard.tsx
      LeaderboardEntryCard.tsx
      TimerPanel.tsx
      VisibilitySelector.tsx
    modals/                      All modal overlays (portal-based)
      BugHuntSetupTipsModal.tsx
      CloseSessionModal.tsx
      PrivacyNoticeModal.tsx
      UsageDisclaimerModal.tsx
      UserGuideModal.tsx
    setup/                       Components used on the Setup page
      AddParticipantsPanel.tsx
      AutoAssignTeamsPanel.tsx
      ManageParticipantsPanel.tsx
      ManageTeamsPanel.tsx
      ModeSelector.tsx
      TeamEditCard.tsx
  logic/                         Pure business logic (no React)
    defaultSession.ts            Factory functions for new/demo sessions
    exportSession.ts             JSON download via Blob URL
    importSession.ts             File reader + validation orchestration
    participants.ts              Name parsing, ID generation, demo data
    ranking.ts                   Dense ranking algorithm, leader summary
    teams.ts                     Team membership utilities
    teamSplit.ts                 Fisher-Yates shuffle + round-robin split
    timer.ts                     HH:MM:SS formatting
    validateSession.ts           Strict runtime JSON schema validation
  pages/                         Full-page components (one per app screen)
    ContactPage.tsx
    LandingPage.tsx
    LeaderboardPage.tsx
    SetupPage.tsx
  state/
    sessionStore.tsx             React Context + useState global state
  styles/
    globals.css                  Global resets and base styles
    variables.css                CSS custom properties (colours, spacing, etc.)
  types/
    session.ts                   Shared TypeScript interfaces
  App.tsx                        Root component + state-driven router
  main.tsx                       React DOM entry point
```

---

## Build and Deploy

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (bundled with Node.js)

### Install dependencies

```bash
npm install
```

### Run locally (development)

```bash
npm run dev
```

Opens a local dev server at `http://localhost:5173` with hot module replacement.

### Build for production

```bash
npm run build
```

Outputs optimised static files to the `dist/` folder:

```
dist/
  index.html
  assets/
    index-[hash].js
    index-[hash].css
  favicon.svg
  icons.svg
```

### Preview the production build locally

```bash
npm run preview
```

Serves the `dist/` folder at `http://localhost:4173` so you can verify the production build before uploading.

### Lint

```bash
npm run lint
```

---

## Deploying to a Static Web Host

### What to upload

Upload the entire contents of the `dist/` folder to your web host. No other files are required.

### Supported hosting options

The app works on any static file host, including:

| Host | Notes |
|---|---|
| GitHub Pages | Works with repository pages or custom domain |
| Azure Static Web Apps | No server configuration needed |
| Netlify | Drag and drop the `dist/` folder |
| Vercel | Connect repo or upload `dist/` |
| Any web server | Apache, Nginx — serve `dist/` as the document root |
| SharePoint / intranet | Upload `dist/` as a document library and link to `index.html` |

### Routing

This app uses **state-driven navigation** (no URL routing). All navigation happens inside the React application by updating a `currentPage` value in state. There are no sub-URLs to handle, so **no server-side SPA fallback configuration is required**.

### Base path

`vite.config.ts` sets `base: "./"` so all asset paths in the built HTML are relative. This means the `dist/` folder can be hosted:

- At the domain root: `https://example.com/`
- In a subfolder: `https://example.com/tools/bug-hunt/`

No configuration change is needed for either deployment style.

---

## Privacy and Data Handling

- **No backend** — the application has no server component
- **No database** — no data is written to any external system
- **No cookies** — no cookies of any kind are set
- **No localStorage or sessionStorage** — browser storage APIs are not used
- **No analytics or tracking** — no third-party scripts are loaded
- **No network calls** — the app makes no HTTP requests after the initial page load

**The only persistence mechanism is manual JSON export/import.**

When a session is exported, a `.json` file is saved to the user's local device. This file can be imported in a future session to resume where the user left off. If a session is not exported before the browser tab is closed, all data is permanently lost.

---

## JSON Export Format

Exported files follow the schema defined in `src/types/session.ts`:

```json
{
  "version": 1,
  "createdAt": "2026-01-15T09:00:00.000Z",
  "updatedAt": "2026-01-15T11:30:00.000Z",
  "mode": "team",
  "participants": [
    { "id": "...", "name": "Alice", "bugsFound": 12, "sortOrder": 0 }
  ],
  "teams": [
    { "id": "...", "name": "Team Alpha", "memberIds": ["..."], "bugsFound": 28, "sortOrder": 0 }
  ],
  "visibilityMode": "all",
  "timer": {
    "elapsedSeconds": 5400,
    "status": "paused"
  }
}
```

Files with a `version` value other than `1` are rejected on import with a clear error message.

---

## Browser Compatibility

Tested and supported on modern versions of:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Apple Safari

Internet Explorer is not supported.

---

## Development Notes

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: CSS Modules (one `.module.css` per component)
- **State**: React Context + `useState` (`src/state/sessionStore.tsx`)
- **No external UI libraries** — all components are custom-built with inline SVG icons
- **No routing library** — navigation is state-driven via `AppPage` union type
- **Ranking**: Dense ranking — tied scores share the same rank with no gaps (e.g. 1,1,2,3,3,4)

---

## Contact

For questions or support, use the Contact page within the application or email the address listed there.
