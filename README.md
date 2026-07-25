# Sports Prop

Sports Prop is a React + Node.js sports prop firm platform foundation. It uses a DBMS Gateway connection style, so the app does not store direct MySQL host/user/password values. The backend talks to the database through `diamond-sql` with `SITE_ID`, `API_KEY`, and `DBMS_URL`.

## Current Apps

- `frontend/`: React + Vite app with routing, auth screens, dashboard, prop board, match listings, status page, 404 page, responsive hamburger navigation, toast component, and Vercel SPA rewrites.
- `backend/`: Express API with DBMS Gateway database access, auth/users routes, props routes, match listings proxy, health/debug routes, and live SQL migrations.

## Backend

```bash
cd backend
npm install
npm run dev
```

Useful commands:

```bash
npm start
npm run dev
npm run migrate
npm test
```

Backend env shape:

```env
PORT=5050
SITE_ID=sports-prop
API_KEY=replace-with-full-dbms-api-key
DBMS_URL=http://localhost:4000
DBMS_TIMEOUT_MS=15000
JWT_SECRET=replace-with-long-random-secret
SPORTS_DATA_PROVIDER=sportmonks
SPORTMONKS_API_TOKEN=replace-with-sportmonks-token
SPORTMONKS_BASE_URL=https://api.sportmonks.com/v3/football
```

`PROPS_TABLE` and `USERS_TABLE` are not needed. The migrated table names are fixed as `sports_props` and `users`.

Implemented API routes:

- `GET /health`
- `GET /api/health`
- `GET /api/debug`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `GET /api/matches?date=YYYY-MM-DD`
- `GET /api/props`
- `GET /api/props/:id`
- `GET /api/leagues`

## Database Migrations

Migrations live in `backend/migrations/` and are run through the DBMS Gateway:

```bash
cd backend
npm run migrate
```

Current tables:

- `schema_migrations`
- `users`
- `challenge_packages`
- `challenges`
- `sports_fixtures`
- `sports_props`
- `tickets`
- `ticket_selections`
- `ledger_entries`
- `risk_snapshots`
- `payout_requests`

Seeded challenge packages:

- `Starter 10K`
- `Pro 25K`
- `Elite 50K`

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend env:

```env
VITE_API_BASE_URL=https://sports-prop.vercel.app/api
```

Frontend routes:

- `/`
- `/dashboard`
- `/props`
- `/matches`
- `/status`
- `/login`
- `/register`
- `*` 404 page

## Real Match Listings

The backend uses Sportmonks as the first real sports data provider. Add `SPORTMONKS_API_TOKEN` in `backend/.env`, then call:

```txt
GET /api/matches?date=2026-07-25
```

The token stays on the backend. The frontend only calls the backend `/matches` endpoint.

## Notes

- Vite currently builds with a warning because local Node is `20.17.0`; Vite wants `20.19+` or `22.12+`.
- The frontend has `frontend/vercel.json` to rewrite React routes to `index.html` on Vercel.
