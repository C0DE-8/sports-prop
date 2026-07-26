# Sports Prop Frontend

React + Vite frontend for the Sports Prop platform.

## Setup

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Environment

```env
VITE_API_BASE_URL=https://sports-prop.vercel.app/api
```

Vite exposes `VITE_` variables to the browser, so only public frontend values belong here. API provider secrets such as Sportmonks tokens stay in the backend env.

## Routes

- `/` landing page
- `/dashboard` prop operations dashboard
- `/props` prop board
- `/matches` real Sportmonks round odds and fixture listing page
- `/status` backend and DBMS status page
- `/login` login page
- `/register` registration page
- `*` 404 page

## Structure

- `src/api/`: axios client and API-specific request files
- `src/components/navigation/`: responsive sidebar and hamburger menu
- `src/components/toast/`: reusable toast/alert component
- `src/pages/*/index.jsx`: page-level route components

## Deployment

`vercel.json` rewrites all routes to `index.html` so React Router works on refresh and direct route visits.
