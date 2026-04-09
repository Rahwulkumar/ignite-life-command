import { Hono } from "hono";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { contentFolders, contentItems } from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import { getUserId } from "../utils/user-context.js";

const contentRoute = new Hono();

contentRoute.use("*", requireAuth);

const seedFolders = [
  { name: "Learning", itemCount: 34, color: "bg-tech" },
  { name: "Entertainment", itemCount: 45, color: "bg-music" },
  { name: "Inspiration", itemCount: 28, color: "bg-spiritual" },
  { name: "Tech Tutorials", itemCount: 21, color: "bg-trading" },
  { name: "Music Theory", itemCount: 15, color: "bg-music" },
  { name: "Design Inspo", itemCount: 32, color: "bg-content" },
  { name: "Productivity", itemCount: 18, color: "bg-finance" },
  { name: "Watch Later", itemCount: 67, color: "bg-muted-foreground" },
];

const seedItems = [
  { title: "React Server Components Deep Dive", source: "YouTube", type: "video", dateLabel: "Today", url: "#" },
  { title: "Minimalist Desk Setup Inspo", source: "Instagram", type: "reel", dateLabel: "Yesterday", url: "#" },
  { title: "System Design Interview Prep", source: "YouTube", type: "video", dateLabel: "Dec 27", url: "#" },
  { title: "Morning Routine for Productivity", source: "Instagram", type: "reel", dateLabel: "Dec 26", url: "#" },
  { title: "Advanced TypeScript Patterns", source: "Medium", type: "article", dateLabel: "Dec 25", url: "#" },
];

async function ensureContentSeedData(userId: string) {
  const [existingFolders, existingItems] = await Promise.all([
    db
      .select({ id: contentFolders.id })
      .from(contentFolders)
      .where(eq(contentFolders.userId, userId))
      .limit(1),
    db
      .select({ id: contentItems.id })
      .from(contentItems)
      .where(eq(contentItems.userId, userId))
      .limit(1),
  ]);

  const writes: Promise<unknown>[] = [];

  if (existingFolders.length === 0) {
    writes.push(
      db.insert(contentFolders).values(
        seedFolders.map((folder) => ({
          userId,
          ...folder,
        })),
      ),
    );
  }

  if (existingItems.length === 0) {
    writes.push(
      db.insert(contentItems).values(
        seedItems.map((item) => ({
          userId,
          ...item,
        })),
      ),
    );
  }

  if (writes.length > 0) {
    await Promise.all(writes);
  }
}

contentRoute.get("/content", async (c) => {
  const userId = getUserId(c);
  await ensureContentSeedData(userId);

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

  return c.json({ folders, items });
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
    title: string;
    source: string;
    type: string;
    dateLabel?: string;
    url?: string;
  }>();

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
      dateLabel: body.dateLabel?.trim() || "Today",
      url: body.url?.trim() || "#",
    })
    .returning();

  return c.json(item, 201);
});

export default contentRoute;
