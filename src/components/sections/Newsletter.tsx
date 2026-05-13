"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="py-24 bg-white dark:bg-[#001e2b] relative overflow-hidden border-b border-slate-100 dark:border-emerald-950/20">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-[#00ed64]/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-[#003d4f]/10 blur-[100px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,237,100,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,237,100,0.1) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass-card border-slate-200 dark:border-emerald-950/40 p-10 md:p-14 rounded-3xl"
        >
          {/* Icon */}
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 bg-emerald-50 dark:bg-emerald-950/40 shadow-[0_0_20px_rgba(0,237,100,0.2)] border border-[#00ed64]/20">
            <Mail className="w-8 h-8 text-[#00ed64]" />
          </motion.div>

          <motion.h2 variants={fadeUp} custom={0.1} className="text-3xl md:text-5xl font-display font-bold text-[#001e2b] dark:text-white mb-4 tracking-tight">
            Stay Ahead of the{" "}
            <span className="text-[#00ed64]">
              Curve
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={0.2} className="text-muted-foreground mb-10 text-lg leading-relaxed max-w-xl mx-auto">
            Get weekly learning tips, new tutor spotlights, and exclusive offers delivered straight to your inbox. Join 8,000+ learners already subscribed.
          </motion.p>

          <motion.div variants={fadeUp} custom={0.3}>
            {submitted ? (
              <div className="flex flex-col items-center gap-3 p-6 glass-card rounded-2xl bg-emerald-500/10 border-emerald-500/20 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-8 h-8 text-[#00ed64]" />
                </div>
                <p className="text-[#001e2b] dark:text-white font-display font-bold text-xl">You're in! 🎉</p>
                <p className="text-muted-foreground text-sm">
                  Thanks for subscribing. Check your inbox for a welcome email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="flex-1 relative">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className="h-14 rounded-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-emerald-950/40 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-[#00ed64] backdrop-blur-md px-6 text-base shadow-inner"
                  />
                  {error && (
                    <p className="absolute -bottom-6 left-4 text-red-400 text-xs font-bold">{error}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-14 rounded-full px-8 font-bold border-0 text-[#001e2b] bg-[#00ed64] hover:bg-[#00b545] shrink-0 shadow-lg group"
                >
                  Subscribe <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            )}
          </motion.div>

          <motion.p variants={fadeUp} custom={0.4} className="text-muted-foreground/40 text-xs font-bold uppercase tracking-wider mt-8">
            No spam. Unsubscribe anytime. We respect your privacy.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}