import { Hono } from "hono";
import { requireAuth } from "../middleware/auth";
import { db } from "../db";
import { dailyFocus } from "../db/schema";
import { eq, and } from "drizzle-orm";

const spiritual = new Hono();
spiritual.use("*", requireAuth);

// ── Daily Focus ──────────────────────────────────────────────

// GET /api/daily-focus?date=YYYY-MM-DD
spiritual.get("/daily-focus", async (c) => {
  const user = c.get("user");
  const date = c.req.query("date") ?? new Date().toLocaleDateString("en-CA");
  const [focus] = await db
    .select()
    .from(dailyFocus)
    .where(and(eq(dailyFocus.userId, user.id), eq(dailyFocus.date, date)));
  return c.json(focus ?? null);
});

// POST /api/daily-focus — upsert today's focus
spiritual.post("/daily-focus", async (c) => {
  const user = c.get("user");
  const body = await c.req.json<{
    reference: string;
    content: string;
    date?: string;
  }>();
  const date = body.date ?? new Date().toLocaleDateString("en-CA");
  const [focus] = await db
    .insert(dailyFocus)
    .values({ userId: user.id, date, reference: body.reference, content: body.content })
    .onConflictDoUpdate({
      target: [dailyFocus.userId, dailyFocus.date],
      set: {
        reference: body.reference,
        content: body.content,
        updatedAt: new Date(),
      },
    })
    .returning();
  return c.json(focus);
});

// PATCH /api/daily-focus/:id — mark completed
spiritual.patch("/daily-focus/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = await c.req.json<{ completed: boolean }>();
  const [updated] = await db
    .update(dailyFocus)
    .set({ completed: body.completed, updatedAt: new Date() })
    .where(and(eq(dailyFocus.id, id), eq(dailyFocus.userId, user.id)))
    .returning();
  if (!updated) return c.json({ error: "Not found" }, 404);
  return c.json(updated);
});

export default spiritual;
