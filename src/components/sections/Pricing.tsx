import Link from "next/link";
import { CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";

const plans = [
  {
    name: "Starter",
    price: "$0",
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
    price: "$25",
    period: "per session",
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
    price: "$199",
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
  return (
    <section className="py-24 bg-muted/20 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge className="mb-4 gradient-btn text-white border-0 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide">
            Transparent Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, <span className="gradient-text">Honest</span> Pricing
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            No subscriptions traps. No hidden fees. Pay only for what you use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 transition-all duration-300 ${
                plan.highlighted
                  ? "border-primary shadow-xl shadow-primary/10 bg-card scale-[1.02]"
                  : "border-border/50 bg-card hover:shadow-lg hover:-translate-y-1"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 gradient-btn text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    <Zap className="w-3 h-3" /> {plan.badge}
                  </span>
                </div>
              )}

              <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-5">{plan.desc}</p>

              <div className="mb-6">
                <span className="text-4xl font-black">{plan.price}</span>
                <span className="text-sm text-muted-foreground ml-2">/ {plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full rounded-full font-semibold ${
                  plan.highlighted
                    ? "gradient-btn border-0 shadow-md text-white"
                    : ""
                }`}
                variant={plan.highlighted ? "default" : "outline"}
                asChild
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10">
          All session prices are set by individual tutors. Platform fees apply. No hidden charges.
        </p>
      </div>
    </section>
  );
}
