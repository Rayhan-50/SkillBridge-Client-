import { NextRequest } from "next/server";
import type { ContentGeneratorInput } from "@/types/ai";

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const PROMPTS: Record<string, string> = {
  "blog-post":
    "Write a detailed, engaging blog post with a compelling title, introduction, 3-4 body sections with subheadings, and a conclusion.",
  caption:
    "Write a captivating social media caption with relevant emojis and 3-5 hashtags at the end.",
  description:
    "Write a compelling product/service description that highlights key benefits and features.",
  email:
    "Write a professional email with a clear subject line (prefix with 'Subject: '), greeting, body, and sign-off.",
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContentGeneratorInput;
    const { topic, type, tone = "professional" } = body;

    if (!topic?.trim()) {
      return Response.json({ error: "Topic is required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "GROQ_API_KEY is not configured in .env" },
        { status: 500 }
      );
    }

    const instruction = PROMPTS[type] ?? PROMPTS["blog-post"];
    const prompt = `${instruction}\n\nTopic: ${topic}\nTone: ${tone}\n\nWrite now:`;

    const groqRes = await fetch(GROQ_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2000,
        stream: true,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!groqRes.ok) {
      const errorText = await groqRes.text();
      console.error("Groq API error:", errorText);
      return Response.json({ error: "Groq API request failed" }, { status: 502 });
    }

    // Transform Groq (OpenAI-style) SSE → plain text stream
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const transformStream = new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        const text = decoder.decode(chunk, { stream: true });
        const lines = text.split("\n");

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          
          const data = trimmed.slice(6).trim();
          if (data === "[DONE]") return;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          } catch {
            // Skip malformed SSE lines
          }
        }
      },
    });

    groqRes.body!.pipeTo(transformStream.writable).catch(console.error);

    return new Response(transformStream.readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("ai-generate route error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

