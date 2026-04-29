import { and, eq, sql } from "drizzle-orm";
import type { NeonTransaction } from "drizzle-orm/neon-serverless";
import { db } from "../db/index.js";
import { officeNotes } from "../db/schema.js";

type DbExecutor = typeof db | NeonTransaction<any, any>;

interface JournalBlockInput {
  userId: string;
  domain: string;
  entryDate: string;
  source: "telegram" | "app";
  header: string;
  body?: string | null;
}

interface TiptapTextNode {
  type: "text";
  text: string;
}

interface TiptapNode {
  type: string;
  content?: TiptapTextNode[];
}

interface TiptapDoc {
  type: "doc";
  content: TiptapNode[];
}

function domainLabel(domain: string): string {
  if (!domain) {
    return "General";
  }

  return domain.charAt(0).toUpperCase() + domain.slice(1);
}

function buildDailyJournalTitle(domain: string, entryDate: string): string {
  return `Daily ${domainLabel(domain)} Log - ${entryDate}`;
}

function paragraph(text: string): TiptapNode {
  return {
    type: "paragraph",
    content: [{ type: "text", text }],
  };
}

function emptyDoc(): TiptapDoc {
  return {
    type: "doc",
    content: [],
  };
}

function normalizeDoc(content: unknown): TiptapDoc {
  if (!content || typeof content !== "object") {
    return emptyDoc();
  }

  const candidate = content as Partial<TiptapDoc>;
  if (candidate.type !== "doc" || !Array.isArray(candidate.content)) {
    return emptyDoc();
  }

  return {
    type: "doc",
    content: candidate.content.filter(
      (node): node is TiptapNode =>
        Boolean(node) && typeof node === "object" && typeof node.type === "string",
    ),
  };
}

async function lockDailyJournal(
  executor: DbExecutor,
  userId: string,
  domain: string,
  entryDate: string,
) {
  const lockKey = `${userId}:${domain}:${entryDate}`;
  await executor.execute(
    sql`select pg_advisory_xact_lock(hashtextextended(${lockKey}, 0))`,
  );
}

async function getOrCreateDailyJournalNote(
  executor: DbExecutor,
  userId: string,
  domain: string,
  entryDate: string,
) {
  const title = buildDailyJournalTitle(domain, entryDate);
  const [existing] = await executor
    .select({
      id: officeNotes.id,
      content: officeNotes.content,
    })
    .from(officeNotes)
    .where(
      and(
        eq(officeNotes.userId, userId),
        eq(officeNotes.domain, domain),
        eq(officeNotes.noteType, "journal"),
        eq(officeNotes.title, title),
      ),
    )
    .limit(1);

  if (existing) {
    return existing;
  }

  const [created] = await executor
    .insert(officeNotes)
    .values({
      userId,
      title,
      content: emptyDoc(),
      domain,
      noteType: "journal",
    })
    .returning({
      id: officeNotes.id,
      content: officeNotes.content,
    });

  return created;
}

export async function appendToDailyJournal(
  executor: DbExecutor,
  input: JournalBlockInput,
): Promise<string> {
  await lockDailyJournal(executor, input.userId, input.domain, input.entryDate);

  const note = await getOrCreateDailyJournalNote(
    executor,
    input.userId,
    input.domain,
    input.entryDate,
  );

  const currentDoc = normalizeDoc(note.content);
  const nextContent = [...currentDoc.content, paragraph(input.header)];

  if (input.body && input.body.trim()) {
    nextContent.push(paragraph(input.body.trim()));
  }

  const [updated] = await executor
    .update(officeNotes)
    .set({
      content: {
        type: "doc",
        content: nextContent,
      },
      updatedAt: new Date(),
    })
    .where(eq(officeNotes.id, note.id))
    .returning({ id: officeNotes.id });

  return updated.id;
}

export async function createStandaloneJournalNote(
  executor: DbExecutor,
  input: {
    userId: string;
    domain: string;
    title: string;
    body: string;
  },
): Promise<string> {
  const [note] = await executor
    .insert(officeNotes)
    .values({
      userId: input.userId,
      title: input.title,
      domain: input.domain,
      noteType: "journal",
      content: {
        type: "doc",
        content: [paragraph(input.body.trim())],
      },
    })
    .returning({ id: officeNotes.id });

  return note.id;
}
