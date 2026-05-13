"use client";

import {
  ShieldCheck, Zap, Star, Clock, Users, TrendingUp,
} from "lucide-react";
import { SectionHeader } from "../ui/section-header";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Experts Only",
    desc: "Every tutor passes a rigorous background check, skill assessment, and demo session before joining.",
    gradient: "from-[#00ed64] to-[#00684a]",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    desc: "Find, book, and start a session within minutes. No lengthy back-and-forth emails.",
    gradient: "from-[#fa6e39] to-[#fa6e39]/80",
  },
  {
    icon: Star,
    title: "5-Star Quality",
    desc: "98% of students rate their sessions 4 stars or higher. We maintain quality at every step.",
    gradient: "from-[#f06bb8] to-[#7b3ff2]",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    desc: "Book sessions at any time — early morning, late night, weekends. Your schedule, your rules.",
    gradient: "from-[#3d4f9f] to-[#003d4f]",
  },
  {
    icon: Users,
    title: "1-on-1 Focused",
    desc: "Unlike group classes, every session is tailored exclusively to you and your learning pace.",
    gradient: "from-[#003d4f] to-[#00ed64]",
  },
  {
    icon: TrendingUp,
    title: "Measurable Progress",
    desc: "Track your learning journey with session history, reviews, and skill milestones.",
    gradient: "from-[#7b3ff2] to-[#f06bb8]",
  },
];

export default function WhySkillBridge() {
  return (
    <section className="py-24 bg-white dark:bg-[#001e2b] relative overflow-hidden border-b border-slate-100 dark:border-emerald-950/20">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#00ed64]/5 blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          label="Why Choose Us"
          title={
            <>Why <span className="text-[#00ed64]">SkillBridge</span> is Different</>
          }
          subtitle="We didn't just build another tutoring platform. We reimagined what learning should feel like in the modern world."
        />

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              custom={i * 0.1}
              className="group relative p-8 glass-card rounded-2xl hover:border-[#00ed64]/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full"
            >
              {/* Corner gradient accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full bg-gradient-to-br ${f.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />

              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 relative z-10`}>
                <f.icon className="h-6 w-6 text-white" />
              </div>

              <h3 className="font-display font-bold text-xl mb-3 relative z-10">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed flex-1 relative z-10">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}