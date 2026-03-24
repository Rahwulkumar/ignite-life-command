import { Hono } from "hono";
import { db } from "../db/index.js";
import { officeNotes } from "../db/schema.js";
import { eq, and, desc, ilike } from "drizzle-orm";

const STATIC_USER_ID = "local-user";

const notes = new Hono();

// GET /api/notes — all notes for user, pinned first
notes.get("/notes", async (c) => {
  const domain = c.req.query("domain");
  const noteType = c.req.query("noteType");
  const search = c.req.query("search");

  const conditions = [eq(officeNotes.userId, STATIC_USER_ID)];
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
  const id = c.req.param("id");
  const [note] = await db
    .select()
    .from(officeNotes)
    .where(and(eq(officeNotes.id, id), eq(officeNotes.userId, STATIC_USER_ID)));
  if (!note) return c.json({ error: "Not found" }, 404);
  return c.json(note);
});

// POST /api/notes — create note
notes.post("/notes", async (c) => {
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
      userId: STATIC_USER_ID,
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

// PATCH /api/notes/:id — update note (explicit field picking — never allow userId override)
notes.patch("/notes/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<{
    title?: string;
    content?: unknown;
    icon?: string;
    coverImage?: string | null;
    isPinned?: boolean;
    parentId?: string | null;
    domain?: string | null;
    noteType?: string;
  }>();

  // Only pick explicitly allowed fields to prevent userId/id overwrite
  const patch: Record<string, unknown> = { updatedAt: new Date() };
  if (body.title !== undefined) patch.title = body.title;
  if (body.content !== undefined) patch.content = body.content;
  if (body.icon !== undefined) patch.icon = body.icon;
  if (body.coverImage !== undefined) patch.coverImage = body.coverImage;
  if (body.isPinned !== undefined) patch.isPinned = body.isPinned;
  if (body.parentId !== undefined) patch.parentId = body.parentId;
  if (body.domain !== undefined) patch.domain = body.domain;
  if (body.noteType !== undefined) patch.noteType = body.noteType;

  const [updated] = await db
    .update(officeNotes)
    .set(patch)
    .where(and(eq(officeNotes.id, id), eq(officeNotes.userId, STATIC_USER_ID)))
    .returning();
  if (!updated) return c.json({ error: "Not found" }, 404);
  return c.json(updated);
});

// DELETE /api/notes/:id — delete note
notes.delete("/notes/:id", async (c) => {
  const id = c.req.param("id");
  await db
    .delete(officeNotes)
    .where(and(eq(officeNotes.id, id), eq(officeNotes.userId, STATIC_USER_ID)));
  return c.json({ success: true });
});

export default notes;
