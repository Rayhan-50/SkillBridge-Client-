"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <section
      className="py-20 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #0d1842 100%)",
      }}
    >
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-violet-600/10 blur-[80px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,.8) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(99,102,241,.8) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            <Mail className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Ahead of the{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #818cf8, #22d3ee)" }}
            >
              Curve
            </span>
          </h2>
          <p className="text-white/60 mb-10 text-base leading-relaxed">
            Get weekly learning tips, new tutor spotlights, and exclusive offers delivered straight to your inbox. Join 8,000+ learners already subscribed.
          </p>

          {submitted ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-white font-semibold text-lg">You&apos;re in! 🎉</p>
              <p className="text-white/50 text-sm">
                Thanks for subscribing. Check your inbox for a welcome email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className="h-12 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-indigo-500 backdrop-blur-sm"
                />
                {error && (
                  <p className="text-red-400 text-xs mt-2 text-left pl-4">{error}</p>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 rounded-full px-6 font-semibold border-0 text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
              >
                Subscribe <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}

          <p className="text-white/30 text-xs mt-5">
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
}
