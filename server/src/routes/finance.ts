import { Hono } from "hono";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  financeBudgets,
  financeInvestments,
  financeTransactions,
} from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import { getUserId } from "../utils/user-context.js";

const financeRoute = new Hono();

financeRoute.use("*", requireAuth);

const seedTransactions = [
  { description: "Grocery Shopping", amount: -15000, dateLabel: "Today", category: "Food" },
  { description: "Freelance Payment", amount: 150000, dateLabel: "Yesterday", category: "Income" },
  { description: "Netflix Subscription", amount: -4500, dateLabel: "Dec 27", category: "Entertainment" },
  { description: "Electricity Bill", amount: -8200, dateLabel: "Dec 26", category: "Utilities" },
  { description: "Side Project Payment", amount: 75000, dateLabel: "Dec 25", category: "Income" },
  { description: "Restaurant Dinner", amount: -12000, dateLabel: "Dec 24", category: "Food" },
  { description: "Uber Rides", amount: -5500, dateLabel: "Dec 23", category: "Transport" },
];

const seedBudgets = [
  { category: "Food & Groceries", allocated: 100000, spent: 67000, color: "bg-finance" },
  { category: "Transportation", allocated: 50000, spent: 32000, color: "bg-trading" },
  { category: "Entertainment", allocated: 30000, spent: 28500, color: "bg-tech" },
  { category: "Utilities", allocated: 40000, spent: 38200, color: "bg-spiritual" },
  { category: "Shopping", allocated: 60000, spent: 15000, color: "bg-music" },
];

const seedInvestments = [
  { name: "Emergency Fund", type: "Savings", invested: 500000, current: 520000, change: "4.0" },
  { name: "Stock Portfolio", type: "Equity", invested: 300000, current: 342000, change: "14.0" },
  { name: "Mutual Fund", type: "Fund", invested: 200000, current: 218000, change: "9.0" },
  { name: "Treasury Bills", type: "Fixed Income", invested: 150000, current: 157500, change: "5.0" },
];

async function ensureFinanceSeedData(userId: string) {
  const [existingTransactions, existingBudgets, existingInvestments] = await Promise.all([
    db.select({ id: financeTransactions.id }).from(financeTransactions).where(eq(financeTransactions.userId, userId)).limit(1),
    db.select({ id: financeBudgets.id }).from(financeBudgets).where(eq(financeBudgets.userId, userId)).limit(1),
    db.select({ id: financeInvestments.id }).from(financeInvestments).where(eq(financeInvestments.userId, userId)).limit(1),
  ]);

  const writes: Promise<unknown>[] = [];

  if (existingTransactions.length === 0) {
    writes.push(
      db.insert(financeTransactions).values(
        seedTransactions.map((transaction) => ({
          userId,
          ...transaction,
        })),
      ),
    );
  }

  if (existingBudgets.length === 0) {
    writes.push(
      db.insert(financeBudgets).values(
        seedBudgets.map((budget) => ({
          userId,
          ...budget,
        })),
      ),
    );
  }

  if (existingInvestments.length === 0) {
    writes.push(
      db.insert(financeInvestments).values(
        seedInvestments.map((investment) => ({
          userId,
          ...investment,
        })),
      ),
    );
  }

  if (writes.length > 0) {
    await Promise.all(writes);
  }
}

financeRoute.get("/finance", async (c) => {
  const userId = getUserId(c);
  await ensureFinanceSeedData(userId);

  const [transactions, budgets, investments] = await Promise.all([
    db
      .select()
      .from(financeTransactions)
      .where(eq(financeTransactions.userId, userId))
      .orderBy(desc(financeTransactions.createdAt)),
    db
      .select()
      .from(financeBudgets)
      .where(eq(financeBudgets.userId, userId))
      .orderBy(asc(financeBudgets.createdAt)),
    db
      .select()
      .from(financeInvestments)
      .where(eq(financeInvestments.userId, userId))
      .orderBy(desc(financeInvestments.createdAt)),
  ]);

  return c.json({ transactions, budgets, investments });
});

financeRoute.post("/finance/transactions", async (c) => {
  const userId = getUserId(c);
  const body = await c.req.json<{
    description: string;
    amount: number;
    category: string;
    dateLabel?: string;
  }>();

  const description = body.description?.trim();
  if (!description) {
    return c.json({ error: "Description is required" }, 400);
  }

  if (!Number.isFinite(body.amount) || body.amount === 0) {
    return c.json({ error: "Amount must be a non-zero number" }, 400);
  }

  const [transaction] = await db
    .insert(financeTransactions)
    .values({
      userId,
      description,
      amount: Math.round(body.amount),
      category: body.category?.trim() || "Other",
      dateLabel: body.dateLabel?.trim() || "Today",
    })
    .returning();

  return c.json(transaction, 201);
});

financeRoute.post("/finance/budgets", async (c) => {
  const userId = getUserId(c);
  const body = await c.req.json<{
    category: string;
    allocated: number;
    spent?: number;
    color?: string;
  }>();

  const category = body.category?.trim();
  if (!category) {
    return c.json({ error: "Category is required" }, 400);
  }

  if (!Number.isFinite(body.allocated) || body.allocated <= 0) {
    return c.json({ error: "Allocated amount must be greater than zero" }, 400);
  }

  const [budget] = await db
    .insert(financeBudgets)
    .values({
      userId,
      category,
      allocated: Math.round(body.allocated),
      spent: Math.max(0, Math.round(body.spent ?? 0)),
      color: body.color?.trim() || "bg-finance",
    })
    .returning();

  return c.json(budget, 201);
});

financeRoute.post("/finance/investments", async (c) => {
  const userId = getUserId(c);
  const body = await c.req.json<{
    name: string;
    type: string;
    invested: number;
    current: number;
    change?: number;
  }>();

  const name = body.name?.trim();
  const type = body.type?.trim();

  if (!name) {
    return c.json({ error: "Name is required" }, 400);
  }

  if (!type) {
    return c.json({ error: "Type is required" }, 400);
  }

  if (!Number.isFinite(body.invested) || body.invested <= 0) {
    return c.json({ error: "Invested amount must be greater than zero" }, 400);
  }

  if (!Number.isFinite(body.current) || body.current < 0) {
    return c.json({ error: "Current value must be a valid number" }, 400);
  }

  const [investment] = await db
    .insert(financeInvestments)
    .values({
      userId,
      name,
      type,
      invested: Math.round(body.invested),
      current: Math.round(body.current),
      change: String(body.change ?? 0),
    })
    .returning();

  return c.json(investment, 201);
});

export default financeRoute;
