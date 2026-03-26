import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import TrustedBy from "@/components/sections/TrustedBy";
import WhySkillBridge from "@/components/sections/WhySkillBridge";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import Newsletter from "@/components/sections/Newsletter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search, Star, BookOpen, Users, ShieldCheck,
    CheckCircle2, ArrowRight, GraduationCap, Clock, Zap,
} from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TutorProfile, Review } from "@/types";
import Image from "next/image";
import { getCategories } from "@/lib/actions/category.actions";
import { CategoriesCarousel } from "@/components/categories/CategoriesCarousel";

async function getTopTutors(): Promise<TutorProfile[]> {
  try {
    const res = await fetch(`https://skillbridge-server-nu.vercel.app/api/tutors?limit=3`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("Failed to fetch top tutors", err);
    return [];
  }
}

async function getTutorReviews(tutorId: string): Promise<Review[]> {
  try {
    const res = await fetch(`https://skillbridge-server-nu.vercel.app/api/reviews/${tutorId}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error(`Failed to fetch reviews for tutor ${tutorId}`, err);
    return [];
  }
}

export default async function Home() {
  const [topTutors, categories] = await Promise.all([
    getTopTutors(),
    getCategories()
  ]);

  let actualReviews: Review[] = [];
  if (topTutors.length > 0) {
    const reviewsPromises = topTutors.map((t) => getTutorReviews(t.userId));
    const reviewsArrays = await Promise.all(reviewsPromises);
    actualReviews = reviewsArrays.flat().slice(0, 3);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">

        {/* ─────────────────────────── HERO ─────────────────────────── */}
        <Hero />

        {/* ─────────────────────────── TRUSTED BY ────────────────────── */}
        <TrustedBy />

        {/* ─────────────────────────── STATS BAR ─────────────────────── */}
        <section className="bg-white dark:bg-gray-900 border-y border-border/50 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "500+", label: "Expert Tutors" },
                { value: "12K+", label: "Students Taught" },
                { value: "98%", label: "Satisfaction Rate" },
                { value: "50+", label: "Subjects Covered" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────── WHY SKILLBRIDGE ─────────────── */}
        <WhySkillBridge />

        {/* ─────────────────────────── CATEGORIES ────────────────────── */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <Badge className="mb-4 gradient-btn text-white border-0 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide">
                Browse by Subject
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Explore <span className="gradient-text">Top Categories</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                From academic studies to professional skills — we have world-class tutors across every field.
              </p>
            </div>

            <CategoriesCarousel categories={categories} />

            <div className="text-center mt-10">
              <Button variant="outline" asChild className="rounded-full px-8">
                <Link href={ROUTES.CATEGORIES}>View All Categories</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ─────────────────────────── FEATURED TUTORS ───────────────── */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-14">
              <div>
                <Badge className="mb-4 gradient-btn text-white border-0 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide">
                  Top Educators
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  Featured <span className="gradient-text">Tutors</span>
                </h2>
                <p className="text-muted-foreground">Learn from the highest-rated educators on our platform.</p>
              </div>
              <Button variant="ghost" className="mt-4 md:mt-0 rounded-full" asChild>
                <Link href={ROUTES.TUTORS}>See all tutors <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topTutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="group rounded-2xl border border-border/50 bg-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Gradient header stripe */}
                  <div className="h-2 w-full gradient-btn" />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                            <AvatarImage src={tutor.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.user?.name || "Tutor")}&background=0ea5e9&color=fff`} alt={tutor.user?.name || "Tutor"} />
                            <AvatarFallback className="gradient-btn text-white font-bold">{tutor.user?.name?.[0] || "T"}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base">{tutor.user?.name || "Expert Tutor"}</h3>
                          <p className="text-sm text-muted-foreground">{tutor.categories?.[0]?.name || "Specialist"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200/50 dark:border-yellow-700/30 rounded-full px-2.5 py-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                          {tutor.rating?.toFixed(1) || "New"}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {tutor.bio || "Passionate educator ready to share knowledge and help you achieve your learning goals."}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {tutor.categories?.slice(0, 3).map((cat) => (
                        <span
                          key={cat.id}
                          className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 font-medium"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div>
                        <span className="text-xl font-bold">${tutor.hourlyRate || 0}</span>
                        <span className="text-sm text-muted-foreground">/hr</span>
                      </div>
                      <Button size="sm" className="rounded-full gradient-btn border-0 shadow-sm" asChild>
                        <Link href={`${ROUTES.TUTORS}/${tutor.userId || tutor.user?.id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {topTutors.length === 0 && (
                <div className="col-span-1 md:col-span-3 text-center py-16 text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No tutors yet. Be the first to join as a tutor!</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─────────────────────────── PRICING ────────────────────── */}
        <Pricing />

        {/* ─────────────────────────── HOW IT WORKS ──────────────────── */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <Badge className="mb-4 gradient-btn text-white border-0 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide">
                Simple Process
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                How <span className="gradient-text">SkillBridge</span> Works
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { step: "01", title: "Find Your Tutor", desc: "Browse hundreds of verified tutors by subject, rating, and availability.", icon: Search },
                { step: "02", title: "Book a Session", desc: "Pick a date & time that works for you. Instant confirmation.", icon: Clock },
                { step: "03", title: "Start Learning", desc: "Join your 1-on-1 session and start achieving your goals.", icon: Zap },
              ].map((s) => (
                <div key={s.step} className="relative text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-btn shadow-lg mb-5 group-hover:scale-110 transition-transform">
                    <s.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 text-5xl font-black text-primary/10 leading-none select-none">{s.step}</div>
                  <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────── TESTIMONIALS ──────────────────── */}
        <section className="py-24 hero-gradient">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                What Our <span className="gradient-text">Students Say</span>
              </h2>
              <p className="text-white/60 max-w-xl mx-auto">Real stories from real learners who transformed their skills with SkillBridge.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {actualReviews.map((review) => (
                <div key={review.id} className="glass-card p-6 rounded-2xl">
                  <div className="flex text-yellow-400 mb-4">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className={`w-4 h-4 ${idx < (review.rating || 5) ? "fill-current" : "text-white/20"}`} />
                    ))}
                  </div>
                  <p className="text-white/80 leading-relaxed mb-5 text-sm">"{review.comment}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 ring-2 ring-white/20">
                      <AvatarImage src={review.student?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.student?.name || "S")}&background=7c3aed&color=fff`} />
                      <AvatarFallback className="gradient-btn text-white text-xs font-bold">{review.student?.name?.[0] || "S"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-semibold text-white">{review.student?.name || "Student"}</div>
                      <div className="text-xs text-white/50">Student of {review.tutor?.user?.name || "Expert Tutor"}</div>
                    </div>
                  </div>
                </div>
              ))}
              {actualReviews.length === 0 && (
                <div className="col-span-1 md:col-span-3 text-center py-10 text-white/50">
                  Be the first to leave a review!
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─────────────────────────── FAQ ─────────────────────────── */}
        <FAQ />

        {/* ─────────────────────────── NEWSLETTER ─────────────────────── */}
        <Newsletter />

        {/* ─────────────────────────── CTA BANNER ────────────────────── */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start <span className="gradient-text">Learning?</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of students already learning with expert tutors on SkillBridge.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="rounded-full gradient-btn border-0 shadow-xl px-8 font-semibold" asChild>
                  <Link href={ROUTES.REGISTER}>Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                  <Link href={ROUTES.TUTORS}>Browse Tutors</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
