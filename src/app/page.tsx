import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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
  const topTutors = await getTopTutors();

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
        <section className="relative overflow-hidden hero-gradient min-h-[92vh] flex items-center">
          {/* Ambient orbs */}
          <div className="absolute top-1/4 -left-32 w-96 h-96 orb-teal" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 orb-purple" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] orb-purple opacity-30" />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">

              {/* Left — text */}
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-white/10 backdrop-blur-sm border border-primary/20 dark:border-white/20 rounded-full px-4 py-2 mb-6">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-foreground dark:text-white/90 font-medium">#1 Platform for Expert Tutoring</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground dark:text-white leading-tight mb-6">
                  Learn Faster with{" "}
                  <span className="gradient-text">Expert Tutors</span>{" "}
                  Built For You
                </h1>

                <p className="text-lg text-muted-foreground dark:text-white/70 max-w-lg mb-10 leading-relaxed">
                  Master any subject with personalized 1-on-1 sessions from world-class educators. Flexible scheduling, verified experts, real results.
                </p>

                {/* Search bar */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-xl mb-10">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="What do you want to learn?"
                      className="pl-12 h-13 text-base rounded-full bg-white dark:bg-white/10 border-border dark:border-white/20 dark:text-white dark:placeholder:text-white/50 backdrop-blur-sm focus-visible:ring-primary"
                    />
                  </div>
                  <Button
                    size="lg"
                    className="h-13 rounded-full px-8 text-base gradient-btn border-0 shadow-xl font-semibold shrink-0"
                    asChild
                  >
                    <Link href={ROUTES.TUTORS}>Find Tutors <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-5 text-sm text-muted-foreground dark:text-white/70">
                  {["500+ Verified Experts", "Flexible Scheduling", "Secure Payments"].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — hero illustration */}
              <div className="relative hidden lg:flex items-center justify-center">
                {/* Glow behind image */}
                <div className="absolute inset-0 orb-teal scale-75" />
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-white/10 w-full max-w-md">
                  <Image
                    src="/hero-illustration.png"
                    alt="Student learning with a tutor online"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>

                {/* Floating UI chips */}
                <div className="absolute -top-4 -left-8 bg-white dark:bg-white/10 dark:backdrop-blur-md border border-border dark:border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
                  <div className="w-9 h-9 rounded-full gradient-btn flex items-center justify-center shrink-0">
                    <GraduationCap className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground dark:text-white/60">Students</p>
                    <p className="font-bold text-foreground dark:text-white text-sm">12,400+</p>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-8 bg-white dark:bg-white/10 dark:backdrop-blur-md border border-border dark:border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
                  <div className="w-9 h-9 rounded-full bg-yellow-100 dark:bg-yellow-400/20 flex items-center justify-center shrink-0">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground dark:text-white/60">Avg Rating</p>
                    <p className="font-bold text-foreground dark:text-white text-sm">4.9 / 5.0</p>
                  </div>
                </div>

                <div className="absolute top-1/2 -translate-y-1/2 -right-10 bg-white dark:bg-white/10 dark:backdrop-blur-md border border-border dark:border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl">
                  <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-400/20 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-purple-500 dark:text-purple-300" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground dark:text-white/60">Sessions Today</p>
                    <p className="font-bold text-foreground dark:text-white text-sm">340 Live</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { title: "Mathematics", icon: BookOpen, desc: "Calculus, Algebra, Geometry", count: 124, color: "from-teal-500 to-cyan-400" },
                { title: "Programming", icon: Zap, desc: "React, Python, Node.js", count: 342, color: "from-violet-500 to-purple-400" },
                { title: "Languages", icon: Users, desc: "English, Spanish, French", count: 215, color: "from-pink-500 to-rose-400" },
                { title: "Sciences", icon: ShieldCheck, desc: "Physics, Chemistry, Bio", count: 189, color: "from-amber-500 to-orange-400" },
              ].map((cat, i) => (
                <Link
                  key={i}
                  href={`${ROUTES.TUTORS}?category=${cat.title.toLowerCase()}`}
                  className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                >
                  <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color} shadow-md group-hover:scale-110 transition-transform`}>
                    <cat.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{cat.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold gradient-text">{cat.count} Tutors</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button variant="outline" asChild className="rounded-full px-8">
                <Link href={ROUTES.TUTORS}>View All Categories</Link>
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
