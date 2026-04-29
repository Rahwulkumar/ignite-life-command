import { Hono } from "hono";
import { requireAuth } from "../middleware/auth.js";
import {
  getDailyCheckinStateForUser,
  submitDailyCheckinResponse,
} from "../services/daily-checkin.js";
import { getUserId } from "../utils/user-context.js";

const dailyCheckin = new Hono();

dailyCheckin.use("*", requireAuth);

dailyCheckin.get("/daily-checkin/today", async (c) => {
  const userId = getUserId(c);
  const state = await getDailyCheckinStateForUser(userId);
  return c.json(state);
});

dailyCheckin.post("/daily-checkin/respond", async (c) => {
  const userId = getUserId(c);
  const body = await c.req.json<{ text?: string }>();
  const text = body.text?.trim();

  if (!text) {
    return c.json({ error: "Response text is required." }, 400);
  }

  const result = await submitDailyCheckinResponse(userId, text);
  return c.json(result);
});

export default dailyCheckin;
