"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Star, LayoutDashboard, Users, Calendar,
  TrendingUp, Settings, Leaf, Play, CheckCircle2, BookOpen, Lock, Flame, Sparkles, Bot
} from "lucide-react";
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
    <section className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden bg-white dark:bg-[#001e2b]">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#00ed64]/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#003d4f]/20 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center max-w-4xl w-full"
        >
          {/* Eyebrow label */}
          <motion.div variants={fadeUp} className="mb-6 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#00ed64]/20 bg-[#e3fcef] dark:bg-emerald-950/40 px-4 py-1.5 text-[13px] text-emerald-800 dark:text-[#00ed64] font-bold tracking-wide">
              <Star className="w-[14px] h-[14px] fill-current text-[#00ed64]" />
              #1 Platform for Expert Tutoring
            </span>
            <Link href="/ai-dashboard">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-[13px] text-violet-600 dark:text-violet-400 font-bold tracking-wide hover:bg-violet-500/20 transition-colors cursor-pointer">
                <Sparkles className="w-[14px] h-[14px] text-violet-500" />
                AI-Powered Lab Now Live
              </span>
            </Link>
          </motion.div>

          {/* Punchy Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-[#001e2b] dark:text-[#f8fafc] text-[40px] md:text-[56px] font-display font-bold leading-[1.1] tracking-[-0.02em] mb-6"
          >
            Shape Your Future with the <br className="hidden md:block" />
            <span className="text-[#00ed64]">Right Knowledge</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            variants={fadeUp}
            className="text-slate-600 dark:text-slate-300 text-[16px] md:text-[20px] max-w-2xl leading-[1.7] mb-10"
          >
            Discover a world of knowledge with our cutting-edge tutoring platform.
            Empower yourself to succeed in your career, passions, and personal growth journey.
          </motion.p>

          {/* Single Primary CTA */}
          <motion.div variants={fadeUp}>
            <Link href={ROUTES.REGISTER} tabIndex={-1}>
              <Button
                className="bg-[#00ed64] text-[#001e2b] hover:bg-[#00b545] rounded-full h-[48px] px-8 text-[16px] font-bold 
                           hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,237,100,0.4)] active:scale-98 
                           focus-visible:ring-2 focus-visible:ring-[#00ed64] focus-visible:outline-none transition-all group border-0"
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
          className="mt-16 w-full max-w-5xl rounded-[16px] border border-slate-200 dark:border-emerald-950/40 bg-white dark:bg-[#0c2a37] shadow-2xl overflow-hidden relative z-20"
        >
          {/* Browser Header */}
          <div className="h-12 border-b border-slate-200 dark:border-emerald-950/40 bg-slate-50 dark:bg-[#001e2b] flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500 truncate max-w-xs sm:max-w-md">
              dashboard.skillbridge.edu/session/current_view
            </div>
            <div className="w-14" /> {/* Spacer */}
          </div>

          {/* Browser Content - Premium interactive representation */}
          <div className="aspect-[16/10] sm:aspect-[16/9] bg-slate-50 dark:bg-[#001e2b] flex relative overflow-hidden text-left p-4 sm:p-6 gap-4 sm:gap-6">
            {/* Sidebar Left Component */}
            <div className="w-48 shrink-0 border-r border-slate-200/60 dark:border-emerald-950/20 pr-4 flex flex-col justify-between h-full hidden md:flex font-sans">
              <div className="space-y-6">
                {/* Logo Area */}
                <div className="flex items-center gap-2 px-2">
                  <Leaf className="h-5 w-5 text-[#00ed64] fill-current" />
                  <span className="font-display font-bold text-lg text-[#001e2b] dark:text-[#f8fafc]">SkillBridge</span>
                </div>
                {/* Navigation items */}
                <nav className="space-y-1">
                  <div className="flex items-center gap-3 text-xs font-bold text-[#00ed64] bg-[#00ed64]/10 rounded-full px-3.5 py-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Overview
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-emerald-950/20 rounded-full px-3.5 py-2 transition-colors cursor-pointer">
                    <Users className="w-4 h-4" />
                    Find Tutors
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-emerald-950/20 rounded-full px-3.5 py-2 transition-colors cursor-pointer">
                    <Calendar className="w-4 h-4" />
                    Sessions
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-emerald-950/20 rounded-full px-3.5 py-2 transition-colors cursor-pointer">
                    <TrendingUp className="w-4 h-4" />
                    Analytics
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-emerald-950/20 rounded-full px-3.5 py-2 transition-colors cursor-pointer">
                    <Settings className="w-4 h-4" />
                    Settings
                  </div>
                </nav>
              </div>

              {/* Account Card */}
              <div className="p-2 border border-slate-200/60 dark:border-emerald-950/30 rounded-2xl bg-white dark:bg-[#0c2a37]/50 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#00ed64] text-[#001e2b] text-xs font-bold flex items-center justify-center">
                  SJ
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#001e2b] dark:text-[#f8fafc] truncate">Sarah Johnson</div>
                  <div className="text-[10px] text-slate-400 truncate">Premium Learner</div>
                </div>
              </div>
            </div>

            {/* Main Application Content Area */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              {/* Top Banner Status */}
              <div className="flex justify-between items-center bg-white dark:bg-[#0c2a37]/40 border border-slate-200/60 dark:border-emerald-950/20 p-3 sm:p-4 rounded-2xl shadow-sm">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#001e2b] dark:text-[#f8fafc] flex items-center gap-1.5">
                    Welcome back, Sarah!
                  </h3>
                  <p className="text-[11px] text-slate-400 hidden sm:block">You have 1 class scheduled for today.</p>
                </div>
                {/* Connection Status Indicator */}
                <div className="inline-flex items-center gap-1.5 border border-[#00ed64]/30 bg-[#e3fcef] dark:bg-[#003d4f]/40 text-emerald-800 dark:text-[#00ed64] rounded-full px-3 py-1 text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ed64] animate-pulse" />
                  Atlas Cluster: Active
                </div>
              </div>

              {/* Inner Dashboard Layout Blocks - BENTO STYLE */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-1 min-h-0 overflow-y-auto pb-4 pr-1">
                
                {/* 1. Classroom Session (Main Hero Tile) */}
                <div className="md:col-span-8 bg-white dark:bg-[#0c2a37]/30 border border-slate-200/60 dark:border-emerald-950/20 p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden group min-h-[160px]">
                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-[9px] font-bold text-[#00ed64]">
                        <CheckCircle2 className="w-3 h-3" /> MongoDB Specialist
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">Starts in 10 mins</span>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Active Curriculum</h4>
                      <h2 className="text-base font-display font-bold text-[#001e2b] dark:text-[#f8fafc] leading-tight line-clamp-2">
                        Advanced Aggregation Framework & Custom Sharding
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 mt-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">AR</div>
                      <span className="text-[10px] text-slate-500">Alex Rivera</span>
                    </div>
                    <Button className="rounded-full h-8 bg-[#00ed64] text-[#001e2b] hover:bg-[#00b545] text-[10px] font-bold px-4 border-0">
                      Join Room
                    </Button>
                  </div>
                  <Leaf className="absolute -bottom-6 -right-6 w-20 h-20 text-[#00ed64]/5 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                </div>

                {/* 2. AI SMART RECOMMENDATION (Bento AI Tile) */}
                <div className="md:col-span-4 bg-violet-500/5 border border-violet-500/20 p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden group min-h-[160px]">
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                        <span className="text-[10px] font-bold text-violet-500 uppercase tracking-wider">AI Match</span>
                      </div>
                      <div className="px-1.5 py-0.5 rounded-md bg-violet-500 text-white text-[9px] font-bold">98%</div>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      "I've analyzed your sharding queries. You're ready for the <strong>Cluster Optimization</strong> lab."
                    </p>
                  </div>
                  <button className="relative z-10 w-full mt-2 py-2 rounded-xl bg-violet-500/10 text-violet-500 text-[10px] font-bold hover:bg-violet-500/20 transition-colors">
                    Start AI Path
                  </button>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 blur-2xl rounded-full -mr-10 -mt-10" />
                </div>

                {/* 3. Progress Tracker (Secondary Tile) */}
                <div className="md:col-span-4 bg-white dark:bg-[#0c2a37]/30 border border-slate-200/60 dark:border-emerald-950/20 p-4 rounded-2xl flex flex-col justify-between min-h-[140px]">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-foreground">
                      <BookOpen className="w-3.5 h-3.5 text-[#00ed64]" />
                      Study Progress
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-semibold">Completion</span>
                      <span className="font-bold text-[#00ed64]">78%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-emerald-950/30 overflow-hidden">
                      <div className="h-full bg-[#00ed64] rounded-full" style={{ width: "78%" }} />
                    </div>
                  </div>
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-[9px] text-slate-400">
                      <CheckCircle2 className="w-3 h-3 text-[#00ed64]" /> NoSQL Basics
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-foreground">
                      <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" /> Aggregation
                    </div>
                  </div>
                </div>

                {/* 4. AI CHAT MINI (Bento AI Tile) */}
                <div className="md:col-span-5 bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden group min-h-[140px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <span className="text-[10px] font-bold text-foreground">AI Assistant</span>
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="bg-white/50 dark:bg-black/20 p-2 rounded-lg rounded-tl-none border border-emerald-500/10">
                      <p className="text-[9px] text-slate-500">Need help with the sharding lab?</p>
                    </div>
                    <div className="bg-emerald-500/10 p-2 rounded-lg rounded-tr-none border border-emerald-500/20 ml-4">
                      <p className="text-[9px] font-medium">Explain chunk splitting...</p>
                    </div>
                  </div>
                  <div className="mt-2 h-7 bg-white dark:bg-black/20 rounded-lg border border-border flex items-center px-2">
                    <span className="text-[9px] text-slate-400">Type a message...</span>
                    <ArrowRight className="w-3 h-3 ml-auto text-slate-300" />
                  </div>
                </div>

                {/* 5. QUICK ANALYTICS (Small Bento Tile) */}
                <div className="md:col-span-3 bg-white dark:bg-[#0c2a37]/30 border border-slate-200/60 dark:border-emerald-950/20 p-4 rounded-2xl flex flex-col justify-center items-center text-center gap-1 min-h-[140px]">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-1">
                    <Flame className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                  </div>
                  <span className="text-xl font-display font-bold text-foreground">5</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Day Streak</span>
                </div>

              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}