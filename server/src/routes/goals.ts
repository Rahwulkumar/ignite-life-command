import { Hono } from "hono";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { officeNotes, spiritualGoals } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";

const goals = new Hono();
goals.use("*", requireAuth);

// Spiritual goals
goals.get("/spiritual-goals", async (c) => {
  const user = c.get("user");
  const result = await db
    .select()
    .from(spiritualGoals)
    .where(eq(spiritualGoals.userId, user.id))
    .orderBy(spiritualGoals.createdAt);
  return c.json(result);
});

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

goals.delete("/spiritual-goals/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  await db
    .delete(spiritualGoals)
    .where(and(eq(spiritualGoals.id, id), eq(spiritualGoals.userId, user.id)));
  return c.json({ success: true });
});

// Legacy compatibility routes. The live journal model now stores entries in
// office_notes with domain='spiritual' and noteType='journal'.
goals.get("/journal-entries", async (c) => {
  const user = c.get("user");
  const entries = await db
    .select({
      id: officeNotes.id,
      userId: officeNotes.userId,
      title: officeNotes.title,
      content: officeNotes.content,
      createdAt: officeNotes.createdAt,
      updatedAt: officeNotes.updatedAt,
    })
    .from(officeNotes)
    .where(
      and(
        eq(officeNotes.userId, user.id),
        eq(officeNotes.domain, "spiritual"),
        eq(officeNotes.noteType, "journal")
      )
    )
    .orderBy(desc(officeNotes.updatedAt), desc(officeNotes.createdAt));
  return c.json(entries);
});

goals.post("/journal-entries", async (c) => {
  const user = c.get("user");
  const body = await c.req.json<{ title: string; content: unknown }>();
  const [entry] = await db
    .insert(officeNotes)
    .values({
      userId: user.id,
      title: body.title,
      content:
        typeof body.content === "string"
          ? { body: body.content }
          : body.content ?? {},
      domain: "spiritual",
      noteType: "journal",
    })
    .returning({
      id: officeNotes.id,
      userId: officeNotes.userId,
      title: officeNotes.title,
      content: officeNotes.content,
      createdAt: officeNotes.createdAt,
      updatedAt: officeNotes.updatedAt,
    });
  return c.json(entry, 201);
});

goals.delete("/journal-entries/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  await db
    .delete(officeNotes)
    .where(
      and(
        eq(officeNotes.id, id),
        eq(officeNotes.userId, user.id),
        eq(officeNotes.domain, "spiritual"),
        eq(officeNotes.noteType, "journal")
      )
    );
  return c.json({ success: true });
});

export default goals;
