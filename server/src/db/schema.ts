import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  date,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";

// ============================================================
// Better Auth tables (required)
// ============================================================

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================
// App tables
// ============================================================

export const bibleReadingPlans = pgTable("bible_reading_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  totalChapters: integer("total_chapters").default(1189),
  completedChapters: integer("completed_chapters").default(0),
  currentBook: text("current_book").default("Genesis").notNull(),
  currentChapter: integer("current_chapter").default(1),
  currentVerse: integer("current_verse").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dailyFocus = pgTable(
  "daily_focus",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    reference: text("reference").notNull(),
    content: text("content").notNull(),
    completed: boolean("completed").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.userId, t.date)]
);

export const officeNotes = pgTable("office_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").default("Untitled").notNull(),
  content: jsonb("content").default({}),
  parentId: uuid("parent_id"), // self-referential FK added via raw migration
  icon: text("icon").default("📝"),
  coverImage: text("cover_image"),
  isPinned: boolean("is_pinned").default(false),
  isTemplate: boolean("is_template").default(false),
  domain: text("domain"), // spiritual | trading | tech | finance | music | projects | content | general
  noteType: text("note_type"), // hub | page | journal | folder | character
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  targetDate: date("target_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projectTasks = pgTable("project_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  status: text("status").notNull().default("todo"), // todo | in-progress | done
  dueDate: date("due_date"),
  priority: text("priority").notNull().default("medium"), // high | medium | low
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dailyChecklistEntries = pgTable(
  "daily_checklist_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    taskId: text("task_id").notNull(),
    entryDate: date("entry_date").notNull(),
    isCompleted: boolean("is_completed").default(false),
    durationSeconds: integer("duration_seconds"),
    notes: text("notes"),
    metricsData: jsonb("metrics_data").default({}),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.userId, t.taskId, t.entryDate)]
);

export const customTaskMetrics = pgTable(
  "custom_task_metrics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    taskId: text("task_id").notNull(),
    label: text("label").notNull(),
    fieldType: text("field_type").notNull(), // number | text | rating | boolean | duration
    unit: text("unit"),
    orderIndex: integer("order_index").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.userId, t.taskId, t.label)]
);

export const scriptureVerses = pgTable("scripture_verses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  reference: text("reference").notNull(),
  verseText: text("verse_text").notNull(),
  masteryLevel: integer("mastery_level").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const spiritualGoals = pgTable("spiritual_goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  targetDate: date("target_date"),
  progress: integer("progress").default(0),
  isCompleted: boolean("is_completed").default(false),
  category: text("category").default("general"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Legacy table kept only for historical migrations/backfill. Live journal
// entries are stored in office_notes with domain='spiritual' and noteType='journal'.
export const spiritualJournalEntries = pgTable("spiritual_journal_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: jsonb("content"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const spiritualWisdom = pgTable("spiritual_wisdom", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  reference: text("reference"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sermonNotes = pgTable("sermon_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  speaker: text("speaker"),
  date: date("date"),
  notes: text("notes"),
  keyTakeaways: text("key_takeaways").array(),
  scriptureReferences: text("scripture_references").array(),
  createdAt: timestamp("created_at").defaultNow(),
});
