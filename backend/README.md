# Sports Prop Backend

Express API for the Sports Prop platform. Database access goes through the DBMS Gateway using the local `diamond-sql` client.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Required DBMS env values:

```env
SITE_ID=sports-prop
API_KEY=replace-with-full-dbms-api-key
DBMS_URL=http://localhost:4000
```

Do not add direct MySQL credentials here. The DBMS Gateway owns the real database host, user, password, and pool settings.

## Commands

```bash
npm start       # run server.js
npm run dev     # run with nodemon
npm run migrate # apply SQL migrations through DBMS Gateway
npm test        # syntax-check backend files
```

## Routes

System:

- `GET /health`
- `GET /api/health`
- `GET /api/debug`

Auth and users:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`

Sports data:

- `GET /api/matches?date=YYYY-MM-DD`
- `GET /api/props`
- `GET /api/props/:id`
- `GET /api/leagues`

## Migrations

Migration runner:

```bash
npm run migrate
```

Migration files:

- `migrations/001_core_schema.sql`
- `migrations/002_seed_challenge_packages.sql`

The runner creates `schema_migrations` and skips migration files that have already been applied.

## Real Match Provider

The backend currently supports Sportmonks fixtures:

```env
SPORTS_DATA_PROVIDER=sportmonks
SPORTMONKS_API_TOKEN=replace-with-sportmonks-token
SPORTMONKS_BASE_URL=https://api.sportmonks.com/v3/football
```

`SPORTMONKS_API_TOKEN` must stay backend-only.
