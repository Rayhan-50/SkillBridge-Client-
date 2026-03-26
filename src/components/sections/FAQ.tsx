"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 gradient-btn text-white border-0 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide">
            FAQ
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about SkillBridge. Can&apos;t find the answer? Contact us anytime.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-200"
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-base group-hover:text-primary transition-colors">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                    open === i ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  open === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
