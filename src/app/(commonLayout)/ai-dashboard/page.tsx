import { Suspense } from "react";
import type { Metadata } from "next";
import {
  Sparkles, MessageSquare, BarChart2, Tag, Wand2, Bot,
  Zap, Star, TrendingUp
} from "lucide-react";

// Client components lazy-loaded via Suspense
import dynamic from "next/dynamic";
import { ContentSkeleton, RecommendationSkeleton, AnalysisSkeleton, TagSkeleton } from "@/components/ui/LoadingSkeleton";
import { TypingIndicator } from "@/components/ui/LoadingSkeleton";

const ContentGenerator     = dynamic(() => import("@/components/ai/ContentGenerator"));
const SmartRecommendations = dynamic(() => import("@/components/ai/SmartRecommendations"));
const ChatAssistant        = dynamic(() => import("@/components/ai/ChatAssistant"));
const DataAnalyzer         = dynamic(() => import("@/components/ai/DataAnalyzer"));
const AutoTagger           = dynamic(() => import("@/components/ai/AutoTagger"));

export const metadata: Metadata = {
  title: "AI Dashboard | SkillBridge",
  description: "Five production-grade AI features powered by Groq — content generation, smart recommendations, chat, data analysis, and auto-tagging.",
};

// ─── Feature card config ──────────────────────────────────────────────────────
const FEATURES = [
  {
    id: "content",
    label: "Content Generator",
    icon: <Wand2 className="w-5 h-5" />,
    badge: "Streaming",
    badgeColor: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    description: "Generate blog posts, captions, and emails in real-time",
    gradient: "from-violet-500/10 to-transparent",
    component: <ContentGenerator />,
    fallback: <ContentSkeleton />,
  },
  {
    id: "recommend",
    label: "Smart Recommendations",
    icon: <Star className="w-5 h-5" />,
    badge: "Structured JSON",
    badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    description: "Personalized picks scored by AI match percentage",
    gradient: "from-amber-500/10 to-transparent",
    component: <SmartRecommendations />,
    fallback: <RecommendationSkeleton />,
  },
  {
    id: "chat",
    label: "Chat Assistant",
    icon: <Bot className="w-5 h-5" />,
    badge: "Multi-turn",
    badgeColor: "bg-primary/10 text-primary border-primary/20",
    description: "Context-aware AI chatbot with streaming responses",
    gradient: "from-primary/10 to-transparent",
    component: <ChatAssistant />,
    fallback: (
      <div className="space-y-3 p-4">
        <TypingIndicator />
      </div>
    ),
  },
  {
    id: "analyze",
    label: "Data Analyzer",
    icon: <BarChart2 className="w-5 h-5" />,
    badge: "Insights",
    badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    description: "Turn raw data into structured insights and recommendations",
    gradient: "from-blue-500/10 to-transparent",
    component: <DataAnalyzer />,
    fallback: <AnalysisSkeleton />,
  },
  {
    id: "tag",
    label: "Auto Tagger",
    icon: <Tag className="w-5 h-5" />,
    badge: "Classifier",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    description: "Instant content tagging and category classification",
    gradient: "from-emerald-500/10 to-transparent",
    component: <AutoTagger />,
    fallback: <TagSkeleton />,
  },
];

// ─── Stat cards shown at top ──────────────────────────────────────────────────
const STATS = [
  { icon: <Zap className="w-5 h-5 text-primary" />,       label: "AI Features",    value: "5" },
  { icon: <TrendingUp className="w-5 h-5 text-blue-500" />, label: "Streaming APIs", value: "2" },
  { icon: <Sparkles className="w-5 h-5 text-violet-500" />, label: "Groq Model",     value: "Llama 3.3" },
  { icon: <MessageSquare className="w-5 h-5 text-amber-500" />, label: "Latency", value: "~200ms" },
];

// ─── Page (Server Component) ──────────────────────────────────────────────────
export default function AIDashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 hero-gradient" />
        {/* Orbs */}
        <div className="absolute top-0 left-1/4 w-80 h-80 orb-teal opacity-40" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 orb-purple opacity-30" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
                          bg-primary/10 text-primary border border-primary/20 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Groq llama-3.3-70b-versatile
          </div>

          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-foreground mb-4">
            AI Features{" "}
            <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
            Five production-grade AI capabilities — streaming generation, structured JSON, multi-turn chat, data insights, and smart classification.
          </p>

          {/* Stat row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {STATS.map(({ icon, label, value }) => (
              <div key={label} className="glass-card px-4 py-3 flex flex-col items-center gap-1">
                {icon}
                <span className="text-xl font-display font-bold text-foreground">{value}</span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Grid ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {FEATURES.map((feat) => (
          <div
            key={feat.id}
            id={`feature-${feat.id}`}
            className={`rounded-2xl border border-border bg-gradient-to-br ${feat.gradient} bg-card overflow-hidden`}
          >
            {/* Feature Header */}
            <div className="px-6 py-5 border-b border-border flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-foreground">
                  {feat.icon}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">{feat.label}</h2>
                  <p className="text-xs text-muted-foreground">{feat.description}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${feat.badgeColor}`}>
                {feat.badge}
              </span>
            </div>

            {/* Feature Body — wrapped in Suspense */}
            <div className="p-6">
              <Suspense fallback={feat.fallback}>
                {feat.component}
              </Suspense>
            </div>
          </div>
        ))}
      </section>

      {/* ── Footer note ── */}
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        <p>
          All AI features use{" "}
          <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-primary">llama-3.3-70b-versatile</code>
          {" "}via the Groq Cloud API.
        </p>
        <p className="mt-1">Set <code className="font-mono bg-muted px-1.5 py-0.5 rounded">GROQ_API_KEY</code> in your <code className="font-mono bg-muted px-1.5 py-0.5 rounded">.env</code> file to activate.</p>
      </footer>
    </main>
  );
}
