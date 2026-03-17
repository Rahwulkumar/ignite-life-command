import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.js";
import { db } from "../db/index.js";
import { bibleReadingPlans } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

const bible = new Hono();
bible.use("*", requireAuth);

// GET /api/bible-reading-plans — get user's latest plan
bible.get("/bible-reading-plans", async (c) => {
  const user = c.get("user");
  const plans = await db
    .select()
    .from(bibleReadingPlans)
    .where(eq(bibleReadingPlans.userId, user.id))
    .orderBy(bibleReadingPlans.updatedAt)
    .limit(1);
  return c.json(plans[0] ?? null);
});

// POST /api/bible-reading-plans — create a new plan
bible.post("/bible-reading-plans", async (c) => {
  const user = c.get("user");
  const body = await c.req.json<{
    name: string;
    currentBook?: string;
    currentChapter?: number;
    currentVerse?: number;
  }>();
  const [plan] = await db
    .insert(bibleReadingPlans)
    .values({ ...body, userId: user.id })
    .returning();
  return c.json(plan, 201);
});

// PATCH /api/bible-reading-plans/:id — update reading position
bible.patch("/bible-reading-plans/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = await c.req.json<{
    currentBook?: string;
    currentChapter?: number;
    currentVerse?: number;
  }>();
  const [updated] = await db
    .update(bibleReadingPlans)
    .set({ ...body, updatedAt: new Date() })
    .where(
      and(
        eq(bibleReadingPlans.id, id),
        eq(bibleReadingPlans.userId, user.id)
      )
    )
    .returning();
  if (!updated) return c.json({ error: "Not found" }, 404);
  return c.json(updated);
});

export default bible;
