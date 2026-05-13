"use client";

import { useState, useCallback } from "react";
import { BarChart2, RefreshCw, Sparkles, TrendingUp, Lightbulb, CheckCircle2, AlertCircle } from "lucide-react";
import { AnalysisSkeleton } from "@/components/ui/LoadingSkeleton";
import ReactMarkdown from "react-markdown";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { DataAnalysis, Sentiment, LoadingState } from "@/types/ai";

const SAMPLE_DATA = `Sales Q1: $142,000 | Q2: $198,000 | Q3: $167,000 | Q4: $231,000
Top products: Course A (34%), Course B (28%), Course C (18%)
User signups: Jan 1200, Feb 1450, Mar 1380, Apr 1620, May 1890
Churn rate: 4.2% | NPS score: 72 | Avg session: 24 min
Support tickets: 340 resolved, 28 pending`;

const SENTIMENT_CONFIG: Record<Sentiment, { label: string; color: string; icon: React.ReactNode; bg: string }> = {
  positive: { label: "Positive", color: "text-emerald-500", icon: <CheckCircle2 className="w-4 h-4" />, bg: "bg-emerald-500/10 border-emerald-500/20" },
  neutral:  { label: "Neutral",  color: "text-blue-500",    icon: <AlertCircle className="w-4 h-4" />,  bg: "bg-blue-500/10 border-blue-500/20" },
  negative: { label: "Negative", color: "text-rose-500",    icon: <AlertCircle className="w-4 h-4" />,  bg: "bg-rose-500/10 border-rose-500/20" },
};

function InsightSection({ title, items, icon, accent }: {
  title: string; items: string[]; icon: React.ReactNode; accent: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <div className={`flex items-center gap-2 text-sm font-semibold ${accent}`}>
        {icon}{title}
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
            <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${accent.replace("text-", "bg-")}`} />
            <div className="flex-1">
              <ReactMarkdown components={{ p: ({node, ...props}) => <span {...props} />, strong: ({node, ...props}) => <strong className="font-bold text-foreground" {...props} /> }}>
                {item}
              </ReactMarkdown>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DataAnalyzer() {
  const [data, setData] = useState("");
  const [context, setContext] = useState("");
  const [analysis, setAnalysis] = useState<DataAnalysis | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [error, setError] = useState("");

  const handleAnalyze = useCallback(async () => {
    const input = data.trim();
    if (!input) return;
    setLoadingState("loading");
    setError("");
    setAnalysis(null);
    try {
      const res = await fetch("/api/ai-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: input, context }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Analysis failed");
      setAnalysis(json.result as DataAnalysis);
      setLoadingState("success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Analysis failed";
      console.error("DataAnalyzer error:", err);
      setError(msg);
      setLoadingState("error");
    }
  }, [data, context]);

  const isLoading = loadingState === "loading";
  const sentiment = analysis?.sentiment ? SENTIMENT_CONFIG[analysis.sentiment] : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-2">
        <label htmlFor="analyzer-data" className="text-sm font-medium">Data Input</label>
        <textarea
          id="analyzer-data"
          value={data}
          onChange={(e) => setData(e.target.value)}
          rows={5}
          disabled={isLoading}
          placeholder="Paste text, numbers, JSON, CSV, or any data you want analyzed..."
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm resize-none font-mono
                     placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
        />
        <button
          onClick={() => setData(SAMPLE_DATA)}
          disabled={isLoading}
          className="text-xs text-primary hover:underline underline-offset-2 disabled:opacity-50"
        >
          Load sample data →
        </button>
      </div>

      <div className="space-y-2">
        <label htmlFor="analyzer-context" className="text-sm font-medium">
          Context <span className="text-xs font-normal text-muted-foreground">(optional)</span>
        </label>
        <input
          id="analyzer-context"
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          disabled={isLoading}
          placeholder="e.g. This is Q4 2024 e-commerce sales data for an EdTech startup"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm
                     placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
        />
      </div>

      <button
        id="analyze-data-btn"
        onClick={handleAnalyze}
        disabled={!data.trim() || isLoading}
        className="gradient-btn flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        {isLoading ? (<><RefreshCw className="w-4 h-4 animate-spin" />Analyzing...</>)
          : (<><BarChart2 className="w-4 h-4" />Analyze Data</>)}
      </button>

      {loadingState === "error" && <ErrorMessage message={error} onRetry={handleAnalyze} />}
      {isLoading && <AnalysisSkeleton />}

      {loadingState === "success" && analysis && (
        <div className="space-y-4">
          {/* Summary + Sentiment */}
          <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-transparent p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="w-4 h-4 text-primary" />Summary
              </div>
              {sentiment && (
                <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${sentiment.bg} ${sentiment.color}`}>
                  {sentiment.icon}{sentiment.label}
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed">
              <ReactMarkdown components={{ p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />, strong: ({node, ...props}) => <strong className="font-bold text-foreground" {...props} /> }}>
                {analysis.summary}
              </ReactMarkdown>
            </div>
          </div>

          {/* Three columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <InsightSection title="Key Insights" items={analysis.keyInsights} icon={<Lightbulb className="w-4 h-4" />} accent="text-primary" />
            <InsightSection title="Trends" items={analysis.trends} icon={<TrendingUp className="w-4 h-4" />} accent="text-blue-500" />
            <InsightSection title="Recommendations" items={analysis.recommendations} icon={<CheckCircle2 className="w-4 h-4" />} accent="text-emerald-500" />
          </div>
        </div>
      )}
    </div>
  );
}
