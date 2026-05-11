import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import TrustedBy from "@/components/sections/TrustedBy";
import WhySkillBridge from "@/components/sections/WhySkillBridge";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import Newsletter from "@/components/sections/Newsletter";
import StatsBar from "@/components/sections/StatsBar";
import HowItWorks from "@/components/sections/HowItWorks";
import Testimonials from "@/components/sections/Testimonials";
import CTABanner from "@/components/sections/CTABanner";
import { ClassroomShowcase, CareerShowcase } from "@/components/sections/ShowcaseSections";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TutorProfile, Review } from "@/types";
import { TutorCard } from "@/components/modules/TutorCard";
import { getCategories } from "@/lib/actions/category.actions";
import { CategoriesCarousel } from "@/components/categories/CategoriesCarousel";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

async function getTopTutors(): Promise<TutorProfile[]> {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
    
    // Use a longer timeout for build time or flaky connections
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(`${backendUrl}/api/tutors?limit=3`, {
      next: { revalidate: 10 },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));
    
    if (!res.ok) {
      console.warn(`[BUILD] Top tutors fetch failed with status: ${res.status}`);
      return [];
    }
    
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn(`[BUILD] Top tutors endpoint returned non-JSON response: ${contentType}`);
      return [];
    }

    const json = await res.json();
    return json.data || [];
  } catch (err: any) {
    // Silently handle aborts or connection errors during build
    if (err.name === 'AbortError') {
      console.warn("[BUILD] Top tutors fetch timed out");
    } else {
      console.warn("[BUILD] Failed to fetch top tutors:", err.message);
    }
    return [];
  }
}

async function getTutorReviews(tutorId: string): Promise<Review[]> {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${backendUrl}/api/reviews/${tutorId}`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err: any) {
    console.warn(`[BUILD] Failed to fetch reviews for tutor ${tutorId}:`, err.message);
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
    actualReviews = reviewsArrays.flat().slice(0, 10);
  }

  return (
    <div className="flex min-h-screen flex-col selection:bg-primary/30 selection:text-primary">
      <Navbar />

      <main className="flex-1 relative overflow-hidden">
        <Hero />
        <TrustedBy />
        <StatsBar />
        <WhySkillBridge />

        {/* Premium Lifestyle Showcase Sections */}
        <ClassroomShowcase />
        <CareerShowcase />

        {/* ─────────────────────────── CATEGORIES ────────────────────── */}
        <section className="py-24 bg-background relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <SectionHeader
              label="Browse by Subject"
              title={<>Explore <span className="gradient-text">Top Categories</span></>}
              subtitle="From academic studies to professional skills — we have world-class tutors across every field."
            />

            <div className="mt-12">
              <CategoriesCarousel categories={categories} />
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" asChild className="rounded-full px-8 glass-card hover:bg-primary/5 border-border/50 h-12">
                <Link href={ROUTES.CATEGORIES}>View All Categories</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ─────────────────────────── FEATURED TUTORS ───────────────── */}
        <section className="py-24 bg-card border-y border-border/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-14">
              <div className="text-left">
                <SectionHeader
                  centered={false}
                  label="Top Educators"
                  title={<>Featured <span className="gradient-text">Tutors</span></>}
                  subtitle="Learn from the highest-rated educators on our platform."
                  className="mb-0"
                />
              </div>
              <Button variant="ghost" className="mt-6 md:mt-0 rounded-full hover:bg-primary/10 hover:text-primary transition-colors group" asChild>
                <Link href={ROUTES.TUTORS}>See all tutors <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {topTutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} ctaText="Book Session" />
              ))}
              {topTutors.length === 0 && (
                <div className="col-span-1 md:col-span-3 text-center py-20 text-muted-foreground glass-card rounded-3xl border-dashed">
                  <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-2">No tutors found</h3>
                  <p>Be the first to join as a tutor on SkillBridge!</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <Pricing />
        <HowItWorks />
        {actualReviews.length >= 5 && <Testimonials reviews={actualReviews} />}
        <FAQ />
        <Newsletter />
        <CTABanner />

      </main>

      <Footer />
    </div>
  );
}
