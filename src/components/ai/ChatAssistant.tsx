"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Send, RefreshCw, Bot, User, AlertTriangle, Trash2 } from "lucide-react";
import { TypingIndicator } from "@/components/ui/LoadingSkeleton";
import ReactMarkdown from "react-markdown";
import type { ChatMessage, LoadingState } from "@/types/ai";

function genId() { return Math.random().toString(36).slice(2); }

const STARTER_PROMPTS = [
  "How do I find the right tutor for Python?",
  "What courses are available for beginners?",
  "Give me a 7-day study plan for JavaScript",
  "Tips for online learning productivity?",
];

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
        ${isUser ? "bg-primary text-primary-foreground" : "bg-muted border border-border"}`}>
        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-primary" />}
      </div>
      <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
        ${isUser
          ? "bg-primary text-primary-foreground rounded-br-sm"
          : msg.error
            ? "bg-destructive/10 text-destructive border border-destructive/20 rounded-bl-sm"
            : "bg-muted dark:bg-white/5 text-foreground rounded-bl-sm"
        }`}>
        {msg.error && <AlertTriangle className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" />}
        <div className="ai-chat-content">
          <ReactMarkdown
            components={{
              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold text-current" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
              code: ({node, ...props}) => <code className={`px-1 rounded text-xs font-mono ${isUser ? "bg-white/20" : "bg-muted-foreground/10"}`} {...props} />,
            }}
          >
            {msg.content}
          </ReactMarkdown>
        </div>
        {msg.isStreaming && (
          <span className="inline-block w-0.5 h-3.5 bg-current animate-pulse ml-0.5 align-middle opacity-70" />
        )}
      </div>
    </div>
  );
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [lastUserMsg, setLastUserMsg] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loadingState === "loading" || loadingState === "streaming") return;

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const userMsg: ChatMessage = { id: genId(), role: "user", content, timestamp: new Date() };
    setLastUserMsg(content);
    setInput("");
    setMessages((prev) => [...prev, userMsg]);
    setLoadingState("loading");

    const assistantId = genId();
    const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(json.error ?? "Chat request failed");
      }
      if (!res.body) throw new Error("No response stream");

      setLoadingState("streaming");
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", timestamp: new Date(), isStreaming: true },
      ]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, content: m.content + chunk } : m)
        );
      }

      setMessages((prev) =>
        prev.map((m) => m.id === assistantId ? { ...m, isStreaming: false } : m)
      );
      setLoadingState("success");
      inputRef.current?.focus();
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "Something went wrong";
      console.error("ChatAssistant error:", err);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== assistantId),
        { id: genId(), role: "assistant", content: msg, timestamp: new Date(), error: true },
      ]);
      setLoadingState("error");
    }
  }, [input, messages, loadingState]);

  const handleRetry = () => sendMessage(lastUserMsg);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    abortRef.current?.abort();
    setMessages([]);
    setLoadingState("idle");
    setInput("");
  };

  const isStreaming = loadingState === "loading" || loadingState === "streaming";

  return (
    <div className="flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">SkillBridge AI</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              {isStreaming ? "Typing..." : "Online"}
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors px-2 py-1 rounded-lg hover:bg-destructive/10">
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-5 text-center py-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Bot className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Ask me anything</p>
              <p className="text-xs text-muted-foreground mt-1">I can help with tutors, courses, and learning tips</p>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
              {STARTER_PROMPTS.map((p) => (
                <button key={p} onClick={() => sendMessage(p)}
                  className="text-left text-xs px-3 py-2 rounded-xl border border-border bg-muted/40 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all leading-snug">
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}
            {loadingState === "loading" && <TypingIndicator />}
            {loadingState === "error" && (
              <div className="flex justify-center">
                <button onClick={handleRetry}
                  className="flex items-center gap-1.5 text-xs text-destructive border border-destructive/20 bg-destructive/5 px-3 py-1.5 rounded-full hover:bg-destructive/10 transition-colors">
                  <RefreshCw className="w-3 h-3" /> Retry last message
                </button>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="pt-3 border-t border-border mt-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isStreaming}
            placeholder="Message SkillBridge AI... (Enter to send)"
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm resize-none
                       placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40
                       disabled:opacity-50 max-h-28 overflow-y-auto"
            style={{ minHeight: "44px" }}
          />
          <button
            id="send-chat-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isStreaming}
            className="shrink-0 w-10 h-10 rounded-xl gradient-btn flex items-center justify-center
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
            {isStreaming
              ? <RefreshCw className="w-4 h-4 animate-spin" />
              : <Send className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
          Shift+Enter for new line · Context-aware multi-turn chat
        </p>
      </div>
    </div>
  );
}
