"use client";

import { useState, useCallback } from "react";
import { Tag, RefreshCw, Zap, Hash } from "lucide-react";
import { TagSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { TagResult, LoadingState } from "@/types/ai";

const SAMPLES = [
  "Next.js 15 introduces React Server Components with partial pre-rendering, improving performance for data-heavy dashboards.",
  "Our new yoga mat is made from sustainable cork and natural rubber, providing superior grip for hot yoga and pilates.",
  "The Federal Reserve raised interest rates by 25bps citing persistent inflation, rattling bond markets globally.",
];

const CONFIDENCE_COLORS = (c: number) =>
  c >= 0.85 ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
  : c >= 0.65 ? "text-blue-500 bg-blue-500/10 border-blue-500/20"
  : "text-amber-500 bg-amber-500/10 border-amber-500/20";

const TAG_COLORS = [
  "bg-primary/10 text-primary border-primary/20",
  "bg-violet-500/10 text-violet-500 border-violet-500/20",
  "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  "bg-amber-500/10 text-amber-500 border-amber-500/20",
  "bg-rose-500/10 text-rose-500 border-rose-500/20",
];

export default function AutoTagger() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState<TagResult | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [error, setError] = useState("");

  const handleTag = useCallback(async () => {
    if (!content.trim()) return;
    setLoadingState("loading");
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/ai-tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Tagging failed");
      setResult(json.result as TagResult);
      setLoadingState("success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Tagging failed";
      console.error("AutoTagger error:", err);
      setError(msg);
      setLoadingState("error");
    }
  }, [content]);

  const isLoading = loadingState === "loading";

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-2">
        <label htmlFor="tagger-content" className="text-sm font-medium">Content to Classify</label>
        <textarea
          id="tagger-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          disabled={isLoading}
          placeholder="Paste any content — an article, product description, tweet, blog post..."
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm resize-none
                     placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
        />
        <div className="flex flex-wrap gap-2">
          {SAMPLES.map((s, i) => (
            <button key={i} onClick={() => setContent(s)} disabled={isLoading}
              className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted/50 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all disabled:opacity-50">
              Sample {i + 1}
            </button>
          ))}
        </div>
      </div>

      <button
        id="classify-content-btn"
        onClick={handleTag}
        disabled={!content.trim() || isLoading}
        className="gradient-btn flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        {isLoading ? (<><RefreshCw className="w-4 h-4 animate-spin" />Classifying...</>)
          : (<><Zap className="w-4 h-4" />Auto Tag & Classify</>)}
      </button>

      {loadingState === "error" && <ErrorMessage message={error} onRetry={handleTag} />}
      {isLoading && <TagSkeleton />}

      {loadingState === "success" && result && (
        <div className="space-y-4 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-transparent p-5">
          {/* Category + Confidence */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Tag className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm font-semibold text-primary">{result.category}</span>
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border ${CONFIDENCE_COLORS(result.confidence)}`}>
              <Zap className="w-3 h-3" />
              {Math.round(result.confidence * 100)}% confidence
            </div>
          </div>

          {/* Confidence bar */}
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Classification confidence</span>
              <span>{Math.round(result.confidence * 100)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-700"
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>
          </div>

          {/* Tag pills */}
          {result.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                <Hash className="w-3.5 h-3.5" />Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag, i) => (
                  <span key={tag}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-transform hover:scale-105 cursor-default ${TAG_COLORS[i % TAG_COLORS.length]}`}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
