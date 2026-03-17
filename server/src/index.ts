import "dotenv/config"; // must be first — loads .env before any other import
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./auth.js";
import { checkDatabaseConnection } from "./db/index.js";
import bible from "./routes/bible.js";
import checklist from "./routes/checklist.js";
import notes from "./routes/notes.js";
import spiritual from "./routes/spiritual.js";
import scripture from "./routes/scripture.js";
import ai from "./routes/ai.js";
import goals from "./routes/goals.js";
import projects from "./routes/projects.js";

const app = new Hono();

// ── Global Middleware ─────────────────────────────────────────

app.use("*", logger());

app.use(
  "*",
  cors({
    origin: (origin) => {
      // Allow any localhost origin in dev (covers ports 5173, 8080, etc.)
      if (!origin || origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")) {
        return origin ?? "*";
      }
      // In production, only allow the configured FRONTEND_URL
      const allowed = process.env.FRONTEND_URL ?? "http://localhost:8080";
      return origin === allowed ? origin : null;
    },
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ── Health Check ──────────────────────────────────────────────

app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

app.get("/health/db", async (c) => {
  try {
    await checkDatabaseConnection();
    return c.json({ status: "ok", database: "reachable", timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Database health check failed:", error);
    const message = error instanceof Error ? error.message : "Database unavailable";
    return c.json({ status: "error", database: "unreachable", error: message }, 500);
  }
});

// ── Auth Routes (Better Auth handles /api/auth/**) ────────────

app.on(["GET", "POST"], "/api/auth/**", (c) => auth.handler(c.req.raw));

// ── Feature Routes ────────────────────────────────────────────

app.route("/api", bible);
app.route("/api", checklist);
app.route("/api", notes);
app.route("/api", spiritual);
app.route("/api", scripture);
app.route("/api", ai);
app.route("/api", goals);
app.route("/api", projects);

// ── Start Server ──────────────────────────────────────────────

const PORT = Number(process.env.PORT ?? 3001);

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`\n🚀 API server running at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health\n`);
});

export default app;
