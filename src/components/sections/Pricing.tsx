"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: { monthly: 0, annual: 0 },
    period: "forever",
    desc: "Perfect for exploring the platform and booking your first session.",
    features: [
      "Browse all tutors",
      "1 free intro session",
      "Session history",
      "Basic support",
    ],
    cta: "Get Started Free",
    href: ROUTES.REGISTER,
    highlighted: false,
    badge: null,
  },
  {
    name: "Learner",
    price: { monthly: 25, annual: 240 },
    period: "per session / platform fee",
    desc: "For dedicated learners who want consistent 1-on-1 guidance.",
    features: [
      "All Starter features",
      "Unlimited session bookings",
      "Priority tutor matching",
      "Session recordings",
      "Leave & view reviews",
      "Priority support",
    ],
    cta: "Start Learning",
    href: ROUTES.REGISTER,
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Pro",
    price: { monthly: 199, annual: 1990 },
    period: "per month",
    desc: "Unlimited learning for professionals and serious students.",
    features: [
      "All Learner features",
      "Unlimited sessions / month",
      "Dedicated tutor matching",
      "Progress tracking dashboard",
      "Career guidance sessions",
      "24/7 premium support",
    ],
    cta: "Go Pro",
    href: ROUTES.REGISTER,
    highlighted: false,
    badge: null,
  },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="py-[96px] bg-white dark:bg-[#001e2b] relative overflow-hidden border-b border-slate-100 dark:border-emerald-950/20">
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] rounded-full bg-[#00ed64]/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-[64px]">
          <span className="inline-block mb-4 bg-[#00ed64]/10 text-emerald-800 dark:text-[#00ed64] px-4 py-1.5 rounded-full text-[13px] font-bold uppercase tracking-wide">
            Transparent Pricing
          </span>
          <h2 className="text-[#001e2b] dark:text-[#f8fafc] text-[28px] md:text-[40px] font-display font-bold leading-[1.2] mb-4">
            Simple, Honest Pricing
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-[16px] max-w-xl mx-auto mb-8">
            No subscription traps. No hidden fees. Pay only for what you use.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={cn("text-[16px] font-bold transition-colors", !isAnnual ? "text-[#001e2b] dark:text-[#f8fafc]" : "text-slate-500")}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-800 p-1 transition-colors hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
              aria-label="Toggle annual billing"
            >
              <motion.div
                className="w-6 h-6 rounded-full bg-[#00ed64] shadow-md"
                animate={{ x: isAnnual ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </button>
            <span className={cn("text-[16px] font-bold transition-colors", isAnnual ? "text-[#001e2b] dark:text-[#f8fafc]" : "text-slate-500")}>
              Annually <span className="text-[#00b545] dark:text-[#00ed64] text-[13px] ml-1 font-bold">(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn(
                "relative rounded-[16px] p-[32px] transition-all",
                plan.highlighted
                  ? "border-[2px] border-[#00ed64] bg-[#e3fcef] dark:bg-[#003d4f] shadow-[0_20px_40px_-15px_rgba(0,237,100,0.2)] md:-translate-y-4 md:hover:-translate-y-6 z-10"
                  : "border border-slate-200 dark:border-emerald-950/40 bg-white dark:bg-[#0c2a37] shadow-sm"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-[#00ed64] text-[#001e2b] text-[13px] font-bold px-4 py-1.5 rounded-full shadow-lg">
                    <Leaf className="w-[14px] h-[14px] fill-current" /> {plan.badge}
                  </span>
                </div>
              )}

              <h3 className={cn(
                "text-[20px] font-bold mb-2",
                plan.highlighted ? "text-[#001e2b] dark:text-[#f8fafc]" : "text-[#001e2b] dark:text-[#f8fafc]"
              )}>{plan.name}</h3>
              <p className={cn(
                "text-[13px] mb-6 min-h-[40px]",
                plan.highlighted ? "text-[#001e2b]/80 dark:text-slate-300" : "text-slate-500 dark:text-slate-400"
              )}>{plan.desc}</p>

              <div className="mb-8">
                <span className={cn(
                  "text-[40px] font-bold tracking-tight",
                  plan.highlighted ? "text-[#001e2b] dark:text-[#f8fafc]" : "text-[#001e2b] dark:text-[#f8fafc]"
                )}>
                  ${isAnnual ? plan.price.annual : plan.price.monthly}
                </span>
                <span className={cn(
                  "text-[13px] ml-2 font-medium",
                  plan.highlighted ? "text-[#001e2b]/80 dark:text-slate-300" : "text-slate-500"
                )}>/ {isAnnual ? "year" : plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className={cn(
                    "flex items-start gap-3 text-[16px] font-medium",
                    plan.highlighted ? "text-[#001e2b]/95 dark:text-slate-200" : "text-slate-600 dark:text-slate-300"
                  )}>
                    <CheckCircle2 className={cn(
                      "w-5 h-5 shrink-0 mt-0.5",
                      plan.highlighted ? "text-[#00b545] dark:text-[#00ed64]" : "text-[#00ed64]"
                    )} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full rounded-full h-[48px] text-[16px] font-bold hover:-translate-y-0.5 hover:shadow-lg active:scale-98 focus-visible:ring-2 focus-visible:ring-[#00ed64] transition-all border-0",
                  plan.highlighted
                    ? "bg-[#00ed64] text-[#001e2b] hover:bg-[#00b545]"
                    : "bg-transparent text-[#001e2b] dark:text-[#f8fafc] border border-slate-200 dark:border-emerald-950/40 hover:bg-slate-50 dark:hover:bg-[#001e2b]/10"
                )}
                asChild
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-[13px] text-slate-500 mt-[48px]">
          All session prices are set by individual tutors. Platform fees apply. No hidden charges.
        </p>
      </div>
    </section>
  );
}