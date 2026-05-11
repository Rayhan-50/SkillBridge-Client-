"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden bg-[#f8fafc] dark:bg-[#0f172a]">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#6366f1]/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#6366f1]/5 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center max-w-4xl w-full"
        >
          {/* Eyebrow label */}
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-flex items-center gap-2 rounded-[999px] border border-[#6366f1]/20 bg-[#6366f1]/10 px-4 py-1.5 text-[13px] text-[#6366f1] font-bold tracking-wide">
              <Star className="w-[14px] h-[14px] fill-current" />
              #1 Platform for Expert Tutoring
            </span>
          </motion.div>

          {/* Punchy Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-[#0f172a] dark:text-[#f8fafc] text-[40px] md:text-[56px] font-medium leading-[1.1] tracking-[-0.02em] mb-6"
          >
            Shape Your Future with the <br className="hidden md:block" />
            <span className="text-[#6366f1]">Right Knowledge</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            variants={fadeUp}
            className="text-slate-600 dark:text-slate-400 text-[16px] md:text-[20px] max-w-2xl leading-[1.7] mb-10"
          >
            Discover a world of knowledge with our cutting-edge tutoring platform. 
            Empower yourself to succeed in your career, passions, and personal growth journey.
          </motion.p>

          {/* Single Primary CTA */}
          <motion.div variants={fadeUp}>
            <Link href={ROUTES.REGISTER} tabIndex={-1}>
              <Button
                className="bg-[#6366f1] text-white hover:bg-[#6366f1]/90 rounded-[8px] h-[48px] px-8 text-[16px] font-medium 
                           hover:-translate-y-0.5 hover:shadow-lg active:scale-98 
                           focus-visible:ring-2 focus-visible:ring-[#6366f1] focus-visible:outline-none transition-all group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Product Screenshot in Browser Frame */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.4 }}
          className="mt-16 w-full max-w-5xl rounded-[16px] border border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-[#0f172a] shadow-2xl overflow-hidden relative z-20"
        >
          {/* Browser Header */}
          <div className="h-12 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          
          {/* Browser Content - Placeholder */}
          <div className="aspect-[16/9] bg-slate-100 dark:bg-[#0f172a] flex items-center justify-center relative overflow-hidden">
            {/* Abstract UI representation */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800" />
            <div className="absolute top-8 left-8 right-8 bottom-8 rounded-[12px] bg-white dark:bg-[#0f172a] shadow-sm border border-slate-200 dark:border-slate-800 p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="w-48 h-8 rounded-[8px] bg-slate-100 dark:bg-slate-800" />
                <div className="w-12 h-12 rounded-full bg-[#6366f1]/20" />
              </div>
              <div className="flex gap-6 h-full">
                <div className="w-64 shrink-0 rounded-[12px] bg-slate-100 dark:bg-slate-800 h-full hidden md:block" />
                <div className="flex-1 flex flex-col gap-6">
                  <div className="h-32 rounded-[12px] bg-slate-100 dark:bg-slate-800" />
                  <div className="flex-1 rounded-[12px] bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
