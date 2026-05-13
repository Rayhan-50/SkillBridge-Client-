import { NextRequest } from "next/server";
import type { DataAnalyzerInput, DataAnalysis } from "@/types/ai";

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

function stripMarkdownFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

function validateAnalysis(data: unknown): DataAnalysis {
  if (typeof data !== "object" || data === null) {
    throw new Error("Response is not an object");
  }

  const d = data as Record<string, unknown>;
  const validSentiments = ["positive", "neutral", "negative"];

  return {
    summary: typeof d.summary === "string" ? d.summary : "No summary available",
    keyInsights: Array.isArray(d.keyInsights)
      ? (d.keyInsights as unknown[]).map(String)
      : [],
    trends: Array.isArray(d.trends) ? (d.trends as unknown[]).map(String) : [],
    recommendations: Array.isArray(d.recommendations)
      ? (d.recommendations as unknown[]).map(String)
      : [],
    sentiment: validSentiments.includes(d.sentiment as string)
      ? (d.sentiment as DataAnalysis["sentiment"])
      : "neutral",
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DataAnalyzerInput;
    const { data, context = "" } = body;

    if (!data?.trim()) {
      return Response.json({ error: "Data input is required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "GROQ_API_KEY is not configured in .env" },
        { status: 500 }
      );
    }

    const prompt = `You are an expert data analyst. Analyze the following data thoroughly and provide structured insights.
${context ? `Context: ${context}` : ""}

Data to analyze:
${data}

Return ONLY a valid JSON object — no markdown, no explanation — in this exact format:
{
  "summary": "A concise 2-3 sentence overview of the data",
  "keyInsights": [
    "Specific insight #1",
    "Specific insight #2",
    "Specific insight #3",
    "Specific insight #4"
  ],
  "trends": [
    "Identified trend #1",
    "Identified trend #2",
    "Identified trend #3"
  ],
  "recommendations": [
    "Actionable recommendation #1",
    "Actionable recommendation #2",
    "Actionable recommendation #3"
  ],
  "sentiment": "positive"
}

Rules:
- summary: 2-3 sentences
- keyInsights: exactly 4 items, each 1 sentence
- trends: 2-4 items, each 1 sentence
- recommendations: 3-4 actionable items, each 1 sentence
- sentiment: must be exactly "positive", "neutral", or "negative"`;

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

    const data2 = await response.json();
    const rawText: string = data2.choices?.[0]?.message?.content ?? "";
    
    let parsed: DataAnalysis;
    try {
      parsed = validateAnalysis(JSON.parse(rawText));
    } catch {
      // Fallback: try stripping markdown
      try {
        const cleaned = stripMarkdownFences(rawText);
        parsed = validateAnalysis(JSON.parse(cleaned));
      } catch (err) {
        console.error("JSON parse error. Raw text:", rawText);
        return Response.json(
          { error: "Failed to parse AI analysis as valid JSON" },
          { status: 500 }
        );
      }
    }

    return Response.json({ result: parsed });
  } catch (error) {
    console.error("ai-analyze route error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

