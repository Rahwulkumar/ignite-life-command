# Ignite Life Command

Ignite Life Command is a personal life operating system built as a React frontend plus a Hono API server. The current live stack is React + Better Auth + Hono + Drizzle + PostgreSQL, with domain-specific AI routes for Sage and Nova.

## Current Status

- Auth is live through Better Auth with cookie sessions.
- Notes are live and act as the canonical content system.
- The spiritual domain is the most complete feature area.
- The dashboard uses a mix of live checklist data and placeholder domain content.
- Finance, tech, music, content, and projects still rely heavily on mock data.

## Active Architecture

- Frontend: React 18, Vite, TypeScript, React Router, TanStack Query, Tailwind, shadcn/ui, TipTap
- Backend: Hono, Better Auth, Drizzle ORM
- Database: PostgreSQL via `DATABASE_URL`
- AI: OpenAI streaming responses served through `/api/ai/sage` and `/api/ai/nova`
- Canonical content store: `office_notes`

## Important Data Model Notes

- `office_notes` is the live source of truth for notes, folders, hubs, spiritual journal entries, and spiritual character records.
- `/api/journal-entries` still exists as a compatibility route, but it now reads and writes spiritual journal entries through `office_notes`.
- `supabase/` is legacy project history from the earlier Supabase-based prototype. It is not the active runtime path.

## Repo Layout

- `src/`: React frontend
- `server/`: Hono API server, Better Auth config, Drizzle schema and routes
- `supabase/`: legacy migrations and edge-function snapshots kept for reference

## Local Setup

### 1. Install dependencies

```bash
npm install
cd server
npm install
cd ..
```

### 2. Configure frontend env

```bash
cp .env.example .env
```

Set:

```env
VITE_API_URL=http://localhost:3001
```

### 3. Configure server env

```bash
cd server
cp .env.example .env
```

Set these values in `server/.env`:

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=sk-...
PORT=3001
```

### 4. Push the schema

```bash
cd server
npm run db:push
```

### 5. Run the app

In one terminal:

```bash
cd server
npm run dev
```

In another terminal:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

API: `http://localhost:3001`

## Feature Snapshot

| Area | Status | Notes |
|---|---|---|
| Auth | Live | Better Auth email/password with cookie sessions |
| Notes | Live | Cross-domain notes, folders, journals, hubs |
| Spiritual | Live | Bible reading, daily focus, scripture memory, goals, journal, character library |
| Dashboard | Partial | Checklist analytics are live; surrounding domain content is mixed |
| Trading AI | Live | Nova streams from the Hono backend |
| Spiritual AI | Live | Sage streams from the Hono backend |
| Finance | Placeholder | UI exists, persistence not wired |
| Technology | Placeholder | UI exists, persistence not wired |
| Music | Placeholder | UI exists, persistence not wired |
| Content | Placeholder | UI exists, persistence not wired |
| Projects | Placeholder | UI exists, persistence not wired |

## Useful Commands

```bash
# frontend
npm run dev
npm run build
npm run lint

# server
cd server
npm run dev
npm run build
npm run db:push
```
