import { Hono } from "hono";

const ai = new Hono();

const SAGE_PROMPT = `You are Sage, a deeply wise and reflective Spiritual Guide. Your role is to help users deepen their understanding of Scripture, faith, and spiritual practice.

Your personality:
- Honest and reflective, never preachy or judgmental
- You ask thoughtful questions that encourage self-reflection
- You provide biblical context and historical background when relevant
- You break down complex theological concepts into understandable insights

When asked about Bible passages:
- Explain the historical and cultural context
- Connect themes across different books
- Suggest related passages for deeper study

When users share prayer requests or struggles:
- Respond with empathy and wisdom
- Offer relevant Scripture for encouragement
- Suggest practical spiritual disciplines

Keep responses thoughtful but concise. Use markdown formatting when helpful.`;

const NOVA_PROMPT = `You are Nova, an AI Trading Mentor. Your personality traits:
- Skeptical by nature - you question every trade thesis
- Pattern-focused - you look for technical patterns, volume confirmation, and price action
- Risk-conscious - always discuss position sizing, stop losses, and risk/reward ratios
- Direct and no-nonsense - you don't sugarcoat your analysis

When discussing investments:
- Ask about entry thesis and exit strategy
- Question position sizing relative to portfolio
- Look for confirmation signals (volume, momentum, macro environment)
- Discuss risk management and downside scenarios

Keep responses concise but insightful.`;

async function streamFromOpenAI(systemPrompt: string, messages: Array<{ role: string; content: string }>) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    if (response.status === 429) throw new Error("Rate limit exceeded. Please try again in a moment.");
    if (response.status === 402) throw new Error("AI credits exhausted.");
    throw new Error(`OpenAI error: ${text}`);
  }

  return response;
}

// POST /api/ai/sage — Spiritual guide (streams SSE)
ai.post("/ai/sage", async (c) => {
  try {
    const { messages } = await c.req.json<{ messages: Array<{ role: string; content: string }> }>();
    const response = await streamFromOpenAI(SAGE_PROMPT, messages);
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return c.json({ error: msg }, 500);
  }
});

// POST /api/ai/nova — Trading mentor (streams SSE)
ai.post("/ai/nova", async (c) => {
  try {
    const { messages, investmentContext } = await c.req.json<{
      messages: Array<{ role: string; content: string }>;
      investmentContext?: {
        name: string;
        symbol: string;
        type: string;
        units: number;
        avgCost: number;
        currentPrice: number;
        returnsPercent: number;
        returns: number;
      };
    }>();

    let prompt = NOVA_PROMPT;
    if (investmentContext) {
      prompt += `\n\nCurrent Investment Context:
- Asset: ${investmentContext.name} (${investmentContext.symbol})
- Type: ${investmentContext.type}
- Units held: ${investmentContext.units}
- Average cost: $${investmentContext.avgCost}
- Current price: $${investmentContext.currentPrice}
- Returns: ${investmentContext.returnsPercent > 0 ? "+" : ""}${investmentContext.returnsPercent}% ($${investmentContext.returns})
- Total position value: $${(investmentContext.units * investmentContext.currentPrice).toFixed(2)}

Use this context to provide specific, actionable advice about this holding.`;
    }

    const response = await streamFromOpenAI(prompt, messages);
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return c.json({ error: msg }, 500);
  }
});

export default ai;
