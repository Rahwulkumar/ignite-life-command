import { Hono } from "hono";
import { requireAuth } from "../middleware/auth";
import { db } from "../db";
import { spiritualGoals, spiritualJournalEntries } from "../db/schema";
import { eq, and } from "drizzle-orm";

const goals = new Hono();
goals.use("*", requireAuth);

// ── Spiritual Goals ────────────────────────────────────────

// GET /api/spiritual-goals
goals.get("/spiritual-goals", async (c) => {
  const user = c.get("user");
  const result = await db
    .select()
    .from(spiritualGoals)
    .where(eq(spiritualGoals.userId, user.id))
    .orderBy(spiritualGoals.createdAt);
  return c.json(result);
});

// POST /api/spiritual-goals
goals.post("/spiritual-goals", async (c) => {
  const user = c.get("user");
  const body = await c.req.json<{
    title: string;
    description?: string;
    targetDate?: string;
    category?: string;
  }>();
  const [goal] = await db
    .insert(spiritualGoals)
    .values({ ...body, userId: user.id })
    .returning();
  return c.json(goal, 201);
});

// PATCH /api/spiritual-goals/:id
goals.patch("/spiritual-goals/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = await c.req.json();
  const [updated] = await db
    .update(spiritualGoals)
    .set(body)
    .where(and(eq(spiritualGoals.id, id), eq(spiritualGoals.userId, user.id)))
    .returning();
  if (!updated) return c.json({ error: "Not found" }, 404);
  return c.json(updated);
});

// DELETE /api/spiritual-goals/:id
goals.delete("/spiritual-goals/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  await db
    .delete(spiritualGoals)
    .where(and(eq(spiritualGoals.id, id), eq(spiritualGoals.userId, user.id)));
  return c.json({ success: true });
});

// ── Spiritual Journal ──────────────────────────────────────

// GET /api/journal-entries
goals.get("/journal-entries", async (c) => {
  const user = c.get("user");
  const entries = await db
    .select()
    .from(spiritualJournalEntries)
    .where(eq(spiritualJournalEntries.userId, user.id))
    .orderBy(spiritualJournalEntries.createdAt);
  return c.json(entries);
});

// POST /api/journal-entries
goals.post("/journal-entries", async (c) => {
  const user = c.get("user");
  const body = await c.req.json<{ title: string; content: unknown }>();
  const [entry] = await db
    .insert(spiritualJournalEntries)
    .values({ title: body.title, content: body.content, userId: user.id })
    .returning();
  return c.json(entry, 201);
});

// DELETE /api/journal-entries/:id
goals.delete("/journal-entries/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  await db
    .delete(spiritualJournalEntries)
    .where(
      and(
        eq(spiritualJournalEntries.id, id),
        eq(spiritualJournalEntries.userId, user.id)
      )
    );
  return c.json({ success: true });
});

export default goals;
