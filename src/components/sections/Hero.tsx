"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, ChevronDown, Star, Zap, Users, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import {
  fadeUp,
  slideLeft,
  slideRight,
  staggerContainer,
} from "@/lib/animations";

// Dynamic import: prevents SSR crash for WebGL canvas
const Hero3DScene = dynamic(() => import("./Hero3DScene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

// ─── Fallback while 3D loads ───────────────────────────────────────────────────
function SceneFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-56 h-56">
        {/* Animated placeholder orbs */}
        <div className="absolute inset-0 rounded-full bg-indigo-600/20 animate-ping" />
        <div className="absolute inset-4 rounded-full bg-violet-600/20 animate-pulse" />
        <div className="absolute inset-8 rounded-full bg-cyan-600/20 animate-ping [animation-delay:0.5s]" />
        <div className="absolute inset-[50%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-indigo-500 animate-pulse" />
      </div>
    </div>
  );
}

// ─── Stat mini-chip ────────────────────────────────────────────────────────────
interface StatChipProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
  delay: number;
}

function StatChip({ icon: Icon, label, value, color, delay }: StatChipProps) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-white/50 text-xs">{label}</p>
        <p className="text-white font-bold text-sm">{value}</p>
      </div>
    </motion.div>
  );
}

// ─── Scroll indicator ──────────────────────────────────────────────────────────
function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.8, duration: 0.6 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
    >
      <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-5 h-5 text-white/30" />
      </motion.div>
    </motion.div>
  );
}

// ─── Main Hero Component ───────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0f0c29 0%, #1a1040 30%, #0d1842 60%, #0a0f2e 100%)",
      }}
    >
      {/* ── Background decorations ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,.8) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(99,102,241,.8) 1px, transparent 1px)`,
            backgroundSize: "52px 52px",
          }}
        />
        {/* Radial glows */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[100px]" />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full bg-cyan-500/8 blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-screen py-24">

          {/* ── LEFT: Text & CTAs ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} custom={0}>
              <motion.span
                animate={{
                  boxShadow: [
                    "0 0 0px 0px rgba(99,102,241,0)",
                    "0 0 20px 6px rgba(99,102,241,0.35)",
                    "0 0 0px 0px rgba(99,102,241,0)",
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300 font-medium backdrop-blur-sm"
              >
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                #1 Platform for Expert Tutoring
              </motion.span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={slideLeft}
              custom={0.1}
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight"
            >
              <span className="text-white">Master Any</span>
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #818cf8 0%, #a78bfa 40%, #22d3ee 100%)",
                }}
              >
                Skill
              </span>{" "}
              <span className="text-white">with</span>
              <br />
              <span className="text-white">Expert</span>{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #f472b6 0%, #a78bfa 60%, #818cf8 100%)",
                }}
              >
                Tutors
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={fadeUp}
              custom={0.25}
              className="text-white/60 text-lg md:text-xl max-w-lg leading-relaxed"
            >
              Personalized 1-on-1 sessions with world-class educators. Flexible
              scheduling, verified experts, and measurable results — all in one
              platform.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              custom={0.4}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              {/* Primary CTA */}
              <Button
                size="lg"
                className="relative group rounded-full px-8 py-4 text-base font-semibold border-0 text-white overflow-hidden shadow-lg shadow-indigo-500/30"
                style={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)",
                }}
                asChild
              >
                <Link href={ROUTES.REGISTER}>
                  <span className="relative z-10 flex items-center gap-2">
                    Start Learning Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {/* Hover shimmer */}
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                </Link>
              </Button>

              {/* Secondary CTA — Watch Demo */}
              <Button
                size="lg"
                variant="ghost"
                className="group rounded-full px-8 py-4 text-base font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 backdrop-blur-sm"
              >
                <Play className="w-4 h-4 mr-2 fill-white group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Mini stat chips */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-3 pt-2"
            >
              <StatChip
                icon={Users}
                label="Students"
                value="12,400+"
                color="bg-indigo-500/30"
                delay={0.55}
              />
              <StatChip
                icon={Star}
                label="Avg Rating"
                value="4.9 / 5.0"
                color="bg-yellow-500/30"
                delay={0.65}
              />
              <StatChip
                icon={Zap}
                label="Live Now"
                value="340 Sessions"
                color="bg-cyan-500/30"
                delay={0.75}
              />
            </motion.div>
          </motion.div>

          {/* ── RIGHT: 3D Scene ── */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="relative h-[480px] lg:h-[640px] w-full"
          >
            {/* Scene glow backdrop */}
            <div className="absolute inset-0 rounded-3xl bg-indigo-600/5 backdrop-blur-sm" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-indigo-500/10 blur-[60px] pointer-events-none" />

            {/* 3D canvas — hidden on very small screens, shown md+ */}
            <div className="hidden sm:block w-full h-full">
              <Suspense fallback={<SceneFallback />}>
                <Hero3DScene />
              </Suspense>
            </div>

            {/* Mobile fallback — simple animated orbs */}
            <div className="sm:hidden absolute inset-0 flex items-center justify-center">
              <SceneFallback />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  );
}
