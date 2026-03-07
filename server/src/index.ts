import "dotenv/config"; // must be first — loads .env before any other import
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./auth";
import bible from "./routes/bible";
import checklist from "./routes/checklist";
import notes from "./routes/notes";
import spiritual from "./routes/spiritual";
import scripture from "./routes/scripture";
import ai from "./routes/ai";
import goals from "./routes/goals";

const app = new Hono();

// ── Global Middleware ─────────────────────────────────────────

app.use("*", logger());

app.use(
  "*",
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ── Health Check ──────────────────────────────────────────────

app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

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

// ── Start Server ──────────────────────────────────────────────

const PORT = Number(process.env.PORT ?? 3001);

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`\n🚀 API server running at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health\n`);
});

export default app;
