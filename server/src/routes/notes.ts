import { Hono } from "hono";
import { requireAuth } from "../middleware/auth";
import { db } from "../db";
import { officeNotes } from "../db/schema";
import { eq, and, desc, ilike } from "drizzle-orm";

const notes = new Hono();
notes.use("*", requireAuth);

// GET /api/notes — all notes for user, pinned first
notes.get("/notes", async (c) => {
  const user = c.get("user");
  const domain = c.req.query("domain");
  const noteType = c.req.query("noteType");
  const search = c.req.query("search");

  const conditions = [eq(officeNotes.userId, user.id)];
  if (domain) conditions.push(eq(officeNotes.domain, domain));
  if (noteType) conditions.push(eq(officeNotes.noteType, noteType));
  if (search) conditions.push(ilike(officeNotes.title, `%${search}%`));

  const result = await db
    .select()
    .from(officeNotes)
    .where(and(...conditions))
    .orderBy(desc(officeNotes.isPinned), desc(officeNotes.updatedAt));

  return c.json(result);
});

// GET /api/notes/:id — single note
notes.get("/notes/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const [note] = await db
    .select()
    .from(officeNotes)
    .where(and(eq(officeNotes.id, id), eq(officeNotes.userId, user.id)));
  if (!note) return c.json({ error: "Not found" }, 404);
  return c.json(note);
});

// POST /api/notes — create note
notes.post("/notes", async (c) => {
  const user = c.get("user");
  const body = await c.req.json<{
    title?: string;
    content?: unknown;
    parentId?: string;
    icon?: string;
    domain?: string;
    noteType?: string;
    isTemplate?: boolean;
  }>();
  const [note] = await db
    .insert(officeNotes)
    .values({
      userId: user.id,
      title: body.title ?? "Untitled",
      content: body.content ?? {},
      parentId: body.parentId ?? null,
      icon: body.icon ?? "📝",
      domain: body.domain ?? null,
      noteType: body.noteType ?? "page",
      isTemplate: body.isTemplate ?? false,
    })
    .returning();
  return c.json(note, 201);
});

// PATCH /api/notes/:id — update note
notes.patch("/notes/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = await c.req.json();
  const [updated] = await db
    .update(officeNotes)
    .set({ ...body, updatedAt: new Date() })
    .where(and(eq(officeNotes.id, id), eq(officeNotes.userId, user.id)))
    .returning();
  if (!updated) return c.json({ error: "Not found" }, 404);
  return c.json(updated);
});

// DELETE /api/notes/:id — delete note
notes.delete("/notes/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  await db
    .delete(officeNotes)
    .where(and(eq(officeNotes.id, id), eq(officeNotes.userId, user.id)));
  return c.json({ success: true });
});

export default notes;
