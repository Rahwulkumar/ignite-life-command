import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema.js";

function getDatabaseUrl(): string {
  const value = process.env.DATABASE_URL?.trim();
  if (!value) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }

  try {
    const url = new URL(value);

    // Neon pooled WebSocket connections are more reliable here without forcing
    // channel binding in the connection string.
    url.searchParams.delete("channel_binding");

    return url.toString();
  } catch {
    return value;
  }
}

function configureNeon(): void {
  const webSocketConstructor = (globalThis as typeof globalThis & { WebSocket?: unknown }).WebSocket;

  if (!webSocketConstructor) {
    throw new Error(
      "Neon pooled connections require WebSocket support. Use Node.js 22+ or install a WebSocket implementation.",
    );
  }

  // Use pooled WebSocket connections in Node instead of one-shot HTTP fetches.
  neonConfig.webSocketConstructor = webSocketConstructor;
  neonConfig.poolQueryViaFetch = false;
  neonConfig.pipelineConnect = false;
}

configureNeon();

const pool = new Pool({
  connectionString: getDatabaseUrl(),
  max: 10,
});

pool.on("error", (error) => {
  console.error("Neon pool error:", error);
});

export const db = drizzle({ client: pool, schema });

export async function checkDatabaseConnection(): Promise<void> {
  await pool.query("select 1");
}

export async function closeDatabase(): Promise<void> {
  await pool.end();
}
