import { NextRequest } from "next/server";
import type { AutoTaggerInput, TagResult } from "@/types/ai";

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

function stripMarkdownFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

function validateTagResult(data: unknown): TagResult {
  if (typeof data !== "object" || data === null) {
    throw new Error("Response is not an object");
  }

  const d = data as Record<string, unknown>;

  return {
    tags: Array.isArray(d.tags) ? (d.tags as unknown[]).map(String).slice(0, 10) : [],
    category: typeof d.category === "string" ? d.category : "Uncategorized",
    confidence: Math.min(1, Math.max(0, Number(d.confidence) || 0.5)),
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AutoTaggerInput;
    const { content } = body;

    if (!content?.trim()) {
      return Response.json({ error: "Content is required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "GROQ_API_KEY is not configured in .env" },
        { status: 500 }
      );
    }

    const prompt = `You are an expert content classifier and tagger. Analyze the following content and classify it.

Content:
${content}

Return ONLY a valid JSON object — no markdown, no explanation — in this exact format:
{
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "category": "Primary Category Name",
  "confidence": 0.92
}

Rules:
- tags: 4-8 highly relevant, specific keywords or phrases (lowercase, no special characters)
- category: a single broad category (e.g., "Technology", "Education", "Marketing", "Science", "Business", "Health")
- confidence: float between 0.0 and 1.0 representing how confident you are in the classification
- Do not include generic tags like "content" or "text"`;

    const response = await fetch(GROQ_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
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
    
    let parsed: TagResult;
    try {
      parsed = validateTagResult(JSON.parse(rawText));
    } catch {
      // Fallback: try stripping markdown
      try {
        const cleaned = stripMarkdownFences(rawText);
        parsed = validateTagResult(JSON.parse(cleaned));
      } catch (err) {
        console.error("JSON parse error. Raw text:", rawText);
        return Response.json(
          { error: "Failed to parse AI tag result as valid JSON" },
          { status: 500 }
        );
      }
    }

    return Response.json({ result: parsed });
  } catch (error) {
    console.error("ai-tag route error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

