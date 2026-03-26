import {
  ShieldCheck, Zap, Star, Clock, Users, TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Experts Only",
    desc: "Every tutor passes a rigorous background check, skill assessment, and demo session before joining.",
    gradient: "from-emerald-500 to-teal-400",
    glow: "group-hover:shadow-emerald-500/20",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    desc: "Find, book, and start a session within minutes. No lengthy back-and-forth emails.",
    gradient: "from-violet-500 to-purple-400",
    glow: "group-hover:shadow-violet-500/20",
  },
  {
    icon: Star,
    title: "5-Star Quality",
    desc: "98% of students rate their sessions 4 stars or higher. We maintain quality at every step.",
    gradient: "from-yellow-500 to-amber-400",
    glow: "group-hover:shadow-yellow-500/20",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    desc: "Book sessions at any time — early morning, late night, weekends. Your schedule, your rules.",
    gradient: "from-cyan-500 to-blue-400",
    glow: "group-hover:shadow-cyan-500/20",
  },
  {
    icon: Users,
    title: "1-on-1 Focused",
    desc: "Unlike group classes, every session is tailored exclusively to you and your learning pace.",
    gradient: "from-pink-500 to-rose-400",
    glow: "group-hover:shadow-pink-500/20",
  },
  {
    icon: TrendingUp,
    title: "Measurable Progress",
    desc: "Track your learning journey with session history, reviews, and skill milestones.",
    gradient: "from-orange-500 to-red-400",
    glow: "group-hover:shadow-orange-500/20",
  },
];

export default function WhySkillBridge() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-primary/3 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge className="mb-4 gradient-btn text-white border-0 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide">
            Why Choose Us
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why <span className="gradient-text">SkillBridge</span> is Different
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            We didn&apos;t just build another tutoring platform. We reimagined what
            learning should feel like in the modern world.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className={`group relative p-6 rounded-2xl border border-border/50 bg-card hover:shadow-xl ${f.glow} transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
            >
              {/* Corner gradient accent */}
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full bg-gradient-to-br ${f.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} shadow-md mb-5 group-hover:scale-110 transition-transform`}>
                <f.icon className="h-5 w-5 text-white" />
              </div>

              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
