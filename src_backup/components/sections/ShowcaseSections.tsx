"use client";

import { motion, type Variants } from "framer-motion";
import { CheckCircle2, BookOpen, Code2, Briefcase } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function ClassroomShowcase() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]/60 shadow-xl"
    >
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Live Classroom</h3>
            <p className="text-white/70 text-sm">Interactive 1-on-1 session</p>
          </div>
        </div>
        <div className="flex gap-2">
          {["Math", "Physics", "Chemistry"].map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="p-6 space-y-4">
        {[
          { title: "Real-time Whiteboard", desc: "Collaborate on problems live with your tutor." },
          { title: "Session Recordings", desc: "Revisit lessons anytime after class." },
          { title: "Progress Tracking", desc: "Monitor improvements across every session." },
        ].map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{item.title}</h4>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function CareerShowcase() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]/60 shadow-xl"
    >
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Career Coaching</h3>
            <p className="text-white/70 text-sm">Land your dream job</p>
          </div>
        </div>
        <div className="flex gap-2">
          {["Interview Prep", "Resume", "Coding"].map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="p-6 space-y-4">
        {[
          { title: "Mock Interview Practice", desc: "Train with live tech coding tests and system mock sessions." },
          { title: "Active Portfolio Building", desc: "Assemble modern apps to wow global hiring squads." },
          { title: "Resume & LinkedIn Review", desc: "Get expert feedback on your professional profile." },
        ].map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#00ed64] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{item.title}</h4>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
