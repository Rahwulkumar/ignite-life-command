import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/auth.js";
import { viewConfigs } from "../db/schema.js";
import { getUserId } from "../utils/user-context.js";

const views = new Hono();

views.use("*", requireAuth);

views.get("/view-configs/:viewKey", async (c) => {
  const userId = getUserId(c);
  const viewKey = c.req.param("viewKey");

  const [config] = await db
    .select()
    .from(viewConfigs)
    .where(and(eq(viewConfigs.userId, userId), eq(viewConfigs.viewKey, viewKey)));

  return c.json(config ?? null);
});

views.put("/view-configs/:viewKey", async (c) => {
  const userId = getUserId(c);
  const viewKey = c.req.param("viewKey");
  const body = await c.req.json<{
    schemaVersion?: number;
    layout: unknown;
  }>();

  const [config] = await db
    .insert(viewConfigs)
    .values({
      userId,
      viewKey,
      schemaVersion: body.schemaVersion ?? 1,
      layout: body.layout ?? {},
    })
    .onConflictDoUpdate({
      target: [viewConfigs.userId, viewConfigs.viewKey],
      set: {
        schemaVersion: body.schemaVersion ?? 1,
        layout: body.layout ?? {},
        updatedAt: new Date(),
      },
    })
    .returning();

  return c.json(config);
});

views.delete("/view-configs/:viewKey", async (c) => {
  const userId = getUserId(c);
  const viewKey = c.req.param("viewKey");

  await db
    .delete(viewConfigs)
    .where(and(eq(viewConfigs.userId, userId), eq(viewConfigs.viewKey, viewKey)));

  return c.json({ success: true });
});

export default views;
