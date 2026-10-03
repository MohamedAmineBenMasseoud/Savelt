# SaveIt

## Description

SaveIt is a personal weekly budget and savings tracker built as a lightweight browser app. It is designed for users who want to manage income, track weekly expenses, protect a fixed savings contribution, and monitor progress toward a savings goal without needing a backend or a framework.

The project is implemented as a static front-end application and stores data in the browser using `localStorage`. It is intended for personal finance tracking on desktop and mobile devices.

## Project purpose

The app helps a user:

- create weekly budget periods
- log money received in each week
- add expenses with categories
- carry remaining balance into the next week
- keep a protected weekly savings value
- review current, historical, and savings data
- export a JSON backup of the budget for safekeeping
- import a previously saved backup and replace the current budget
- reset all local data when needed

## Features

- Weekly Monday-to-Sunday budgeting flow
- Automatic carry-over from previous weeks
- Fixed weekly savings rule of 10 TND
- Protection against invalid negative-balance states
- Add, edit, and delete week entries
- Add, edit, and delete expenses
- Expense categories and category icons
- Dashboard view for current week and quick totals
- History view with expandable weekly details
- Savings view with goal progress and automatic savings history
- JSON export/import backup support
- Exported file naming pattern: `savings-budget-YYYY-MM-DD.json`
- Local persistence using browser storage
- PWA metadata and service worker support
- Mobile-first responsive layout
- Final navigation uses icon glyphs for Dashboard, History, and Savings
- Modal forms and confirmation dialogs

## Tech Stack

| Layer | Technology |
| --- | --- |
| Markup | HTML5 |
| Styling | CSS, custom properties, mobile-first responsive layout |
| Logic | JavaScript ES modules |
| Persistence | `localStorage` |
| Backup format | JSON |
| App metadata | Web App Manifest |
| Offline support | Service worker |
| Assets | SVG and PNG icons |
| Fonts | System fonts from the browser stack |

## Quick Start

This project is a static website. The app can be run in either of the following ways:

1. Open `index.html` directly in a browser.
2. Serve the project folder with a local static web server.

Example using Python:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

No build step or package install is required for the normal browser-based usage.

## Project structure

```text
SaveIt/
├── index.html
├── manifest.webmanifest
├── sw.js
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── calc.js
│   ├── expenses.js
│   ├── modal.js
│   ├── store.js
│   ├── utils.js
│   ├── weeks.js
│   └── views/
│       ├── dashboard.js
│       ├── history.js
│       ├── parts.js
│       └── savings.js
├── SaveIt_icons/
│   ├── apple-touch-icon.svg
│   ├── icon-192.svg
│   ├── icon-512.svg
│   └── SavingGoal.svg
├── icons/
│   └── SaveIt_icons/
│       ├── Android/
│       ├── iOS/
│       ├── bullseye.png
│       ├── calendar.png
│       ├── coffee.png
│       ├── food.png
│       ├── phone.png
│       ├── sack-dollar.png
│       ├── shopping.png
│       ├── snacks.png
│       ├── study.png
│       ├── uninstall.png
│       ├── water.png
│       └── file-send.png
└── .venv/                  # local development environment, not part of the app itself
```

## Page / section structure

The main page is a single app shell with dynamic content injected into the `#view` container.

Important project structure in `index.html`:

- `header.top` — app branding and Add Week button
- `div.brand` — logo and app title
- `main#view` — dynamically rendered dashboard/history/savings content
- `nav.tabbar` — bottom navigation with page buttons and symbol-based icons
- `button[data-page="dashboard"]` — Dashboard tab
- `button[data-page="history"]` — History tab
- `button[data-page="savings"]` — Savings tab
- `noscript` — fallback message if JavaScript is disabled

The app also creates modal dialogs at runtime through `js/modal.js` rather than using a fixed set of HTML modal sections in the page.

## JavaScript architecture

The project uses ES modules and a small modular architecture.

### Main files

- `js/app.js` — app state, render loop, page switching, button actions, import flow
- `js/calc.js` — all weekly money calculations and validation rules
- `js/store.js` — local storage loading, saving, normalization, and backup import/export
- `js/modal.js` — reusable popups for forms and confirmation dialogs
- `js/weeks.js` — add/edit/delete week behavior and week suggestions
- `js/expenses.js` — expense logic, category definitions, and validation
- `js/utils.js` — formatting and helper functions
- `js/views/dashboard.js` — dashboard rendering logic
- `js/views/history.js` — history rendering logic
- `js/views/savings.js` — savings screen rendering logic
- `js/views/parts.js` — shared reusable HTML pieces like goal card and expense rows

### Important functions

- `render()` — redraws the current screen based on the active page
- `commit(result)` — stores valid changes and re-renders the app
- `openAddWeek()` — opens the form for creating a new week
- `openEditWeek(id)` — opens the form for editing an existing week
- `expenseForm(weekId, index)` — handles adding or editing an expense
- `openEditGoal()` — edits the overall savings goal
- `computeWeeks(weeks)` — calculates ranges, carry-over, totals, and remaining balances
- `applyChange(data, mutate)` — validates a mutated budget snapshot before it is accepted
- `normalize(raw)` — checks backup data shape and values before use
- `load()` / `save()` — reads and writes browser storage
- `exportData(data)` — downloads the current budget as a JSON backup file
- `importFile(file)` — reads and restores a saved budget backup
- `renderDashboard()` / `renderHistory()` / `renderSavings()` — page-specific UI builders

## Quick edit map

| I want to... | File | Search for |
| --- | --- | --- |
| Change the app title or brand text | `index.html` | `SaveIt` |
| Change the budget math | `js/calc.js` | `computeWeeks`, `WEEKLY_SAVINGS` |
| Change categories or labels | `js/expenses.js` | `CATEGORIES`, `DEFAULT_CATEGORY` |
| Change storage logic | `js/store.js` | `KEY`, `normalize`, `save` |
| Change modal dialogs | `js/modal.js` | `openForm`, `confirmDialog` |
| Change the dashboard layout | `js/views/dashboard.js` | `renderDashboard` |
| Change the history cards | `js/views/history.js` | `renderHistory`, `weekCard` |
| Change savings view | `js/views/savings.js` | `renderSavings` |
| Change the colors and layout | `css/style.css` | `:root`, `.tabbar`, `.hero`, `.modal-backdrop` |
| Replace app icons | `SaveIt_icons/` and `icons/SaveIt_icons/` | `icon-192`, `icon-512`, `Android/`, `iOS/` |

## Assets

The project contains both SVG and PNG assets:

- `SaveIt_icons/` — SVG app icons and branding files
- `icons/SaveIt_icons/` — PNG assets used in the app UI and Android/iOS icon set

Key asset files include:

- `SaveIt_icons/apple-touch-icon.svg`
- `SaveIt_icons/icon-192.svg`
- `SaveIt_icons/icon-512.svg`
- `icons/SaveIt_icons/Android/`
- `icons/SaveIt_icons/iOS/`
- `icons/SaveIt_icons/sack-dollar.png`
- `icons/SaveIt_icons/calendar.png`
- `icons/SaveIt_icons/bullseye.png`
- `icons/SaveIt_icons/file-send.png`
- `icons/SaveIt_icons/edit-outline.png`

No external font CDN or remote asset host is used in the current project.

## Responsive design

The styling is mobile-first and uses a narrow max-width app shell.

Important responsive details from `css/style.css`:

- `.app` is centered with a max width of `480px`
- `.tabbar` stays pinned to the bottom of the viewport
- `env(safe-area-inset-bottom)` and `env(safe-area-inset-top)` are used for modern mobile compatibility
- `@media (min-width: 700px)` adjusts the `.app` spacing and modal alignment
- Inputs use `font-size: 16px` to avoid iOS zoom issues in form fields

## Important implementation details

- The app is a single-page browser UI. There is no backend or server-side database.
- The latest week is treated as the current week on the dashboard.
- Money is calculated in TND and every week automatically subtracts a savings value of 10 TND before the remaining balance is computed.
- `applyChange` validates operations before they are saved, and invalid budget states are blocked.
- `localStorage` is the only persistence layer; the app does not depend on a database or external service.
- The app uses dynamically generated HTML strings rather than a template framework.
- The service worker caches app shell files for offline behavior.
- The manifest defines standalone app metadata for installable browser use.

## Testing checklist

- [ ] Open the app in a browser.
- [ ] Add the first week and enter received money.
- [ ] Verify the current week and remaining amount update correctly.
- [ ] Add an expense and confirm it appears in the current week.
- [ ] Edit an expense and check the totals refresh.
- [ ] Delete an expense and verify the totals update.
- [ ] Edit the savings goal and confirm the progress bar updates.
- [ ] Open the History view and confirm week entries render correctly.
- [ ] Export a backup JSON file and verify the download works.
- [ ] Import a backup and confirm the data replaces the current budget.
- [ ] Reset all data and confirm the app returns to an empty state.
- [ ] Try an invalid budget change and confirm the app blocks it.
- [ ] Check the mobile layout at narrow widths.
- [ ] Check the desktop layout at wider widths.
- [ ] Check the browser console for errors.

## Deployment

The project is a static front-end application with PWA support (`manifest.webmanifest` and `sw.js`).

Deployment configuration was not identified in the current project. No explicit hosting or deployment config file was found, so the project should be treated as a static site that can be hosted on any normal static file host or served locally.

## Credits / License

No license file or credit file was identified in the current project.

If a license is required later, it should be added explicitly rather than assumed.
