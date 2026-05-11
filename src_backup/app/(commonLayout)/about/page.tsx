import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Zap, Target, Heart, Users, BookOpen, Award, Globe, Shield } from "lucide-react";

const team = [
  { name: "Dr. Sarah Chen", role: "Co-Founder & CEO", bio: "Former Stanford professor with 15 years in EdTech. Passionate about democratizing quality education worldwide.", initials: "SC", gradient: "from-blue-500 to-cyan-400" },
  { name: "Marcus Johnson", role: "Co-Founder & CTO", bio: "Built scalable learning platforms at Google and Coursera. Expert in AI-driven personalized learning systems.", initials: "MJ", gradient: "from-violet-500 to-purple-400" },
  { name: "Aisha Patel", role: "Head of Tutor Success", bio: "Formerly at Khan Academy, Aisha has onboarded over 5,000 educators and built world-class support programs.", initials: "AP", gradient: "from-emerald-500 to-teal-400" },
  { name: "Lucas Ferreira", role: "Head of Product", bio: "10+ years crafting user experiences for learning apps. Led product at Duolingo's B2B division.", initials: "LF", gradient: "from-amber-500 to-orange-400" },
];

const values = [
  { icon: Target, title: "Excellence First", desc: "Every tutor on SkillBridge passes a rigorous 7-step vetting process. We only accept the top 5% of applicants.", color: "text-blue-500" },
  { icon: Heart, title: "Student-Centered", desc: "Our entire platform is designed around the learner's success. Every feature is built with student outcomes in mind.", color: "text-rose-500" },
  { icon: Globe, title: "Globally Accessible", desc: "We believe world-class tutoring shouldn't be limited by geography or budget. Flexible pricing for every learner.", color: "text-emerald-500" },
  { icon: Shield, title: "Safe & Trusted", desc: "All sessions are protected. We verify identities, secure payments, and maintain a code of conduct.", color: "text-violet-500" },
];

const timeline = [
  { year: "2020", event: "Founded in a Stanford dorm room", desc: "Two professors frustrated by the lack of quality online tutoring decided to build the platform they wished existed." },
  { year: "2021", event: "First 100 tutors onboarded", desc: "Launched beta with 100 hand-picked expert tutors across 12 subjects. Achieved 4.9★ average rating from day one." },
  { year: "2022", event: "Seed funding & 10K students", desc: "Raised $3.5M seed round. Crossed 10,000 active students and expanded to 40+ subject categories." },
  { year: "2023", event: "International expansion", desc: "Launched in 25 countries. Crossed 1M sessions delivered. Introduced group sessions and recorded courses." },
  { year: "2024", event: "Series A & AI features", desc: "Closed $18M Series A. Launched AI-powered tutor matching and personalized learning path recommendations." },
  { year: "2025", event: "The future of learning", desc: "50,000+ active tutors, 500,000+ learners, and growing. Building the world's most trusted tutoring marketplace." },
];

const stats = [
  { value: "500K+", label: "Active Students", icon: Users },
  { value: "50K+", label: "Expert Tutors", icon: Award },
  { value: "1M+", label: "Sessions Delivered", icon: BookOpen },
  { value: "25+", label: "Countries Served", icon: Globe },
];

export default function AboutPage() {
  return (
    <>
        <section className="relative py-24 md:py-32 hero-gradient overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 orb-teal opacity-30" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 orb-purple opacity-20" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full border border-primary/20 mb-8">
              <Zap className="w-4 h-4" /> Our Story
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black mb-6 tracking-tight">
              We&apos;re on a mission to make<br />
              <span className="gradient-text">world-class tutoring</span> for everyone
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              SkillBridge was born from a simple belief: every person deserves access to expert guidance, regardless of where they live or how much money they have. We connect passionate learners with exceptional tutors — one session at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="rounded-full gradient-btn border-0 px-8 h-12 font-bold text-base shadow-xl">
                <Link href={ROUTES.TUTORS}>Find a Tutor</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-8 h-12 font-bold text-base glass-card border-border/50">
                <Link href={ROUTES.REGISTER}>Become a Tutor</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-card border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center group">
                  <div className="w-12 h-12 rounded-2xl gradient-btn mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:-translate-y-1 transition-transform">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-display font-black gradient-text mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <SectionHeader
              label="What We Stand For"
              title={<>Our Core <span className="gradient-text">Values</span></>}
              subtitle="Everything we build is guided by four principles that never change."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
              {values.map((v) => (
                <div key={v.title} className="glass-card rounded-3xl p-8 group hover:shadow-xl transition-all duration-300">
                  <div className={`w-12 h-12 rounded-2xl bg-current/10 flex items-center justify-center mb-6 ${v.color} group-hover:scale-110 transition-transform`}>
                    <v.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-3">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 bg-card border-y border-border/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <SectionHeader
              label="Our Journey"
              title={<>The <span className="gradient-text">SkillBridge</span> Story</>}
              subtitle="From a dorm-room idea to a global EdTech platform — here's how we got here."
            />
            <div className="mt-16 max-w-3xl mx-auto">
              {timeline.map((item, i) => (
                <div key={item.year} className="flex gap-6 md:gap-10 mb-12 last:mb-0 group">
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl gradient-btn flex items-center justify-center text-white font-display font-black text-sm shrink-0 shadow-lg group-hover:-translate-y-1 transition-transform">{item.year}</div>
                    {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/40 to-transparent mt-4" />}
                  </div>
                  <div className="pb-12 last:pb-0 pt-2">
                    <h3 className="font-display font-bold text-lg mb-2 text-foreground">{item.event}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <SectionHeader
              label="The People Behind SkillBridge"
              title={<>Meet Our <span className="gradient-text">Team</span></>}
              subtitle="We're educators, engineers, and lifelong learners on a mission to transform tutoring."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
              {team.map((member) => (
                <div key={member.name} className="glass-card rounded-3xl p-8 text-center group hover:-translate-y-2 transition-all duration-300">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-2xl font-display font-black mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                    {member.initials}
                  </div>
                  <h3 className="font-display font-bold text-lg mb-1">{member.name}</h3>
                  <p className="text-xs text-primary font-bold uppercase tracking-wider mb-4">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 hero-gradient border-t border-border/50 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 blur-[100px] pointer-events-none" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-display font-black mb-6">
              Ready to join the <span className="gradient-text">SkillBridge</span> community?
            </h2>
            <p className="text-muted-foreground mb-10 text-lg max-w-xl mx-auto">Whether you&apos;re here to learn or to teach, we have a place for you.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="rounded-full gradient-btn border-0 px-10 h-12 font-bold text-base shadow-xl">
                <Link href={ROUTES.REGISTER}>Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-10 h-12 font-bold text-base glass-card border-border/50">
                <Link href={ROUTES.CONTACT}>Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
    </>
  );
}
