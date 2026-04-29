import { Hono } from "hono";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { contentFolders, contentItems } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import {
  cleanupLegacySeedContent,
  saveSharedContent,
  type ContentItemType,
} from "../services/content.js";
import { getUserId } from "../utils/user-context.js";

const contentRoute = new Hono();

contentRoute.use("*", requireAuth);

contentRoute.get("/content", async (c) => {
  const userId = getUserId(c);
  await cleanupLegacySeedContent(userId);

  const [folders, items] = await Promise.all([
    db
      .select()
      .from(contentFolders)
      .where(eq(contentFolders.userId, userId))
      .orderBy(asc(contentFolders.createdAt)),
    db
      .select()
      .from(contentItems)
      .where(eq(contentItems.userId, userId))
      .orderBy(desc(contentItems.createdAt)),
  ]);

  const folderCounts = items.reduce<Map<string, number>>((accumulator, item) => {
    if (item.folderId) {
      accumulator.set(item.folderId, (accumulator.get(item.folderId) ?? 0) + 1);
    }
    return accumulator;
  }, new Map());
  const folderById = new Map(folders.map((folder) => [folder.id, folder]));

  return c.json({
    folders: folders.map((folder) => ({
      ...folder,
      itemCount: folderCounts.get(folder.id) ?? 0,
    })),
    items: items.map((item) => ({
      ...item,
      folderName: item.folderId ? (folderById.get(item.folderId)?.name ?? null) : null,
    })),
  });
});

contentRoute.post("/content/folders", async (c) => {
  const userId = getUserId(c);
  const body = await c.req.json<{
    name: string;
    color?: string;
  }>();

  const name = body.name?.trim();
  if (!name) {
    return c.json({ error: "Folder name is required" }, 400);
  }

  const [folder] = await db
    .insert(contentFolders)
    .values({
      userId,
      name,
      color: body.color?.trim() || "bg-tech",
      itemCount: 0,
    })
    .returning();

  return c.json(folder, 201);
});

contentRoute.post("/content/items", async (c) => {
  const userId = getUserId(c);
  const body = await c.req.json<{
    title?: string;
    source?: string;
    type?: ContentItemType;
    dateLabel?: string;
    url?: string;
    folderName?: string;
  }>();

  const rawUrl = body.url?.trim();

  if (rawUrl) {
    const result = await saveSharedContent({
      userId,
      rawText: rawUrl,
      captureSource: "manual",
      messageDate: undefined,
      explicitTitle: body.title?.trim() || null,
      explicitUrl: rawUrl,
      explicitFolderName: body.folderName?.trim() || null,
      explicitSource: body.source?.trim() || null,
      explicitType: body.type ?? null,
    });

    const item = result.savedItems[0] ?? result.duplicateItems[0];
    if (!item) {
      return c.json({ error: "Unable to save that link." }, 400);
    }

    return c.json(item, result.savedItems.length > 0 ? 201 : 200);
  }

  const title = body.title?.trim();
  const source = body.source?.trim();
  const type = body.type?.trim();

  if (!title) {
    return c.json({ error: "Title is required" }, 400);
  }

  if (!source) {
    return c.json({ error: "Source is required" }, 400);
  }

  if (!type) {
    return c.json({ error: "Type is required" }, 400);
  }

  const [item] = await db
    .insert(contentItems)
    .values({
      userId,
      title,
      source,
      type,
      summary: null,
      dateLabel: body.dateLabel?.trim() || "Today",
      url: body.url?.trim() || "#",
      metadata: {
        captureSource: "manual",
      },
    })
    .returning();

  return c.json(item, 201);
});

export default contentRoute;
