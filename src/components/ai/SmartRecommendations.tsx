"use client";

import { useState, useCallback } from "react";
import { Star, RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import { RecommendationSkeleton } from "@/components/ui/LoadingSkeleton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { Recommendation, LoadingState } from "@/types/ai";

const PRESETS = [
  "I love React, TypeScript, and full-stack web development",
  "Interested in machine learning, Python, and data science",
  "Frontend design, UI/UX, Figma, and modern CSS",
  "DevOps, cloud infrastructure, Docker, and Kubernetes",
];

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90 ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    : score >= 75 ? "text-blue-500 bg-blue-500/10 border-blue-500/20"
    : "text-amber-500 bg-amber-500/10 border-amber-500/20";
  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-bold ${color}`}>
      <TrendingUp className="w-3 h-3" />{score}%
    </div>
  );
}

function RecCard({ rec, index }: { rec: Recommendation; index: number }) {
  return (
    <div className="glass-card p-4 flex flex-col gap-3 group" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm text-foreground leading-tight group-hover:text-primary transition-colors">{rec.title}</h3>
        <ScoreBadge score={rec.score} />
      </div>
      {rec.category && <span className="text-[10px] uppercase tracking-widest font-medium text-muted-foreground">{rec.category}</span>}
      <p className="text-xs text-muted-foreground leading-relaxed">{rec.reason}</p>
      {rec.tags && rec.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {rec.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">{tag}</span>
          ))}
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-1.5">
        <div className="h-1.5 rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-700" style={{ width: `${rec.score}%` }} />
      </div>
    </div>
  );
}

export default function SmartRecommendations() {
  const [preferences, setPreferences] = useState("");
  const [history, setHistory] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [error, setError] = useState("");

  const handleGenerate = useCallback(async () => {
    if (!preferences.trim()) return;
    setLoadingState("loading");
    setError("");
    try {
      const res = await fetch("/api/ai-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences, history, limit: 6 }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Request failed");
      if (!json.result?.recommendations?.length) throw new Error("No recommendations returned");
      setRecommendations(json.result.recommendations);
      setLoadingState("success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Recommendation failed";
      console.error("SmartRecommendations error:", err);
      setError(msg);
      setLoadingState("error");
    }
  }, [preferences, history]);

  const isLoading = loadingState === "loading";

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-2">
        <label htmlFor="rec-preferences" className="text-sm font-medium">Your Interests & Preferences</label>
        <textarea id="rec-preferences" value={preferences} onChange={(e) => setPreferences(e.target.value)}
          rows={2} disabled={isLoading} placeholder="Describe your interests, skills, or what you want to learn..."
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50" />
      </div>
      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground">Quick presets:</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p} onClick={() => setPreferences(p)} disabled={isLoading}
              className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted/50 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all disabled:opacity-50">
              {p.split(",")[0]}…
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="rec-history" className="text-sm font-medium">Past Activity <span className="text-xs font-normal text-muted-foreground">(optional)</span></label>
        <textarea id="rec-history" value={history} onChange={(e) => setHistory(e.target.value)}
          rows={2} disabled={isLoading} placeholder="e.g. Completed React basics, tried Python once..."
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50" />
      </div>
      <button id="generate-recommendations-btn" onClick={handleGenerate} disabled={!preferences.trim() || isLoading}
        className="gradient-btn flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
        {isLoading ? (<><RefreshCw className="w-4 h-4 animate-spin" />Analyzing...</>)
          : recommendations.length > 0 ? (<><RefreshCw className="w-4 h-4" />Regenerate</>)
          : (<><Sparkles className="w-4 h-4" />Get Recommendations</>)}
      </button>
      {loadingState === "error" && <ErrorMessage message={error} onRetry={handleGenerate} />}
      {isLoading && <RecommendationSkeleton />}
      {loadingState === "success" && recommendations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium"><Star className="w-4 h-4 text-primary" />{recommendations.length} Personalized Recommendations</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations.map((rec, i) => <RecCard key={rec.id} rec={rec} index={i} />)}
          </div>
        </div>
      )}
    </div>
  );
}
