"use client";

import { useState, useRef, useCallback } from "react";
import {
  Sparkles, Copy, Check, RefreshCw, ChevronDown, FileText,
  MessageSquare, AlignLeft, Mail
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ContentSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { ContentType, LoadingState } from "@/types/ai";

const CONTENT_TYPES: { value: ContentType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: "blog-post", label: "Blog Post", icon: <FileText className="w-4 h-4" />, description: "Long-form article with sections" },
  { value: "caption", label: "Social Caption", icon: <MessageSquare className="w-4 h-4" />, description: "Engaging post with hashtags" },
  { value: "description", label: "Description", icon: <AlignLeft className="w-4 h-4" />, description: "Product or service description" },
  { value: "email", label: "Email", icon: <Mail className="w-4 h-4" />, description: "Professional email draft" },
];

const TONES = ["professional", "casual", "creative"] as const;

export default function ContentGenerator() {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState<ContentType>("blog-post");
  const [tone, setTone] = useState<"professional" | "casual" | "creative">("professional");
  const [content, setContent] = useState("");
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) return;
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoadingState("loading");
    setContent("");
    setError("");

    try {
      const res = await fetch("/api/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, type: contentType, tone }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Request failed");
      }
      if (!res.body) throw new Error("No response body");

      setLoadingState("streaming");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setContent((prev) => prev + chunk);
      }

      setLoadingState("success");
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "AI generation failed";
      console.error("ContentGenerator error:", err);
      setError(msg);
      setLoadingState("error");
    }
  }, [topic, contentType, tone]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLoading = loadingState === "loading" || loadingState === "streaming";

  return (
    <div className="flex flex-col gap-5">
      {/* Content Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {CONTENT_TYPES.map(({ value, label, icon, description }) => (
          <button
            key={value}
            id={`content-type-${value}`}
            onClick={() => setContentType(value)}
            disabled={isLoading}
            className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all
              ${contentType === value
                ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/20"
                : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {icon}
            <span className="text-xs font-semibold">{label}</span>
            <span className="text-[10px] text-muted-foreground leading-tight">{description}</span>
          </button>
        ))}
      </div>

      {/* Topic Input */}
      <div className="space-y-2">
        <label htmlFor="content-topic" className="text-sm font-medium text-foreground">
          Topic / Keywords
        </label>
        <div className="flex gap-2">
          <input
            id="content-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleGenerate()}
            placeholder="e.g. The future of AI in education..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm
                       placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40
                       disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Tone Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Tone:</span>
        <div className="flex gap-1">
          {TONES.map((t) => (
            <button
              key={t}
              id={`tone-${t}`}
              onClick={() => setTone(t)}
              disabled={isLoading}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all
                ${tone === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                } disabled:opacity-50`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        id="generate-content-btn"
        onClick={handleGenerate}
        disabled={!topic.trim() || isLoading}
        className="gradient-btn flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            {loadingState === "loading" ? "Preparing..." : "Generating..."}
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate Content
          </>
        )}
      </button>

      {/* Error */}
      {loadingState === "error" && (
        <ErrorMessage message={error} onRetry={handleGenerate} />
      )}

      {/* Skeleton during initial load */}
      {loadingState === "loading" && <ContentSkeleton />}

      {/* Streaming / Final Output */}
      {(loadingState === "streaming" || loadingState === "success") && content && (
        <div className="relative rounded-xl border border-border bg-muted/30 dark:bg-white/[0.02]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {loadingState === "streaming" ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Generating...
                </span>
              ) : "Generated Content"}
            </span>
            {loadingState === "success" && (
              <button
                id="copy-content-btn"
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground
                           px-2.5 py-1 rounded-lg hover:bg-muted transition-all"
              >
                {copied ? (
                  <><Check className="w-3.5 h-3.5 text-primary" /> Copied!</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> Copy</>
                )}
              </button>
            )}
          </div>
          {/* Content */}
          <div className="p-4 text-sm text-foreground/90 leading-relaxed font-body max-h-96 overflow-y-auto ai-content">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-3 mt-4" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2 mt-3" {...props} />,
                p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-foreground" {...props} />,
                code: ({node, ...props}) => <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
            {loadingState === "streaming" && (
              <span className="inline-block w-0.5 h-4 bg-primary animate-pulse ml-0.5 align-middle" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
