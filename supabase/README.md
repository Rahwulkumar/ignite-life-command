This directory is legacy project history from the earlier Supabase-based version of Ignite Life Command.

It is not part of the active runtime. The live application now uses:

- Better Auth for authentication
- Hono for the API server
- Drizzle for database access
- PostgreSQL through `server/src/db/schema.ts`

The files here are kept only for reference, migration history, or possible manual backfill work. Do not add new runtime features here unless you are intentionally reviving the old architecture.
