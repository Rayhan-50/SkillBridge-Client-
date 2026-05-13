import { NextRequest } from "next/server";
import type { ChatRequest } from "@/types/ai";

const GROQ_API = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are SkillBridge AI Assistant — a friendly, knowledgeable helper for the SkillBridge learning platform.
You help students find tutors, understand courses, answer learning-related questions, and offer study tips.
Be concise, warm, and encouraging. Use markdown formatting where helpful (bold, lists, code blocks).
If you don't know something, say so honestly instead of making things up.`;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequest;
    const { messages } = body;

    if (!messages?.length) {
      return Response.json({ error: "Messages are required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "GROQ_API_KEY is not configured in .env" },
        { status: 500 }
      );
    }

    // Convert messages to OpenAI format (Groq)
    const formattedMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const groqRes = await fetch(GROQ_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1500,
        stream: true,
        messages: formattedMessages,
      }),
    });

    if (!groqRes.ok) {
      const errorText = await groqRes.text();
      console.error("Groq API error:", errorText);
      return Response.json({ error: "Groq API request failed" }, { status: 502 });
    }

    // Transform SSE → plain text stream
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
            // Skip malformed lines
          }
        }
      },
    });

    groqRes.body!.pipeTo(transformStream.writable).catch(console.error);

    return new Response(transformStream.readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-store",
      },
    });
  } catch (error) {
    console.error("ai-chat route error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

