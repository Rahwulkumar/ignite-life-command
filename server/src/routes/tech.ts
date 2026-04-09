import { Hono } from "hono";
import { asc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  techCertifications,
  techResearchEntries,
  techResources,
  techSkillDomains,
  techSkills,
} from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import { getUserId } from "../utils/user-context.js";

const techRoute = new Hono();

techRoute.use("*", requireAuth);

const seedDomains = [
  { clientId: "frontend", name: "Frontend", iconKey: "Code", color: "tech" },
  { clientId: "backend", name: "Backend", iconKey: "Server", color: "finance" },
  { clientId: "cloud", name: "Cloud & DevOps", iconKey: "Cloud", color: "trading" },
  { clientId: "ai", name: "AI & Machine Learning", iconKey: "Brain", color: "spiritual" },
  { clientId: "mobile", name: "Mobile Development", iconKey: "Smartphone", color: "music" },
  { clientId: "security", name: "Security", iconKey: "Shield", color: "content" },
];

const seedSkills = [
  { clientId: "1", domainClientId: "frontend", name: "React", proficiency: "advanced", lastUpdated: "2025-01-10" },
  { clientId: "2", domainClientId: "frontend", name: "TypeScript", proficiency: "advanced", lastUpdated: "2025-01-08" },
  { clientId: "3", domainClientId: "frontend", name: "Next.js", proficiency: "intermediate", lastUpdated: "2025-01-05" },
  { clientId: "4", domainClientId: "backend", name: "Node.js", proficiency: "intermediate", lastUpdated: "2025-01-07" },
  { clientId: "5", domainClientId: "backend", name: "Python", proficiency: "intermediate", lastUpdated: "2025-01-03" },
  { clientId: "6", domainClientId: "cloud", name: "AWS", proficiency: "beginner", lastUpdated: "2025-01-01" },
  { clientId: "7", domainClientId: "cloud", name: "Docker", proficiency: "intermediate", lastUpdated: "2024-12-28" },
  { clientId: "8", domainClientId: "ai", name: "LangChain", proficiency: "beginner", lastUpdated: "2025-01-09" },
];

const seedCertifications = [
  { clientId: "1", name: "Solutions Architect Associate", provider: "AWS", status: "preparing", targetDate: "2025-03-15", progress: 45 },
  { clientId: "2", name: "Professional Cloud Architect", provider: "Google", status: "preparing", targetDate: "2025-06-01", progress: 20 },
  { clientId: "3", name: "Developer Associate", provider: "AWS", status: "earned", earnedDate: "2024-08-20", credentialUrl: "https://aws.amazon.com/verification" },
  { clientId: "4", name: "React Developer Certificate", provider: "Meta", status: "earned", earnedDate: "2024-05-10" },
];

const seedResearchEntries = [
  {
    clientId: "1",
    title: "LLM Fine-tuning Techniques",
    domain: "AI/ML",
    entryDate: "2025-01-12",
    insights:
      "Explored LoRA and QLoRA for efficient fine-tuning of large language models. Key finding: QLoRA can reduce memory usage by 65% while maintaining similar performance.",
    tags: ["llm", "fine-tuning", "qlora"],
    links: [
      { title: "QLoRA Paper", url: "https://arxiv.org/abs/2305.14314" },
      { title: "HuggingFace Guide", url: "https://huggingface.co/docs" },
    ],
  },
  {
    clientId: "2",
    title: "Kubernetes Multi-tenancy Patterns",
    domain: "Cloud",
    entryDate: "2025-01-10",
    insights:
      "Researched different approaches for multi-tenant Kubernetes clusters. Namespace isolation with network policies provides good security for most use cases.",
    tags: ["kubernetes", "multi-tenancy", "security"],
    links: [],
  },
  {
    clientId: "3",
    title: "Zero-Knowledge Proofs in Identity",
    domain: "Blockchain",
    entryDate: "2025-01-05",
    insights:
      "Investigated zk-SNARKs and their application in privacy-preserving identity verification.",
    tags: ["zkp", "identity", "privacy"],
    links: [{ title: "zkSNARK Explainer", url: "https://example.com" }],
  },
];

const seedResources = [
  { clientId: "1", title: "Designing Data-Intensive Applications", type: "book", source: "O'Reilly", url: "#", category: "System Design", pinned: true, rating: 5 },
  { clientId: "2", title: "React 19 Deep Dive", type: "article", source: "React Blog", url: "#", category: "Frontend", pinned: true, rating: 4 },
  { clientId: "3", title: "Building LLM Apps with LangChain", type: "video", source: "YouTube", url: "#", category: "AI/ML", pinned: false, rating: 5 },
  { clientId: "4", title: "AWS Solutions Architect Course", type: "course", source: "Udemy", url: "#", category: "Cloud", pinned: false, rating: 4 },
  { clientId: "5", title: "Clean Code", type: "book", source: "Robert Martin", url: "#", category: "Backend", pinned: false, rating: 5 },
  { clientId: "6", title: "Docker for Beginners", type: "video", source: "freeCodeCamp", url: "#", category: "DevOps", pinned: false, rating: 3 },
  { clientId: "7", title: "Kubernetes Patterns", type: "book", source: "O'Reilly", url: "#", category: "DevOps", pinned: false, rating: 4 },
];

async function ensureTechSeedData(userId: string) {
  const [existingDomains, existingSkills, existingCerts, existingResearch, existingResources] =
    await Promise.all([
      db.select({ id: techSkillDomains.id }).from(techSkillDomains).where(eq(techSkillDomains.userId, userId)).limit(1),
      db.select({ id: techSkills.id }).from(techSkills).where(eq(techSkills.userId, userId)).limit(1),
      db.select({ id: techCertifications.id }).from(techCertifications).where(eq(techCertifications.userId, userId)).limit(1),
      db.select({ id: techResearchEntries.id }).from(techResearchEntries).where(eq(techResearchEntries.userId, userId)).limit(1),
      db.select({ id: techResources.id }).from(techResources).where(eq(techResources.userId, userId)).limit(1),
    ]);

  if (existingDomains.length === 0 || existingSkills.length === 0) {
    await db.transaction(async (tx) => {
      await tx.delete(techSkills).where(eq(techSkills.userId, userId));
      await tx.delete(techSkillDomains).where(eq(techSkillDomains.userId, userId));
      await tx.insert(techSkillDomains).values(
        seedDomains.map((domain) => ({
          userId,
          ...domain,
        })),
      );
      await tx.insert(techSkills).values(
        seedSkills.map((skill) => ({
          userId,
          ...skill,
          notes: null,
        })),
      );
    });
  }

  if (existingCerts.length === 0) {
    await db.insert(techCertifications).values(
      seedCertifications.map((certification) => ({
        userId,
        ...certification,
      })),
    );
  }

  if (existingResearch.length === 0) {
    await db.insert(techResearchEntries).values(
      seedResearchEntries.map((entry) => ({
        userId,
        ...entry,
      })),
    );
  }

  if (existingResources.length === 0) {
    await db.insert(techResources).values(
      seedResources.map((resource) => ({
        userId,
        ...resource,
      })),
    );
  }
}

techRoute.get("/tech", async (c) => {
  const userId = getUserId(c);
  await ensureTechSeedData(userId);

  const [domainRows, skillRows, certificationRows, researchRows, resourceRows] =
    await Promise.all([
      db.select().from(techSkillDomains).where(eq(techSkillDomains.userId, userId)).orderBy(asc(techSkillDomains.createdAt)),
      db.select().from(techSkills).where(eq(techSkills.userId, userId)).orderBy(asc(techSkills.createdAt)),
      db.select().from(techCertifications).where(eq(techCertifications.userId, userId)).orderBy(asc(techCertifications.createdAt)),
      db.select().from(techResearchEntries).where(eq(techResearchEntries.userId, userId)).orderBy(asc(techResearchEntries.createdAt)),
      db.select().from(techResources).where(eq(techResources.userId, userId)).orderBy(asc(techResources.createdAt)),
    ]);

  const skillsByDomain = new Map<string, typeof skillRows>();
  for (const skill of skillRows) {
    const existing = skillsByDomain.get(skill.domainClientId) ?? [];
    existing.push(skill);
    skillsByDomain.set(skill.domainClientId, existing);
  }

  return c.json({
    domains: domainRows.map((domain) => ({
      id: domain.clientId,
      name: domain.name,
      iconKey: domain.iconKey,
      color: domain.color,
      skills: (skillsByDomain.get(domain.clientId) ?? []).map((skill) => ({
        id: skill.clientId,
        name: skill.name,
        proficiency: skill.proficiency,
        notes: skill.notes ?? undefined,
        lastUpdated: skill.lastUpdated,
      })),
    })),
    certifications: certificationRows.map((certification) => ({
      id: certification.clientId,
      name: certification.name,
      provider: certification.provider,
      status: certification.status,
      targetDate: certification.targetDate ?? undefined,
      earnedDate: certification.earnedDate ?? undefined,
      expiryDate: certification.expiryDate ?? undefined,
      credentialId: certification.credentialId ?? undefined,
      credentialUrl: certification.credentialUrl ?? undefined,
      progress: certification.progress ?? undefined,
      studyNotes: certification.studyNotes ?? undefined,
    })),
    researchEntries: researchRows.map((entry) => ({
      id: entry.clientId,
      title: entry.title,
      domain: entry.domain,
      date: entry.entryDate,
      insights: entry.insights,
      tags: entry.tags ?? [],
      links: Array.isArray(entry.links) ? entry.links : [],
    })),
    resources: resourceRows.map((resource) => ({
      id: resource.clientId,
      title: resource.title,
      type: resource.type,
      source: resource.source,
      url: resource.url,
      category: resource.category,
      pinned: resource.pinned,
      rating: resource.rating ?? undefined,
    })),
  });
});

techRoute.put("/tech/skill-domains", async (c) => {
  const userId = getUserId(c);
  const body = await c.req.json<{
    domains?: Array<{
      id: string;
      name: string;
      iconKey: string;
      color?: string;
      skills: Array<{
        id: string;
        name: string;
        proficiency: string;
        notes?: string;
        lastUpdated: string;
      }>;
    }>;
  }>();

  if (!Array.isArray(body.domains)) {
    return c.json({ error: "Domains payload must be an array" }, 400);
  }

  const domains = body.domains;

  await db.transaction(async (tx) => {
    await tx.delete(techSkills).where(eq(techSkills.userId, userId));
    await tx.delete(techSkillDomains).where(eq(techSkillDomains.userId, userId));

    if (domains.length > 0) {
      await tx.insert(techSkillDomains).values(
        domains.map((domain) => ({
          userId,
          clientId: domain.id,
          name: domain.name,
          iconKey: domain.iconKey,
          color: domain.color ?? "tech",
        })),
      );

      const skills = domains.flatMap((domain) =>
        domain.skills.map((skill) => ({
          userId,
          clientId: skill.id,
          domainClientId: domain.id,
          name: skill.name,
          proficiency: skill.proficiency,
          notes: skill.notes?.trim() || null,
          lastUpdated: skill.lastUpdated,
        })),
      );

      if (skills.length > 0) {
        await tx.insert(techSkills).values(skills);
      }
    }
  });

  return c.json({ success: true });
});

techRoute.put("/tech/certifications", async (c) => {
  const userId = getUserId(c);
  const body = await c.req.json<{
    certifications?: Array<{
      id: string;
      name: string;
      provider: string;
      status: string;
      targetDate?: string;
      earnedDate?: string;
      expiryDate?: string;
      credentialId?: string;
      credentialUrl?: string;
      progress?: number;
      studyNotes?: string;
    }>;
  }>();

  if (!Array.isArray(body.certifications)) {
    return c.json({ error: "Certifications payload must be an array" }, 400);
  }

  const certifications = body.certifications;

  await db.transaction(async (tx) => {
    await tx.delete(techCertifications).where(eq(techCertifications.userId, userId));

    if (certifications.length > 0) {
      await tx.insert(techCertifications).values(
        certifications.map((certification) => ({
          userId,
          clientId: certification.id,
          name: certification.name,
          provider: certification.provider,
          status: certification.status,
          targetDate: certification.targetDate ?? null,
          earnedDate: certification.earnedDate ?? null,
          expiryDate: certification.expiryDate ?? null,
          credentialId: certification.credentialId ?? null,
          credentialUrl: certification.credentialUrl ?? null,
          progress: certification.progress ?? null,
          studyNotes: certification.studyNotes ?? null,
        })),
      );
    }
  });

  return c.json({ success: true });
});

techRoute.put("/tech/research-entries", async (c) => {
  const userId = getUserId(c);
  const body = await c.req.json<{
    entries?: Array<{
      id: string;
      title: string;
      domain: string;
      date: string;
      insights: string;
      tags?: string[];
      links?: Array<{ title: string; url: string }>;
    }>;
  }>();

  if (!Array.isArray(body.entries)) {
    return c.json({ error: "Research entries payload must be an array" }, 400);
  }

  const entries = body.entries;

  await db.transaction(async (tx) => {
    await tx.delete(techResearchEntries).where(eq(techResearchEntries.userId, userId));

    if (entries.length > 0) {
      await tx.insert(techResearchEntries).values(
        entries.map((entry) => ({
          userId,
          clientId: entry.id,
          title: entry.title,
          domain: entry.domain,
          entryDate: entry.date,
          insights: entry.insights,
          tags: entry.tags ?? [],
          links: entry.links ?? [],
        })),
      );
    }
  });

  return c.json({ success: true });
});

techRoute.put("/tech/resources", async (c) => {
  const userId = getUserId(c);
  const body = await c.req.json<{
    resources?: Array<{
      id: string;
      title: string;
      type: string;
      source: string;
      url: string;
      category: string;
      pinned: boolean;
      rating?: number;
    }>;
  }>();

  if (!Array.isArray(body.resources)) {
    return c.json({ error: "Resources payload must be an array" }, 400);
  }

  const resources = body.resources;

  await db.transaction(async (tx) => {
    await tx.delete(techResources).where(eq(techResources.userId, userId));

    if (resources.length > 0) {
      await tx.insert(techResources).values(
        resources.map((resource) => ({
          userId,
          clientId: resource.id,
          title: resource.title,
          type: resource.type,
          source: resource.source,
          url: resource.url,
          category: resource.category,
          pinned: resource.pinned,
          rating: resource.rating ?? null,
        })),
      );
    }
  });

  return c.json({ success: true });
});

export default techRoute;
