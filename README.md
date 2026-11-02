# DebtWise: Debt Management Tracker

A single-page app to add, view, edit, pay down and delete debts, backed by a JSON Server REST API.

## Objectives
Help users see total debt, monthly minimums and payoff progress in one place.

## Technologies
HTML5, CSS (Grid, media queries), JavaScript (ES modules), JSON Server 0.17.4, Node test runner, GitHub Pages, Render.

## Project structure
`js/api.js` (HTTP calls), `js/validators.js` (input checks), `js/calculations.js` (maths), `js/ui.js` (DOM rendering), `js/main.js` (wiring).

## Setup
```
git clone https://github.com/steph-craft/Debtwise-.git
cd debtwise
npm install
npm run api        # API at http://localhost:3000
```
Open `index.html` with VS Code Live Server (or `npx serve .`).

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | /debts | List debts |
| POST | /debts | Create a debt |
| PUT | /debts/:id | Replace a debt (edit form) |
| PATCH | /debts/:id | Record a payment (balance) |
| DELETE | /debts/:id | Remove a debt |

## External API
Currency rates: `GET https://open.er-api.com/v6/latest/USD` (read-only). Debts are stored in USD and converted for display.

## Tests
`npm test` (Node 20+) runs unit tests with coverage.

## Deployment
- Frontend: https://steph-craft.github.io/Debtwise-/

## Design
Teal `#0F5C5C`, Coral `#E8694A`, Gold `#C9A227`; neutrals `#F7F7F5`, `#FFFFFF`, `#E2E2DE`. Figma: ADD LINK.

## License
MIT
