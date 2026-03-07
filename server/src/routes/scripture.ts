import { Hono } from "hono";
import { requireAuth } from "../middleware/auth";
import { db } from "../db";
import { scriptureVerses } from "../db/schema";
import { eq, and } from "drizzle-orm";

const scripture = new Hono();
scripture.use("*", requireAuth);

// GET /api/scripture-verses
scripture.get("/scripture-verses", async (c) => {
  const user = c.get("user");
  const verses = await db
    .select()
    .from(scriptureVerses)
    .where(eq(scriptureVerses.userId, user.id))
    .orderBy(scriptureVerses.createdAt);
  return c.json(verses);
});

// POST /api/scripture-verses
scripture.post("/scripture-verses", async (c) => {
  const user = c.get("user");
  const body = await c.req.json<{
    reference: string;
    verseText: string;
    masteryLevel?: number;
  }>();
  const [verse] = await db
    .insert(scriptureVerses)
    .values({ ...body, userId: user.id })
    .returning();
  return c.json(verse, 201);
});

// PATCH /api/scripture-verses/:id — update mastery level
scripture.patch("/scripture-verses/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = await c.req.json<{ masteryLevel: number }>();
  const [updated] = await db
    .update(scriptureVerses)
    .set({ masteryLevel: body.masteryLevel, updatedAt: new Date() })
    .where(
      and(eq(scriptureVerses.id, id), eq(scriptureVerses.userId, user.id))
    )
    .returning();
  if (!updated) return c.json({ error: "Not found" }, 404);
  return c.json(updated);
});

// DELETE /api/scripture-verses/:id
scripture.delete("/scripture-verses/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  await db
    .delete(scriptureVerses)
    .where(
      and(eq(scriptureVerses.id, id), eq(scriptureVerses.userId, user.id))
    );
  return c.json({ success: true });
});

export default scripture;
