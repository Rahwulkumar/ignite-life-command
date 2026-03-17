import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.js";
import { db } from "../db/index.js";
import { dailyChecklistEntries, customTaskMetrics } from "../db/schema.js";
import { eq, and, gte, lte } from "drizzle-orm";

const checklist = new Hono();
checklist.use("*", requireAuth);

// ── Checklist Entries ──────────────────────────────────────

// GET /api/checklist-entries?start=YYYY-MM-DD&end=YYYY-MM-DD
checklist.get("/checklist-entries", async (c) => {
  const user = c.get("user");
  const start = c.req.query("start");
  const end = c.req.query("end");

  const entries = await db
    .select()
    .from(dailyChecklistEntries)
    .where(
      and(
        eq(dailyChecklistEntries.userId, user.id),
        start ? gte(dailyChecklistEntries.entryDate, start) : undefined,
        end ? lte(dailyChecklistEntries.entryDate, end) : undefined
      )
    )
    .orderBy(dailyChecklistEntries.entryDate);

  return c.json(entries);
});

// POST /api/checklist-entries — upsert (toggle)
checklist.post("/checklist-entries", async (c) => {
  const user = c.get("user");
  const body = await c.req.json<{
    taskId: string;
    entryDate: string;
    isCompleted: boolean;
    metricsData?: Record<string, unknown>;
    durationSeconds?: number;
    notes?: string;
  }>();

  const [entry] = await db
    .insert(dailyChecklistEntries)
    .values({
      userId: user.id,
      taskId: body.taskId,
      entryDate: body.entryDate,
      isCompleted: body.isCompleted,
      metricsData: body.metricsData ?? {},
      durationSeconds: body.durationSeconds ?? null,
      notes: body.notes ?? null,
    })
    .onConflictDoUpdate({
      target: [
        dailyChecklistEntries.userId,
        dailyChecklistEntries.taskId,
        dailyChecklistEntries.entryDate,
      ],
      set: {
        isCompleted: body.isCompleted,
        metricsData: body.metricsData ?? {},
        durationSeconds: body.durationSeconds ?? null,
        notes: body.notes ?? null,
        updatedAt: new Date(),
      },
    })
    .returning();

  return c.json(entry);
});

// DELETE /api/checklist-entries/:id
checklist.delete("/checklist-entries/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  await db
    .delete(dailyChecklistEntries)
    .where(
      and(
        eq(dailyChecklistEntries.id, id),
        eq(dailyChecklistEntries.userId, user.id)
      )
    );
  return c.json({ success: true });
});

// ── Custom Task Metrics ────────────────────────────────────

// GET /api/task-metrics?taskId=xxx
checklist.get("/task-metrics", async (c) => {
  const user = c.get("user");
  const taskId = c.req.query("taskId") ?? "";
  const metrics = await db
    .select()
    .from(customTaskMetrics)
    .where(
      and(
        eq(customTaskMetrics.userId, user.id),
        taskId ? eq(customTaskMetrics.taskId, taskId) : undefined
      )
    )
    .orderBy(customTaskMetrics.orderIndex);
  return c.json(metrics);
});

// POST /api/task-metrics
checklist.post("/task-metrics", async (c) => {
  const user = c.get("user");
  const body = await c.req.json<{
    taskId: string;
    label: string;
    fieldType: string;
    unit?: string;
    orderIndex?: number;
  }>();
  const [metric] = await db
    .insert(customTaskMetrics)
    .values({ ...body, userId: user.id })
    .returning();
  return c.json(metric, 201);
});

// PATCH /api/task-metrics/:id
checklist.patch("/task-metrics/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = await c.req.json();
  const [updated] = await db
    .update(customTaskMetrics)
    .set({ ...body, updatedAt: new Date() })
    .where(
      and(eq(customTaskMetrics.id, id), eq(customTaskMetrics.userId, user.id))
    )
    .returning();
  if (!updated) return c.json({ error: "Not found" }, 404);
  return c.json(updated);
});

// DELETE /api/task-metrics/:id
checklist.delete("/task-metrics/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  await db
    .delete(customTaskMetrics)
    .where(
      and(eq(customTaskMetrics.id, id), eq(customTaskMetrics.userId, user.id))
    );
  return c.json({ success: true });
});

export default checklist;
