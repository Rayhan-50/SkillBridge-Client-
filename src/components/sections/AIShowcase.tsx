import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2, MessageSquare, BarChart2, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: <Wand2 className="w-5 h-5" />,
    title: "Content Generator",
    desc: "Generate professional descriptions, blog ideas, and social captions in seconds.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: "Smart Recommendations",
    desc: "Get personalized tutor and course matches based on your learning history.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "AI Chat Assistant",
    desc: "Get instant answers to platform questions and study tips from our context-aware bot.",
    color: "text-[#00ed64]",
    bg: "bg-emerald-500/10",
  },
  {
    icon: <BarChart2 className="w-5 h-5" />,
    title: "Data Analyzer",
    desc: "Turn your learning progress data into structured insights and clear action items.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  }
];

export function AIShowcase() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          label="Cutting Edge Learning"
          title={<>The <span className="gradient-text">AI-Powered</span> Classroom</>}
          subtitle="We've integrated world-class AI models to enhance your learning experience and boost productivity."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {FEATURES.map((feat, i) => (
            <div 
              key={feat.title}
              className="glass-card p-6 rounded-3xl border border-border/50 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-2xl ${feat.bg} ${feat.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {feat.icon}
              </div>
              <h3 className="text-lg font-display font-bold mb-3 text-foreground">{feat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-2 rounded-[32px] bg-card border border-border/50 shadow-xl max-w-2xl mx-auto overflow-hidden">
            <div className="px-6 py-3 text-left hidden sm:block">
              <p className="text-sm font-medium text-foreground">Explore all AI tools in our Lab</p>
              <p className="text-xs text-muted-foreground">Free for all SkillBridge users</p>
            </div>
            <Button asChild className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 font-bold shadow-lg shadow-primary/20 w-full sm:w-auto">
              <Link href="/ai-dashboard" className="flex items-center gap-2">
                Visit AI Lab <Sparkles className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
