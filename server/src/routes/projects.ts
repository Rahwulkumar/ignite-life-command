import { Hono } from "hono";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { projects, projectTasks } from "../db/schema.js";

const STATIC_USER_ID = "local-user";

const projectsRoute = new Hono();

function calculateProgress(
  tasks: Array<{ status: string }>
): number {
  if (tasks.length === 0) return 0;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  return Math.round((completedTasks / tasks.length) * 100);
}

async function touchProject(projectId: string, userId: string) {
  await db
    .update(projects)
    .set({ updatedAt: new Date() })
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));
}

// GET /api/projects
projectsRoute.get("/projects", async (c) => {
  const [projectRows, taskRows] = await Promise.all([
    db
      .select()
      .from(projects)
      .where(eq(projects.userId, STATIC_USER_ID))
      .orderBy(desc(projects.updatedAt), desc(projects.createdAt)),
    db
      .select()
      .from(projectTasks)
      .where(eq(projectTasks.userId, STATIC_USER_ID))
      .orderBy(asc(projectTasks.orderIndex), asc(projectTasks.createdAt)),
  ]);

  const tasksByProject = new Map<string, typeof taskRows>();
  for (const task of taskRows) {
    const existing = tasksByProject.get(task.projectId) ?? [];
    existing.push(task);
    tasksByProject.set(task.projectId, existing);
  }

  const result = projectRows.map((project) => {
    const tasks = tasksByProject.get(project.id) ?? [];

    return {
      ...project,
      tasks,
      progress: calculateProgress(tasks),
    };
  });

  return c.json(result);
});

// POST /api/projects
projectsRoute.post("/projects", async (c) => {
  const body = await c.req.json<{
    name: string;
    description?: string;
    targetDate?: string;
  }>();

  const name = body.name?.trim();
  if (!name) {
    return c.json({ error: "Project name is required" }, 400);
  }

  const [project] = await db
    .insert(projects)
    .values({
      userId: STATIC_USER_ID,
      name,
      description: body.description?.trim() || null,
      targetDate: body.targetDate ?? null,
    })
    .returning();

  return c.json(project, 201);
});

// PATCH /api/projects/:id
projectsRoute.patch("/projects/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<{
    name?: string;
    description?: string | null;
    targetDate?: string | null;
  }>();

  const patch: Record<string, unknown> = { updatedAt: new Date() };
  if (body.name !== undefined) {
    const name = body.name.trim();
    if (!name) return c.json({ error: "Project name is required" }, 400);
    patch.name = name;
  }
  if (body.description !== undefined) {
    patch.description = body.description?.trim() || null;
  }
  if (body.targetDate !== undefined) {
    patch.targetDate = body.targetDate;
  }

  const [updated] = await db
    .update(projects)
    .set(patch)
    .where(and(eq(projects.id, id), eq(projects.userId, STATIC_USER_ID)))
    .returning();

  if (!updated) return c.json({ error: "Not found" }, 404);
  return c.json(updated);
});

// DELETE /api/projects/:id
projectsRoute.delete("/projects/:id", async (c) => {
  const id = c.req.param("id");

  await db
    .delete(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, STATIC_USER_ID)));

  return c.json({ success: true });
});

// POST /api/projects/:id/tasks
projectsRoute.post("/projects/:id/tasks", async (c) => {
  const projectId = c.req.param("id");
  const body = await c.req.json<{
    title: string;
    dueDate?: string;
    priority?: string;
    status?: string;
    orderIndex?: number;
  }>();

  const title = body.title?.trim();
  if (!title) {
    return c.json({ error: "Task title is required" }, 400);
  }

  const [project] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, STATIC_USER_ID)));

  if (!project) return c.json({ error: "Project not found" }, 404);

  const [task] = await db
    .insert(projectTasks)
    .values({
      userId: STATIC_USER_ID,
      projectId,
      title,
      dueDate: body.dueDate ?? null,
      priority: body.priority ?? "medium",
      status: body.status ?? "todo",
      orderIndex: body.orderIndex ?? 0,
    })
    .returning();

  await touchProject(projectId, STATIC_USER_ID);

  return c.json(task, 201);
});

// PATCH /api/project-tasks/:id
projectsRoute.patch("/project-tasks/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<{
    title?: string;
    status?: string;
    dueDate?: string | null;
    priority?: string;
    orderIndex?: number;
  }>();

  const patch: Record<string, unknown> = { updatedAt: new Date() };
  if (body.title !== undefined) {
    const title = body.title.trim();
    if (!title) return c.json({ error: "Task title is required" }, 400);
    patch.title = title;
  }
  if (body.status !== undefined) patch.status = body.status;
  if (body.dueDate !== undefined) patch.dueDate = body.dueDate;
  if (body.priority !== undefined) patch.priority = body.priority;
  if (body.orderIndex !== undefined) patch.orderIndex = body.orderIndex;

  const [updated] = await db
    .update(projectTasks)
    .set(patch)
    .where(and(eq(projectTasks.id, id), eq(projectTasks.userId, STATIC_USER_ID)))
    .returning();

  if (!updated) return c.json({ error: "Not found" }, 404);

  await touchProject(updated.projectId, STATIC_USER_ID);

  return c.json(updated);
});

// DELETE /api/project-tasks/:id
projectsRoute.delete("/project-tasks/:id", async (c) => {
  const id = c.req.param("id");

  const [deleted] = await db
    .delete(projectTasks)
    .where(and(eq(projectTasks.id, id), eq(projectTasks.userId, STATIC_USER_ID)))
    .returning({ projectId: projectTasks.projectId });

  if (!deleted) return c.json({ error: "Not found" }, 404);

  await touchProject(deleted.projectId, STATIC_USER_ID);

  return c.json({ success: true });
});

export default projectsRoute;
