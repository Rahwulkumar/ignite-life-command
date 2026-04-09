import type { Context } from "hono";

export function getUserId(c: Context): string {
  return c.get("user").id;
}
