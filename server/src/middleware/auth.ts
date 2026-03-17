import { createMiddleware } from "hono/factory";
import { auth } from "../auth.js";

// Augment Hono's context type to include user
declare module "hono" {
  interface ContextVariableMap {
    user: { id: string; email: string; name: string };
  }
}

export const requireAuth = createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session?.user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("user", session.user);
  await next();
});
