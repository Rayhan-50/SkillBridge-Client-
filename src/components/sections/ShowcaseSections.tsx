"use client";

import { motion, type Variants } from "framer-motion";
import { CheckCircle2, Video, Trophy, Compass } from "lucide-react";
import Image from "next/image";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

export function ClassroomShowcase() {
  return (
    <section className="py-24 bg-[#f8fafc] dark:bg-[#0a232f] relative overflow-hidden border-b border-slate-100 dark:border-emerald-950/20">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#00ed64]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-6xl mx-auto"
        >
          {/* Text block */}
          <motion.div variants={fadeUp} className="lg:col-span-5 space-y-6 text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#00ed64]/10 text-[#00b545] dark:text-[#00ed64] px-4 py-1.5 text-xs font-bold tracking-wide">
              <Video className="w-3.5 h-3.5" />
              1-on-1 Virtual Classroom
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#001e2b] dark:text-[#f8fafc] leading-tight">
              Feel Like You're in the Same Room
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
              Experience private video learning, high-definition whiteboards, real-time code collaboration, and customized checkpoints crafted to accelerate your understanding.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#00ed64] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Ultra-low Latency Video & Voice</h4>
                  <p className="text-xs text-slate-500">Perfect clarity without drops, lag, or compression noise.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#00ed64] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Integrated Database Playgrounds</h4>
                  <p className="text-xs text-slate-500">Practice aggregate logic and sharding right inside the classroom.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#00ed64] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Synchronized Syllabus Checklists</h4>
                  <p className="text-xs text-slate-500">Track and lock complete topics and daily objectives as you study.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image block */}
          <motion.div variants={fadeUp} className="lg:col-span-7 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00ed64]/10 to-[#003d4f]/5 rounded-[24px] blur-2xl pointer-events-none" />
            <div className="relative rounded-[24px] border border-slate-200/60 dark:border-emerald-950/40 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,237,100,0.05)] hover:shadow-[0_20px_50px_rgba(0,237,100,0.15)] hover:-translate-y-1 transition-all duration-500 bg-white dark:bg-[#0c2a37]">
              <Image 
                src="/images/classroom_experience.png"
                alt="Interactive Remote Tutoring Classroom Experience"
                width={800}
                height={800}
                className="w-full object-cover aspect-[4/3] sm:aspect-[16/11]"
                priority
              />
              <div className="absolute top-4 right-4 bg-[#001e2b]/80 backdrop-blur-md border border-emerald-950/60 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-[11px] font-bold text-[#00ed64]">
                <span className="w-2 h-2 rounded-full bg-[#00ed64] animate-pulse" />
                Live: Alex Rivera is lecturing
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function CareerShowcase() {
  return (
    <section className="py-24 bg-white dark:bg-[#001e2b] relative overflow-hidden border-b border-slate-100 dark:border-emerald-950/20">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#003d4f]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-6xl mx-auto"
        >
          {/* Image block (Left on large screen) */}
          <motion.div variants={fadeUp} className="lg:col-span-7 order-last lg:order-first relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#003d4f]/15 to-[#00ed64]/5 rounded-[24px] blur-2xl pointer-events-none" />
            <div className="relative rounded-[24px] border border-slate-200/60 dark:border-emerald-950/40 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,237,100,0.05)] hover:shadow-[0_20px_50px_rgba(0,237,100,0.12)] hover:-translate-y-1 transition-all duration-500 bg-white dark:bg-[#0c2a37]">
              <Image 
                src="/images/career_growth_showcase.png"
                alt="Diverse Team of Professional Software Developers Collaborating"
                width={800}
                height={800}
                className="w-full object-cover aspect-[4/3] sm:aspect-[16/11]"
              />
              <div className="absolute bottom-4 left-4 bg-[#00ed64] text-[#001e2b] rounded-full px-3 py-1 text-[11px] font-bold shadow-lg">
                🏆 Top Mentors from Big Tech
              </div>
            </div>
          </motion.div>

          {/* Text block (Right on large screen) */}
          <motion.div variants={fadeUp} className="lg:col-span-5 space-y-6 text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#00ed64]/10 text-[#00b545] dark:text-[#00ed64] px-4 py-1.5 text-xs font-bold tracking-wide">
              <Trophy className="w-3.5 h-3.5" />
              Professional Career Growth
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#001e2b] dark:text-[#f8fafc] leading-tight">
              Learn High-Demand Developer Skills
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
              Connect with seasoned software architects, database administrators, and cloud engineers from Google, Microsoft, and top MongoDB departments worldwide.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#00ed64] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Industry-standard Code Reviews</h4>
                  <p className="text-xs text-slate-500">Learn design patterns, system architecture, and robust coding rules.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#00ed64] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Mock Interview Practice</h4>
                  <p className="text-xs text-slate-500">Train with live tech coding tests and system mock sessions.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#00ed64] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Active Portfolio Building</h4>
                  <p className="text-xs text-slate-500">Assemble modern database apps to wow global hiring squads.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
