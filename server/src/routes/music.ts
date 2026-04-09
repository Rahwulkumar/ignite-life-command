import { Hono } from "hono";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  musicPracticeSessions,
  musicRepertoire,
} from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import { getUserId } from "../utils/user-context.js";

const musicRoute = new Hono();

musicRoute.use("*", requireAuth);

const seedSessions = [
  {
    focus: "Chord progressions",
    instrument: "Guitar",
    duration: 45,
    dateLabel: "Today",
    notes: "Working on I-IV-V-I transitions",
    rating: 4,
  },
  {
    focus: "Scales practice",
    instrument: "Guitar",
    duration: 30,
    dateLabel: "Yesterday",
    notes: "Pentatonic minor in all positions",
    rating: 3,
  },
  {
    focus: "Hotel California",
    instrument: "Guitar",
    duration: 60,
    dateLabel: "Dec 27",
    notes: "Intro solo almost down",
    rating: 5,
  },
  {
    focus: "Fingerpicking patterns",
    instrument: "Guitar",
    duration: 20,
    dateLabel: "Dec 26",
    notes: "Travis picking exercises",
    rating: 3,
  },
  {
    focus: "Music theory",
    instrument: "General",
    duration: 45,
    dateLabel: "Dec 25",
    notes: "Circle of fifths review",
    rating: 4,
  },
];

const seedRepertoire = [
  {
    title: "Wonderwall",
    artist: "Oasis",
    difficulty: "Beginner",
    status: "mastered",
    progress: 100,
  },
  {
    title: "Hotel California",
    artist: "Eagles",
    difficulty: "Intermediate",
    status: "learning",
    progress: 75,
  },
  {
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    difficulty: "Intermediate",
    status: "learning",
    progress: 40,
  },
  {
    title: "Blackbird",
    artist: "The Beatles",
    difficulty: "Intermediate",
    status: "queued",
    progress: 0,
  },
  {
    title: "Classical Gas",
    artist: "Mason Williams",
    difficulty: "Advanced",
    status: "queued",
    progress: 0,
  },
];

async function ensureMusicSeedData(userId: string) {
  const [existingSessions, existingRepertoire] = await Promise.all([
    db
      .select({ id: musicPracticeSessions.id })
      .from(musicPracticeSessions)
      .where(eq(musicPracticeSessions.userId, userId))
      .limit(1),
    db
      .select({ id: musicRepertoire.id })
      .from(musicRepertoire)
      .where(eq(musicRepertoire.userId, userId))
      .limit(1),
  ]);

  const writes: Promise<unknown>[] = [];

  if (existingSessions.length === 0) {
    writes.push(
      db.insert(musicPracticeSessions).values(
        seedSessions.map((session) => ({
          userId,
          ...session,
        })),
      ),
    );
  }

  if (existingRepertoire.length === 0) {
    writes.push(
      db.insert(musicRepertoire).values(
        seedRepertoire.map((song) => ({
          userId,
          ...song,
        })),
      ),
    );
  }

  if (writes.length > 0) {
    await Promise.all(writes);
  }
}

musicRoute.get("/music", async (c) => {
  const userId = getUserId(c);
  await ensureMusicSeedData(userId);

  const [sessions, repertoire] = await Promise.all([
    db
      .select()
      .from(musicPracticeSessions)
      .where(eq(musicPracticeSessions.userId, userId))
      .orderBy(desc(musicPracticeSessions.createdAt)),
    db
      .select()
      .from(musicRepertoire)
      .where(eq(musicRepertoire.userId, userId))
      .orderBy(asc(musicRepertoire.createdAt)),
  ]);

  return c.json({ sessions, repertoire });
});

musicRoute.post("/music/practice-sessions", async (c) => {
  const userId = getUserId(c);
  const body = await c.req.json<{
    focus: string;
    instrument: string;
    duration: number;
    dateLabel?: string;
    notes?: string;
    rating?: number;
  }>();

  const focus = body.focus?.trim();
  const instrument = body.instrument?.trim();

  if (!focus) {
    return c.json({ error: "Focus is required" }, 400);
  }

  if (!instrument) {
    return c.json({ error: "Instrument is required" }, 400);
  }

  if (!Number.isFinite(body.duration) || body.duration <= 0) {
    return c.json({ error: "Duration must be greater than zero" }, 400);
  }

  const rating = Math.max(1, Math.min(5, Math.round(body.rating ?? 4)));

  const [session] = await db
    .insert(musicPracticeSessions)
    .values({
      userId,
      focus,
      instrument,
      duration: Math.round(body.duration),
      dateLabel: body.dateLabel?.trim() || "Today",
      notes: body.notes?.trim() || "Focused session",
      rating,
    })
    .returning();

  return c.json(session, 201);
});

musicRoute.post("/music/repertoire", async (c) => {
  const userId = getUserId(c);
  const body = await c.req.json<{
    title: string;
    artist: string;
    difficulty: string;
    status: string;
    progress?: number;
  }>();

  const title = body.title?.trim();
  const artist = body.artist?.trim();
  const difficulty = body.difficulty?.trim();
  const status = body.status?.trim();

  if (!title) {
    return c.json({ error: "Title is required" }, 400);
  }

  if (!artist) {
    return c.json({ error: "Artist is required" }, 400);
  }

  if (!difficulty) {
    return c.json({ error: "Difficulty is required" }, 400);
  }

  if (!status) {
    return c.json({ error: "Status is required" }, 400);
  }

  const [song] = await db
    .insert(musicRepertoire)
    .values({
      userId,
      title,
      artist,
      difficulty,
      status,
      progress: Math.max(0, Math.min(100, Math.round(body.progress ?? 0))),
    })
    .returning();

  return c.json(song, 201);
});

export default musicRoute;
