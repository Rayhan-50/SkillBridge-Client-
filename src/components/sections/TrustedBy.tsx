"use client";

import { motion } from "framer-motion";
import { 
  Library, Microscope, Target, Monitor, BookOpen, 
  GraduationCap, Star, School, Bot, Globe 
} from "lucide-react";

const brands = [
  { name: "Harvard University", icon: School, color: "text-red-700" },
  { name: "MIT OpenCourseWare", icon: Microscope, color: "text-slate-600" },
  { name: "Google", icon: Target, color: "text-blue-500" },
  { name: "Microsoft", icon: Monitor, color: "text-sky-600" },
  { name: "Khan Academy", icon: Library, color: "text-emerald-600" },
  { name: "Coursera", icon: GraduationCap, color: "text-blue-600" },
  { name: "Stanford", icon: Star, color: "text-red-600" },
  { name: "Oxford", icon: BookOpen, color: "text-blue-800" },
  { name: "IBM", icon: Bot, color: "text-blue-700" },
  { name: "Meta", icon: Globe, color: "text-blue-500" },
];

const doubled = [...brands, ...brands];

export default function TrustedBy() {
  return (
    <section className="py-16 border-y border-slate-100 dark:border-emerald-950/20 bg-[#f8fafc] dark:bg-[#0a232f] overflow-hidden">
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-bold mb-10"
      >
        Trusted by learners from top institutions
      </motion.p>

      <div className="relative flex overflow-hidden group">
        <motion.div
          className="flex gap-8 whitespace-nowrap min-w-full"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            ease: "linear",
            duration: 30,
            repeat: Infinity,
          }}
        >
          {doubled.map((brand, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 237, 100, 0.05)" }}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl border border-slate-200 dark:border-emerald-950/40 bg-white dark:bg-[#0c2a37] shadow-sm transition-colors cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center ${brand.color}`}>
                <brand.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-display font-bold text-slate-700 dark:text-slate-200">
                {brand.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Fade edges */}
        <div className="absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-[#f8fafc] dark:from-[#0a232f] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-[#f8fafc] dark:from-[#0a232f] to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}