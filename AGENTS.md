# AGENTS.md

## Project overview

SaveIt is a personal weekly budget and savings tracker implemented as a static browser app. It is built using plain HTML, CSS, and JavaScript modules. The app stores data locally in the browser and uses a small set of screens to manage weekly budget logic, expenses, and savings progress.

## Architecture

### Main files

- `index.html` — app shell, top header, bottom navigation, main view container, PWA metadata link
- `css/style.css` — all layout, color, spacing, card, modal, and responsive styles
- `js/app.js` — app state, render loop, page navigation, and user actions
- `js/calc.js` — financial calculations, carry-over logic, validation, and savings summaries
- `js/store.js` — `localStorage` access, backup normalization, import, and export
- `js/modal.js` — reusable form and confirmation modal dialogs
- `js/weeks.js` — week add/edit/delete logic and date suggestions
- `js/expenses.js` — expense logic, categories, and validation
- `js/utils.js` — helpers for number formatting and date formatting
- `js/views/dashboard.js` — dashboard screen rendering
- `js/views/history.js` — history screen rendering
- `js/views/savings.js` — savings screen rendering
- `js/views/parts.js` — shared UI fragments used across screens
- `manifest.webmanifest` — web app manifest
- `sw.js` — service worker for offline and app-shell caching
- `SaveIt_icons/` — SVG branding icons for the app
- `icons/SaveIt_icons/` — PNG branding and tab icons

### HTML structure

The main page is intentionally minimal. The actual dynamic content is rendered into `main#view` from JavaScript modules. The static shell contains:

- header with app branding and Add Week button
- `main#view` for rendered screens
- bottom navigation tabs with `data-page` values
- the app script and service worker registration logic

### CSS organization

The CSS file is organized by feature sections using comments such as:

- layout
- buttons
- savings goal card
- current week card
- expenses
- history
- savings
- bottom tab bar
- popups
- larger screens media query

The project uses custom CSS variables from `:root` for color and spacing decisions.

### JavaScript architecture

The app uses ES modules and render-driven UI updates. It does not use a framework or build system.

Important responsibilities:

- `app.js` owns global state and route switching
- `calc.js` owns all financial rules and data validation
- `store.js` owns persistence, backup export, and backup import
- `modal.js` owns form and confirmation UI
- `views/*` files return HTML strings for each screen
- The export action downloads a JSON backup file, not a PDF, to preserve the original app behavior

### Asset organization

- `SaveIt_icons/` contains SVG icon assets for the app shell and manifest.
- `icons/SaveIt_icons/` contains PNGs for navigation buttons and platform-specific icons.
- Asset paths are relative, and the project expects them to remain in place without a bundler.

## Find things fast

Use targeted searches like these when modifying or documenting the project:

```bash
rg -n "data-page|main id=\"view\"|tabbar|brand" index.html
rg -n "WEEKLY_SAVINGS|computeWeeks|applyChange|savingsSummary|totals" js/calc.js
rg -n "localStorage|normalize|exportData|importFile|save\(|load\(" js/store.js
rg -n "openForm|confirmDialog|closeModal" js/modal.js
rg -n "renderDashboard|renderHistory|renderSavings|goalCard|expenseRows" js/views
rg -n ":root|@media|\.tabbar|\.hero|\.modal-backdrop" css/style.css
```

## Important areas

| Area | File | Location |
| --- | --- | --- |
| App shell | `index.html` | header, `main#view`, nav bar |
| Page switching | `js/app.js` | `page` state and click handlers |
| Budget math | `js/calc.js` | `computeWeeks`, `applyChange`, `savingsSummary` |
| Storage | `js/store.js` | `normalize`, `save`, `load`, `exportData` |
| Forms and confirmations | `js/modal.js` | `openForm`, `confirmDialog` |
| Dashboard UI | `js/views/dashboard.js` | `renderDashboard` |
| History UI | `js/views/history.js` | `renderHistory` |
| Savings UI | `js/views/savings.js` | `renderSavings` |
| Shared UI blocks | `js/views/parts.js` | `goalCard`, `expenseRows` |
| Core styling | `css/style.css` | `:root`, `.app`, `.tabbar`, `.modal-backdrop` |

## Change rules

- Keep the existing architecture and module boundaries.
- Do not introduce frameworks, build tools, or package dependencies unless explicitly requested.
- Prefer minimal diffs over rewrites.
- Preserve the current data model and local storage compatibility behavior.
- Keep the JSON backup format behavior intact unless the task explicitly asks to change it.
- Keep the existing dynamic HTML rendering approach rather than replacing it with a framework.
- Preserve current CSS variables and naming patterns when editing styles.
- Do not rename existing files or move asset folders without explicit instruction.
- Do not break the `data-page` navigation system or the `data-action` event model.
- Do not rewrite working validation logic unless the task specifically requires it.

## CSS rules

- The stylesheet is centralized in `css/style.css`.
- Use existing CSS custom properties from `:root` before creating new color tokens.
- Respect the mobile-first layout and the existing `max-width: 480px` app shell.
- Keep the fixed bottom nav and safe-area support intact.
- Edit existing selectors instead of creating duplicate style systems.
- Preserve modal and form behavior when adjusting layout or spacing.

## JavaScript rules

- Keep the app modular; do not merge unrelated logic into a single file.
- Preserve the `data-action` pattern used for buttons and actions.
- Preserve the render-and-commit flow used by `app.js`.
- Keep validation logic centralized in `calc.js` and `store.js`.
- Avoid introducing asynchronous or backend dependencies unless the task explicitly calls for them.
- Keep the existing `localStorage` data structure compatible with current usage.

## Assets rules

- Keep relative paths working from the project root.
- Respect case sensitivity when editing file names and paths.
- Do not remove or rename the `SaveIt_icons/` or `icons/SaveIt_icons/` folders without a clear reason.
- PNG and SVG assets are part of the app branding and should stay aligned with the manifest and UI references.

## Before finishing any change

1. Review the file list and confirm only the intended files were edited.
2. Confirm asset paths still resolve correctly.
3. Confirm `data-page` navigation still triggers the correct screens.
4. Confirm the modal flow still opens and closes correctly.
5. Confirm the budget math still validates correctly.
6. Confirm the app still works in a browser without JavaScript errors.
7. Confirm responsive behavior still works at narrow and wide widths.

## AI agent behavior

- Inspect the actual project before making changes.
- Prefer small, targeted edits.
- Do not rewrite working code simply to improve style.
- Do not create duplicate implementations when one module already handles the job.
- Do not add libraries, frameworks, or build tooling unless requested.
- Do not modify unrelated files.
- Verify changes before finishing.
- Report exactly which files were changed at the end of the task.

## Notes

This project is a finished static web app. Documentation and future edits should reflect the real architecture shown by the current files, not a hypothetical architecture.

If a fact cannot be determined from the repository, the correct answer is: `Not identified in the current project.`
