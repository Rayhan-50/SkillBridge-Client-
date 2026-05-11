"use client";

import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { SectionHeader } from "../ui/section-header";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "How do I find the right tutor for me?",
    a: "Browse tutors by subject, filter by hourly rate, rating, and availability. Each tutor has a full profile with bio, subjects, experience, and reviews from past students. You can also book a free intro session to see if the fit is right before committing.",
  },
  {
    q: "What happens after I book a session?",
    a: "After booking, your request goes to the tutor who will confirm it. Once confirmed, you'll see the session in your dashboard. After the session is marked as completed, you can leave a review.",
  },
  {
    q: "Can I cancel or reschedule a booking?",
    a: "Yes. You can cancel a pending booking from your dashboard before the tutor confirms it. For confirmed sessions, please contact the tutor directly to reschedule. We recommend cancelling at least 24 hours in advance.",
  },
  {
    q: "How are tutors verified on SkillBridge?",
    a: "Every tutor goes through a profile review and subject verification process before being approved. Student reviews and ratings are publicly visible to maintain ongoing quality standards.",
  },
  {
    q: "Is my payment information secure?",
    a: "Absolutely. All sessions and transactions are handled securely. We never store raw payment information on our servers. Your data is encrypted and protected at all times.",
  },
  {
    q: "Can I become a tutor on SkillBridge?",
    a: "Yes! Register with the Tutor role, complete your profile with your bio, subjects, and hourly rate, and set your availability. Students will be able to find and book you immediately.",
  },
  {
    q: "What subjects are available?",
    a: "We cover Mathematics, Programming, Sciences, Languages, Arts, Business, Test Preparation, and many more. New categories are regularly added based on demand.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white dark:bg-[#001e2b] relative overflow-hidden border-b border-slate-100 dark:border-emerald-950/20">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00ed64]/20 to-transparent" />
      <div className="absolute bottom-1/2 right-0 w-[500px] h-[500px] bg-[#003d4f]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          label="FAQ"
          title={
            <>Frequently Asked <span className="text-[#00ed64]">Questions</span></>
          }
          subtitle="Everything you need to know about SkillBridge. Can't find the answer? Contact us anytime."
        />

        <div className="max-w-3xl mx-auto space-y-4 mt-16">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-300 glass-card overflow-hidden ${
                open === i ? "border-[#00ed64]/50 shadow-[0_0_20px_rgba(0,237,100,0.15)] bg-[#00ed64]/5" : "border-slate-200 dark:border-emerald-950/40 hover:border-[#00ed64]/30"
              }`}
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group cursor-pointer"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className={`w-5 h-5 transition-colors duration-300 hidden sm:block ${open === i ? "text-[#00ed64]" : "text-slate-500 group-hover:text-[#00ed64]/50"}`} />
                  <span className={`font-display font-bold text-lg transition-colors duration-300 ${open === i ? "text-[#00b545] dark:text-[#00ed64]" : "text-slate-800 dark:text-slate-200 group-hover:text-[#00b545] dark:group-hover:text-[#00ed64]/80"}`}>
                    {faq.q}
                  </span>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${open === i ? "bg-[#00ed64]/20 text-[#00ed64]" : "bg-slate-100 dark:bg-emerald-950/20 text-slate-500 group-hover:bg-[#00ed64]/10 group-hover:text-[#00ed64]"}`}>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 pt-2 text-slate-600 dark:text-slate-300 leading-relaxed pl-6 sm:pl-14">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
