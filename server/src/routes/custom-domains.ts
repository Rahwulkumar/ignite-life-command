import { Hono } from "hono";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  customDomainFields,
  customDomains,
  customDomainRecords,
  customDomainViews,
} from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import { getUserId } from "../utils/user-context.js";

const customDomainsRoute = new Hono();

customDomainsRoute.use("*", requireAuth);

type DomainTemplateKey = "tracker" | "library" | "journal" | "pipeline";
type DomainFieldType =
  | "text"
  | "textarea"
  | "select"
  | "status"
  | "date"
  | "url"
  | "number";

const APPROVED_COLORS = new Set([
  "finance",
  "trading",
  "tech",
  "spiritual",
  "music",
  "content",
  "work",
]);

const APPROVED_ICONS = new Set([
  "Layers3",
  "Boxes",
  "KanbanSquare",
  "NotebookTabs",
  "FolderOpen",
  "Target",
  "BookMarked",
  "Sparkles",
  "ClipboardList",
]);

const APPROVED_FIELD_TYPES = new Set<DomainFieldType>([
  "text",
  "textarea",
  "select",
  "status",
  "date",
  "url",
  "number",
]);

const TEMPLATE_DEFINITIONS: Record<
  DomainTemplateKey,
  {
    subtitle: string;
    fields: Array<{
      key: string;
      label: string;
      fieldType: DomainFieldType;
      isRequired?: boolean;
      config?: Record<string, unknown>;
    }>;
    defaultLayout: Record<string, unknown>;
  }
> = {
  tracker: {
    subtitle: "Track work, progress, and next actions in one place",
    fields: [
      {
        key: "status",
        label: "Status",
        fieldType: "status",
        isRequired: true,
        config: { options: ["planned", "active", "blocked", "done"] },
      },
      {
        key: "priority",
        label: "Priority",
        fieldType: "select",
        config: { options: ["low", "medium", "high"] },
      },
      { key: "dueDate", label: "Due Date", fieldType: "date" },
      { key: "notes", label: "Notes", fieldType: "textarea" },
    ],
    defaultLayout: { cards: ["records", "structure"] },
  },
  library: {
    subtitle: "Collect resources, references, and links in a clean library",
    fields: [
      { key: "source", label: "Source", fieldType: "text", isRequired: true },
      { key: "url", label: "URL", fieldType: "url" },
      {
        key: "status",
        label: "Status",
        fieldType: "select",
        config: { options: ["saved", "reading", "complete"] },
      },
      { key: "notes", label: "Notes", fieldType: "textarea" },
    ],
    defaultLayout: { cards: ["records", "stats", "structure"] },
  },
  journal: {
    subtitle: "Capture dated reflections, wins, and learnings",
    fields: [
      {
        key: "entryDate",
        label: "Entry Date",
        fieldType: "date",
        isRequired: true,
      },
      {
        key: "mood",
        label: "Mood",
        fieldType: "select",
        config: { options: ["calm", "focused", "stretched", "celebratory"] },
      },
      {
        key: "summary",
        label: "Summary",
        fieldType: "textarea",
        isRequired: true,
      },
      { key: "tags", label: "Tags", fieldType: "text" },
    ],
    defaultLayout: { cards: ["records", "structure"] },
  },
  pipeline: {
    subtitle: "Move work through stages with a clear operating pipeline",
    fields: [
      {
        key: "stage",
        label: "Stage",
        fieldType: "status",
        isRequired: true,
        config: { options: ["backlog", "next", "in-progress", "review", "done"] },
      },
      { key: "owner", label: "Owner", fieldType: "text" },
      { key: "nextStep", label: "Next Step", fieldType: "textarea" },
      { key: "targetDate", label: "Target Date", fieldType: "date" },
    ],
    defaultLayout: { cards: ["records", "stats", "structure"] },
  },
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function getFieldOptions(config: Record<string, unknown> | null | undefined) {
  const options = config?.options;
  return Array.isArray(options)
    ? options.filter((value): value is string => typeof value === "string")
    : [];
}

function normalizeSelectableOptions(
  fieldType: DomainFieldType,
  options: unknown,
): string[] {
  if (fieldType !== "select" && fieldType !== "status") {
    return [];
  }

  const sanitized = Array.isArray(options)
    ? options
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean)
    : [];

  if (sanitized.length > 0) {
    return sanitized;
  }

  return fieldType === "status"
    ? ["planned", "active", "blocked", "done"]
    : ["option-1", "option-2"];
}

function isEmptyFieldValue(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

async function getOwnedDomain(userId: string, slug: string) {
  const [domain] = await db
    .select()
    .from(customDomains)
    .where(and(eq(customDomains.userId, userId), eq(customDomains.slug, slug)))
    .limit(1);

  return domain ?? null;
}

async function generateUniqueSlug(userId: string, name: string) {
  const base = slugify(name) || "custom-domain";
  let candidate = base;
  let suffix = 2;

  while (true) {
    const [existing] = await db
      .select({ id: customDomains.id })
      .from(customDomains)
      .where(and(eq(customDomains.userId, userId), eq(customDomains.slug, candidate)))
      .limit(1);

    if (!existing) {
      return candidate;
    }

    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

async function generateUniqueFieldKey(domainId: string, value: string) {
  const base = slugify(value) || "field";
  let candidate = base;
  let suffix = 2;

  while (true) {
    const [existing] = await db
      .select({ id: customDomainFields.id })
      .from(customDomainFields)
      .where(
        and(
          eq(customDomainFields.domainId, domainId),
          eq(customDomainFields.key, candidate),
        ),
      )
      .limit(1);

    if (!existing) {
      return candidate;
    }

    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

customDomainsRoute.get("/custom-domains", async (c) => {
  const userId = getUserId(c);
  const domains = await db
    .select()
    .from(customDomains)
    .where(eq(customDomains.userId, userId))
    .orderBy(asc(customDomains.createdAt));

  const domainsWithCounts = await Promise.all(
    domains.map(async (domain) => {
      const [fields, records] = await Promise.all([
        db
          .select({ id: customDomainFields.id })
          .from(customDomainFields)
          .where(eq(customDomainFields.domainId, domain.id)),
        db
          .select({ id: customDomainRecords.id })
          .from(customDomainRecords)
          .where(eq(customDomainRecords.domainId, domain.id)),
      ]);

      return {
        ...domain,
        fieldCount: fields.length,
        recordCount: records.length,
      };
    }),
  );

  return c.json(domainsWithCounts);
});

customDomainsRoute.post("/custom-domains", async (c) => {
  const userId = getUserId(c);
  const body = await c.req.json<{
    name: string;
    subtitle?: string;
    iconKey?: string;
    color?: string;
    template?: DomainTemplateKey;
  }>();

  const name = body.name?.trim();
  if (!name) {
    return c.json({ error: "Domain name is required" }, 400);
  }

  const template = TEMPLATE_DEFINITIONS[body.template ?? "tracker"]
    ? (body.template ?? "tracker")
    : "tracker";
  const templateDefinition = TEMPLATE_DEFINITIONS[template];
  const slug = await generateUniqueSlug(userId, name);
  const color = APPROVED_COLORS.has(body.color ?? "")
    ? (body.color as string)
    : "content";
  const iconKey = APPROVED_ICONS.has(body.iconKey ?? "")
    ? (body.iconKey as string)
    : "Layers3";

  const [domain] = await db
    .insert(customDomains)
    .values({
      userId,
      name,
      slug,
      subtitle: body.subtitle?.trim() || templateDefinition.subtitle,
      iconKey,
      color,
      template,
    })
    .returning();

  await db.insert(customDomainFields).values(
    templateDefinition.fields.map((field, index) => ({
      domainId: domain.id,
      key: field.key,
      label: field.label,
      fieldType: field.fieldType,
      isRequired: field.isRequired ?? false,
      config: field.config ?? {},
      orderIndex: index,
    })),
  );

  await db.insert(customDomainViews).values({
    domainId: domain.id,
    viewKey: "overview",
    name: "Overview",
    layout: templateDefinition.defaultLayout,
    orderIndex: 0,
  });

  return c.json(domain, 201);
});

customDomainsRoute.get("/custom-domains/:slug", async (c) => {
  const userId = getUserId(c);
  const slug = c.req.param("slug");
  const domain = await getOwnedDomain(userId, slug);

  if (!domain) {
    return c.json({ error: "Custom domain not found" }, 404);
  }

  const [fields, records, views] = await Promise.all([
    db
      .select()
      .from(customDomainFields)
      .where(eq(customDomainFields.domainId, domain.id))
      .orderBy(asc(customDomainFields.orderIndex)),
    db
      .select()
      .from(customDomainRecords)
      .where(eq(customDomainRecords.domainId, domain.id))
      .orderBy(desc(customDomainRecords.updatedAt)),
    db
      .select()
      .from(customDomainViews)
      .where(eq(customDomainViews.domainId, domain.id))
      .orderBy(asc(customDomainViews.orderIndex)),
  ]);

  return c.json({ domain, fields, records, views });
});

customDomainsRoute.post("/custom-domains/:slug/fields", async (c) => {
  const userId = getUserId(c);
  const slug = c.req.param("slug");
  const domain = await getOwnedDomain(userId, slug);

  if (!domain) {
    return c.json({ error: "Custom domain not found" }, 404);
  }

  const body = await c.req.json<{
    label: string;
    key?: string;
    fieldType?: DomainFieldType;
    isRequired?: boolean;
    options?: string[];
  }>();

  const label = body.label?.trim();
  if (!label) {
    return c.json({ error: "Field label is required" }, 400);
  }

  const fieldType = APPROVED_FIELD_TYPES.has(body.fieldType ?? "text")
    ? (body.fieldType ?? "text")
    : null;

  if (!fieldType) {
    return c.json({ error: "Unsupported field type" }, 400);
  }

  const existingFields = await db
    .select({ orderIndex: customDomainFields.orderIndex })
    .from(customDomainFields)
    .where(eq(customDomainFields.domainId, domain.id));

  const key = await generateUniqueFieldKey(
    domain.id,
    body.key?.trim() || label,
  );
  const nextOrderIndex =
    existingFields.reduce(
      (maxValue, field) => Math.max(maxValue, field.orderIndex),
      -1,
    ) + 1;

  const selectableOptions = normalizeSelectableOptions(fieldType, body.options);

  const [field] = await db
    .insert(customDomainFields)
    .values({
      domainId: domain.id,
      key,
      label,
      fieldType,
      isRequired: body.isRequired ?? false,
      config:
        fieldType === "select" || fieldType === "status"
          ? { options: selectableOptions }
          : {},
      orderIndex: nextOrderIndex,
    })
    .returning();

  return c.json(field, 201);
});

customDomainsRoute.delete("/custom-domains/:slug/fields/:fieldId", async (c) => {
  const userId = getUserId(c);
  const slug = c.req.param("slug");
  const fieldId = c.req.param("fieldId");
  const domain = await getOwnedDomain(userId, slug);

  if (!domain) {
    return c.json({ error: "Custom domain not found" }, 404);
  }

  const [field] = await db
    .select()
    .from(customDomainFields)
    .where(
      and(
        eq(customDomainFields.id, fieldId),
        eq(customDomainFields.domainId, domain.id),
      ),
    )
    .limit(1);

  if (!field) {
    return c.json({ error: "Field not found" }, 404);
  }

  await db.delete(customDomainFields).where(eq(customDomainFields.id, field.id));

  const remainingFields = await db
    .select({ id: customDomainFields.id })
    .from(customDomainFields)
    .where(eq(customDomainFields.domainId, domain.id))
    .orderBy(asc(customDomainFields.orderIndex));

  await Promise.all(
    remainingFields.map((remainingField, index) =>
      db
        .update(customDomainFields)
        .set({ orderIndex: index, updatedAt: new Date() })
        .where(eq(customDomainFields.id, remainingField.id)),
    ),
  );

  return c.json({ success: true });
});

customDomainsRoute.post("/custom-domains/:slug/records", async (c) => {
  const userId = getUserId(c);
  const slug = c.req.param("slug");
  const body = await c.req.json<{
    title: string;
    values?: Record<string, unknown>;
  }>();

  const title = body.title?.trim();
  if (!title) {
    return c.json({ error: "Record title is required" }, 400);
  }

  const domain = await getOwnedDomain(userId, slug);
  if (!domain) {
    return c.json({ error: "Custom domain not found" }, 404);
  }

  const fields = await db
    .select()
    .from(customDomainFields)
    .where(eq(customDomainFields.domainId, domain.id))
    .orderBy(asc(customDomainFields.orderIndex));

  const normalizedValues: Record<string, unknown> = {};

  for (const field of fields) {
    const rawValue = body.values?.[field.key];

    if (isEmptyFieldValue(rawValue)) {
      continue;
    }

    if (field.fieldType === "number") {
      const parsed =
        typeof rawValue === "number"
          ? rawValue
          : typeof rawValue === "string"
            ? Number(rawValue)
            : Number.NaN;

      if (Number.isNaN(parsed)) {
        return c.json({ error: `Invalid number for ${field.label}` }, 400);
      }

      normalizedValues[field.key] = parsed;
      continue;
    }

    if (field.fieldType === "select" || field.fieldType === "status") {
      if (typeof rawValue !== "string") {
        return c.json({ error: `Invalid value for ${field.label}` }, 400);
      }

      const value = rawValue.trim();
      const options = getFieldOptions(
        field.config as Record<string, unknown> | undefined,
      );

      if (options.length > 0 && !options.includes(value)) {
        return c.json({ error: `Invalid option for ${field.label}` }, 400);
      }

      normalizedValues[field.key] = value;
      continue;
    }

    normalizedValues[field.key] =
      typeof rawValue === "string" ? rawValue.trim() : rawValue;
  }

  const missingRequiredFields = fields
    .filter((field) => field.isRequired)
    .filter((field) => isEmptyFieldValue(normalizedValues[field.key]));

  if (missingRequiredFields.length > 0) {
    return c.json(
      {
        error: `Missing required fields: ${missingRequiredFields
          .map((field) => field.label)
          .join(", ")}`,
      },
      400,
    );
  }

  const [record] = await db
    .insert(customDomainRecords)
    .values({
      domainId: domain.id,
      userId,
      title,
      values: normalizedValues,
    })
    .returning();

  return c.json(record, 201);
});

export default customDomainsRoute;
