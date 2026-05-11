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
    <section className="py-24 relative overflow-hidden hero-gradient">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-accent/20 blur-[100px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass-card border-border/50 p-10 md:p-14 rounded-3xl"
        >
          {/* Icon */}
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 gradient-btn shadow-[0_0_20px_rgba(45,212,191,0.3)]">
            <Mail className="w-8 h-8 text-white" />
          </motion.div>

          <motion.h2 variants={fadeUp} custom={0.1} className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4 tracking-tight">
            Stay Ahead of the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent drop-shadow-none">
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
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-foreground font-display font-bold text-xl">You're in! 🎉</p>
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
                    className="h-14 rounded-full bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary backdrop-blur-md px-6 text-base shadow-inner"
                  />
                  {error && (
                    <p className="absolute -bottom-6 left-4 text-red-400 text-xs font-bold">{error}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-14 rounded-full px-8 font-bold border-0 text-white shrink-0 gradient-btn shadow-lg group"
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
