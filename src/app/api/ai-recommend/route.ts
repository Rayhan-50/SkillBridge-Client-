import { NextRequest } from "next/server";
import type { RecommendationInput, RecommendationsResponse } from "@/types/ai";

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

function stripMarkdownFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

function validateRecommendations(data: unknown): RecommendationsResponse {
  if (
    typeof data !== "object" ||
    data === null ||
    !Array.isArray((data as RecommendationsResponse).recommendations)
  ) {
    throw new Error("Invalid recommendations structure");
  }

  const typed = data as RecommendationsResponse;
  typed.recommendations = typed.recommendations.map((r, i) => ({
    id: r.id ?? String(i + 1),
    title: r.title ?? "Untitled",
    reason: r.reason ?? "No reason provided",
    score: Math.min(100, Math.max(0, Number(r.score) || 75)),
    category: r.category,
    tags: Array.isArray(r.tags) ? r.tags : [],
  }));

  return typed;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RecommendationInput;
    const { preferences, history = "", limit = 5 } = body;

    if (!preferences?.trim()) {
      return Response.json({ error: "Preferences are required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "GROQ_API_KEY is not configured in .env" },
        { status: 500 }
      );
    }

    const prompt = `You are a personalized recommendation engine. Based on the user's preferences and history, generate ${limit} highly relevant recommendations.

User Preferences: ${preferences}
${history ? `User History: ${history}` : ""}

Return ONLY a valid JSON object — no markdown, no explanation — in this exact format:
{
  "recommendations": [
    {
      "id": "1",
      "title": "Item title here",
      "reason": "Specific reason this matches their preferences",
      "score": 92,
      "category": "Category name",
      "tags": ["tag1", "tag2"]
    }
  ]
}

Rules:
- score is 60-100 (integer)
- reason must be specific and personalized (2-3 sentences)
- tags should be relevant keywords (2-4 per item)
- Generate exactly ${limit} recommendations`;

    const response = await fetch(GROQ_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1500,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      console.error("Groq error:", await response.text());
      return Response.json({ error: "Groq API request failed" }, { status: 502 });
    }

    const data = await response.json();
    const rawText: string = data.choices?.[0]?.message?.content ?? "";
    
    let parsed: RecommendationsResponse;
    try {
      parsed = validateRecommendations(JSON.parse(rawText));
    } catch {
      // Fallback: try stripping markdown just in case
      try {
        const cleaned = stripMarkdownFences(rawText);
        parsed = validateRecommendations(JSON.parse(cleaned));
      } catch (err) {
        console.error("JSON parse error. Raw text:", rawText);
        return Response.json(
          { error: "Failed to parse AI response as valid JSON" },
          { status: 500 }
        );
      }
    }

    return Response.json({ result: parsed });
  } catch (error) {
    console.error("ai-recommend route error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

