import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  date,
  jsonb,
  numeric,
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

export const viewConfigs = pgTable(
  "view_configs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    viewKey: text("view_key").notNull(),
    schemaVersion: integer("schema_version").notNull().default(1),
    layout: jsonb("layout").notNull().default({}),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.userId, t.viewKey)],
);

export const financeTransactions = pgTable("finance_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  amount: integer("amount").notNull(),
  category: text("category").notNull(),
  dateLabel: text("date_label").notNull().default("Today"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const financeBudgets = pgTable("finance_budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  allocated: integer("allocated").notNull(),
  spent: integer("spent").notNull().default(0),
  color: text("color").notNull().default("bg-finance"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const financeInvestments = pgTable("finance_investments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(),
  invested: integer("invested").notNull(),
  current: integer("current").notNull(),
  change: numeric("change", { precision: 6, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const musicPracticeSessions = pgTable("music_practice_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  focus: text("focus").notNull(),
  instrument: text("instrument").notNull(),
  duration: integer("duration").notNull(),
  dateLabel: text("date_label").notNull().default("Today"),
  notes: text("notes").notNull().default("Focused session"),
  rating: integer("rating").notNull().default(4),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const musicRepertoire = pgTable("music_repertoire", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  difficulty: text("difficulty").notNull(),
  status: text("status").notNull().default("queued"),
  progress: integer("progress").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contentFolders = pgTable("content_folders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  itemCount: integer("item_count").notNull().default(0),
  color: text("color").notNull().default("bg-tech"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contentItems = pgTable("content_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  folderId: uuid("folder_id").references(() => contentFolders.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  source: text("source").notNull(),
  type: text("type").notNull(),
  summary: text("summary"),
  dateLabel: text("date_label").notNull().default("Today"),
  url: text("url").notNull().default("#"),
  metadata: jsonb("metadata").notNull().default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tradingWatchlist = pgTable("trading_watchlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  change: numeric("change", { precision: 8, scale: 2 }).notNull().default("0"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tradingTrades = pgTable("trading_trades", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  symbol: text("symbol").notNull(),
  type: text("type").notNull(),
  quantity: numeric("quantity", { precision: 14, scale: 4 }).notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  dateLabel: text("date_label").notNull().default("Today"),
  notes: text("notes").notNull().default("Logged trade"),
  pnl: numeric("pnl", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tradingHoldings = pgTable("trading_holdings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  type: text("type").notNull(),
  units: numeric("units", { precision: 14, scale: 4 }).notNull(),
  avgCost: numeric("avg_cost", { precision: 14, scale: 2 }).notNull(),
  currentPrice: numeric("current_price", { precision: 14, scale: 2 }).notNull(),
  returns: numeric("returns", { precision: 14, scale: 2 }).notNull(),
  returnsPercent: numeric("returns_percent", { precision: 8, scale: 2 })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tradingPortfolioData = pgTable("trading_portfolio_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  dateLabel: text("date_label").notNull(),
  value: integer("value").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tradingBrokerConnections = pgTable(
  "trading_broker_connections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    status: text("status").notNull().default("connected"),
    providerUserId: text("provider_user_id"),
    providerAccountLabel: text("provider_account_label"),
    encryptedAccessToken: text("encrypted_access_token"),
    publicToken: text("public_token"),
    tokenExpiresAt: timestamp("token_expires_at"),
    lastSyncedAt: timestamp("last_synced_at"),
    lastError: text("last_error"),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.userId, t.provider)],
);

export const tradingBrokerHoldings = pgTable(
  "trading_broker_holdings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    connectionId: uuid("connection_id")
      .notNull()
      .references(() => tradingBrokerConnections.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    externalId: text("external_id").notNull(),
    name: text("name").notNull(),
    symbol: text("symbol").notNull(),
    type: text("type").notNull(),
    units: numeric("units", { precision: 16, scale: 4 }).notNull(),
    avgCost: numeric("avg_cost", { precision: 16, scale: 4 }).notNull(),
    currentPrice: numeric("current_price", { precision: 16, scale: 4 }).notNull(),
    returns: numeric("returns", { precision: 16, scale: 4 }).notNull(),
    returnsPercent: numeric("returns_percent", { precision: 10, scale: 4 }).notNull(),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.connectionId, t.externalId)],
);

export const tradingBrokerTrades = pgTable(
  "trading_broker_trades",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    connectionId: uuid("connection_id")
      .notNull()
      .references(() => tradingBrokerConnections.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    externalId: text("external_id").notNull(),
    symbol: text("symbol").notNull(),
    type: text("type").notNull(),
    quantity: numeric("quantity", { precision: 16, scale: 4 }).notNull(),
    price: numeric("price", { precision: 16, scale: 4 }).notNull(),
    dateLabel: text("date_label").notNull(),
    notes: text("notes").notNull().default("Synced trade"),
    pnl: numeric("pnl", { precision: 16, scale: 4 }),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.connectionId, t.externalId)],
);

export const tradingBrokerSnapshots = pgTable(
  "trading_broker_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    connectionId: uuid("connection_id")
      .notNull()
      .references(() => tradingBrokerConnections.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    snapshotDate: date("snapshot_date").notNull(),
    value: integer("value").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.connectionId, t.snapshotDate)],
);

export const googleIntegrationConnections = pgTable(
  "google_integration_connections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider").notNull().default("google"),
    status: text("status").notNull().default("connected"),
    email: text("email"),
    encryptedAccessToken: text("encrypted_access_token"),
    encryptedRefreshToken: text("encrypted_refresh_token"),
    tokenExpiresAt: timestamp("token_expires_at"),
    scope: text("scope"),
    lastHistoryId: text("last_history_id"),
    lastSyncedAt: timestamp("last_synced_at"),
    lastError: text("last_error"),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.userId, t.provider)],
);

export const investmentEmailMessages = pgTable(
  "investment_email_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    connectionId: uuid("connection_id").references(() => googleIntegrationConnections.id, {
      onDelete: "set null",
    }),
    provider: text("provider").notNull().default("gmail"),
    messageId: text("message_id").notNull(),
    threadId: text("thread_id"),
    fromAddress: text("from_address"),
    subject: text("subject"),
    snippet: text("snippet"),
    receivedAt: timestamp("received_at"),
    classification: text("classification").notNull().default("unknown"),
    status: text("status").notNull().default("received"),
    extracted: jsonb("extracted").notNull().default({}),
    error: text("error"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.userId, t.messageId)],
);

export const investmentEmailTransactions = pgTable(
  "investment_email_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    emailMessageId: uuid("email_message_id").references(() => investmentEmailMessages.id, {
      onDelete: "set null",
    }),
    source: text("source").notNull(),
    externalId: text("external_id").notNull(),
    schemeName: text("scheme_name").notNull(),
    isin: text("isin"),
    folio: text("folio"),
    transactionType: text("transaction_type").notNull(),
    amount: numeric("amount", { precision: 18, scale: 4 }),
    units: numeric("units", { precision: 20, scale: 6 }),
    nav: numeric("nav", { precision: 18, scale: 6 }),
    transactionDate: date("transaction_date"),
    confidence: numeric("confidence", { precision: 5, scale: 2 }).notNull().default("0"),
    raw: jsonb("raw").notNull().default({}),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.userId, t.externalId)],
);

export const mutualFundNavs = pgTable(
  "mutual_fund_navs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    schemeCode: text("scheme_code").notNull(),
    schemeName: text("scheme_name").notNull(),
    isinGrowth: text("isin_growth"),
    isinDividend: text("isin_dividend"),
    nav: numeric("nav", { precision: 18, scale: 6 }).notNull(),
    navDate: date("nav_date"),
    source: text("source").notNull().default("amfi"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.schemeCode)],
);

export const techSkillDomains = pgTable(
  "tech_skill_domains",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    clientId: text("client_id").notNull(),
    name: text("name").notNull(),
    iconKey: text("icon_key").notNull(),
    color: text("color").notNull().default("tech"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.userId, t.clientId)],
);

export const techSkills = pgTable(
  "tech_skills",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    clientId: text("client_id").notNull(),
    domainClientId: text("domain_client_id").notNull(),
    name: text("name").notNull(),
    proficiency: text("proficiency").notNull(),
    notes: text("notes"),
    lastUpdated: text("last_updated").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.userId, t.clientId)],
);

export const techCertifications = pgTable(
  "tech_certifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    clientId: text("client_id").notNull(),
    name: text("name").notNull(),
    provider: text("provider").notNull(),
    status: text("status").notNull(),
    targetDate: text("target_date"),
    earnedDate: text("earned_date"),
    expiryDate: text("expiry_date"),
    credentialId: text("credential_id"),
    credentialUrl: text("credential_url"),
    progress: integer("progress"),
    studyNotes: text("study_notes"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.userId, t.clientId)],
);

export const techResearchEntries = pgTable(
  "tech_research_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    clientId: text("client_id").notNull(),
    title: text("title").notNull(),
    domain: text("domain").notNull(),
    entryDate: text("entry_date").notNull(),
    insights: text("insights").notNull(),
    tags: text("tags").array(),
    links: jsonb("links").notNull().default([]),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.userId, t.clientId)],
);

export const techResources = pgTable(
  "tech_resources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    clientId: text("client_id").notNull(),
    title: text("title").notNull(),
    type: text("type").notNull(),
    source: text("source").notNull(),
    url: text("url").notNull(),
    category: text("category").notNull(),
    pinned: boolean("pinned").notNull().default(false),
    rating: integer("rating"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.userId, t.clientId)],
);

export const customDomains = pgTable(
  "custom_domains",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    subtitle: text("subtitle")
      .notNull()
      .default("A custom workspace built inside LifeOs"),
    iconKey: text("icon_key").notNull().default("Layers3"),
    color: text("color").notNull().default("content"),
    template: text("template").notNull().default("tracker"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.userId, t.slug)],
);

export const telegramConnections = pgTable(
  "telegram_connections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    telegramChatId: text("telegram_chat_id"),
    telegramUserId: text("telegram_user_id"),
    telegramUsername: text("telegram_username"),
    status: text("status").notNull().default("pending"),
    linkCode: text("link_code"),
    linkCodeExpiresAt: timestamp("link_code_expires_at"),
    linkedAt: timestamp("linked_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    unique().on(t.userId),
    unique().on(t.telegramChatId),
    unique().on(t.linkCode),
  ],
);

export const telegramEvents = pgTable(
  "telegram_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    connectionId: uuid("connection_id").references(() => telegramConnections.id, {
      onDelete: "set null",
    }),
    telegramUpdateId: text("telegram_update_id").notNull(),
    telegramChatId: text("telegram_chat_id"),
    telegramUserId: text("telegram_user_id"),
    updateType: text("update_type").notNull(),
    payload: jsonb("payload").notNull().default({}),
    parsedIntent: jsonb("parsed_intent"),
    status: text("status").notNull().default("received"),
    error: text("error"),
    processedAt: timestamp("processed_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.telegramUpdateId)],
);

export const customDomainFields = pgTable(
  "custom_domain_fields",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    domainId: uuid("domain_id")
      .notNull()
      .references(() => customDomains.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    label: text("label").notNull(),
    fieldType: text("field_type").notNull(),
    isRequired: boolean("is_required").notNull().default(false),
    config: jsonb("config").notNull().default({}),
    orderIndex: integer("order_index").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.domainId, t.key)],
);

export const customDomainViews = pgTable(
  "custom_domain_views",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    domainId: uuid("domain_id")
      .notNull()
      .references(() => customDomains.id, { onDelete: "cascade" }),
    viewKey: text("view_key").notNull(),
    name: text("name").notNull(),
    layout: jsonb("layout").notNull().default({}),
    orderIndex: integer("order_index").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.domainId, t.viewKey)],
);

export const customDomainRecords = pgTable("custom_domain_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  domainId: uuid("domain_id")
    .notNull()
    .references(() => customDomains.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  values: jsonb("values").notNull().default({}),
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
    status: text("status").notNull().default("pending"),
    startedAt: timestamp("started_at"),
    endedAt: timestamp("ended_at"),
    durationSeconds: integer("duration_seconds"),
    notes: text("notes"),
    journalNoteId: uuid("journal_note_id").references(() => officeNotes.id, {
      onDelete: "set null",
    }),
    promptedAt: timestamp("prompted_at"),
    answeredAt: timestamp("answered_at"),
    responseSource: text("response_source"),
    metricsData: jsonb("metrics_data").default({}),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.userId, t.taskId, t.entryDate)]
);

export const dailyCheckinSessions = pgTable(
  "daily_checkin_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sessionDate: date("session_date").notNull(),
    timezone: text("timezone").notNull().default("Asia/Kolkata"),
    status: text("status").notNull().default("pending"),
    promptText: text("prompt_text").notNull(),
    pendingTaskIds: jsonb("pending_task_ids").notNull().default([]),
    channels: jsonb("channels").notNull().default(["app", "telegram"]),
    telegramSentAt: timestamp("telegram_sent_at"),
    appPromptedAt: timestamp("app_prompted_at"),
    answeredAt: timestamp("answered_at"),
    responseText: text("response_text"),
    responseSource: text("response_source"),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [unique().on(t.userId, t.sessionDate)]
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
