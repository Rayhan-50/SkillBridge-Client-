"use client";

import { motion, Variants } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";

const posts = [
  {
    slug: "how-to-choose-right-tutor",
    category: "Learning Tips",
    categoryColor: "bg-indigo-50 dark:bg-indigo-500/10 text-[#6366f1]",
    title: "How to Choose the Right Tutor for Your Learning Style",
    excerpt: "Selecting the right tutor is more than just checking credentials. Discover the 5 key factors that ensure a perfect match between your learning style and your tutor's teaching approach.",
    author: "Dr. Sarah Chen",
    authorInitials: "SC",
    gradient: "from-[#6366f1] to-indigo-400",
    date: "May 2, 2025",
    readTime: "6 min read",
    tags: ["Tutoring", "Learning", "Education"],
  },
  {
    slug: "10-study-habits-high-performers",
    category: "Productivity",
    categoryColor: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    title: "10 Study Habits That Separate High-Performers From Everyone Else",
    excerpt: "After analyzing 50,000+ SkillBridge sessions, we identified the habits that correlate most strongly with student success. Here are the science-backed strategies top learners use daily.",
    author: "Marcus Johnson",
    authorInitials: "MJ",
    gradient: "from-slate-700 to-slate-600",
    date: "April 28, 2025",
    readTime: "8 min read",
    tags: ["Study Tips", "Productivity", "Science"],
  },
  {
    slug: "become-top-tutor-skillbridge",
    category: "For Tutors",
    categoryColor: "bg-indigo-50 dark:bg-indigo-500/10 text-[#6366f1]",
    title: "How to Become a Top-Rated Tutor on SkillBridge in 90 Days",
    excerpt: "Our highest-earning tutors share the exact strategies they used to build 5-star reputations and fill their schedules. From profile optimization to session techniques that wow students.",
    author: "Aisha Patel",
    authorInitials: "AP",
    gradient: "from-indigo-600 to-[#6366f1]",
    date: "April 20, 2025",
    readTime: "10 min read",
    tags: ["Tutor Guide", "Income", "Teaching"],
  },
  {
    slug: "online-learning-myths-debunked",
    category: "EdTech",
    categoryColor: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    title: "5 Online Learning Myths Debunked by 1 Million Sessions of Data",
    excerpt: "Is online tutoring as effective as in-person? Can you really learn a skill in hours? We analyzed over 1 million SkillBridge sessions to separate fact from fiction.",
    author: "Lucas Ferreira",
    authorInitials: "LF",
    gradient: "from-slate-800 to-slate-700",
    date: "April 15, 2025",
    readTime: "7 min read",
    tags: ["Research", "EdTech", "Data"],
  },
  {
    slug: "mastering-math-online",
    category: "Subject Guides",
    categoryColor: "bg-indigo-50 dark:bg-indigo-500/10 text-[#6366f1]",
    title: "Mastering Mathematics Online: A Complete Guide for Every Level",
    excerpt: "From basic arithmetic to advanced calculus, online math tutoring has revolutionized how students learn. Here's your complete guide to finding help, staying consistent, and actually enjoying math.",
    author: "Dr. Sarah Chen",
    authorInitials: "SC",
    gradient: "from-[#6366f1] to-indigo-500",
    date: "April 8, 2025",
    readTime: "12 min read",
    tags: ["Mathematics", "Study Guide", "STEM"],
  },
  {
    slug: "language-learning-acceleration",
    category: "Language Learning",
    categoryColor: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    title: "The Accelerated Language Learning Framework Used by Polyglots",
    excerpt: "Language learning doesn't have to take years. Discover the proven framework that helps our top students reach conversational fluency 3x faster than traditional methods.",
    author: "Marcus Johnson",
    authorInitials: "MJ",
    gradient: "from-slate-700 to-slate-500",
    date: "April 1, 2025",
    readTime: "9 min read",
    tags: ["Languages", "Fluency", "Techniques"],
  },
];

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function BlogPage() {
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
      {/* Hero */}
      <section className="relative py-24 bg-white dark:bg-[#0f172a]/60 border-b border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-[#6366f1] text-[13px] font-medium mb-6">
            <BookOpen className="w-3.5 h-3.5" /> SkillBridge Blog
          </div>
          <h1 className="text-[40px] md:text-[56px] font-medium mb-6 tracking-tight leading-[1.1] text-slate-900 dark:text-slate-50">
            Insights for <span className="text-[#6366f1]">Learners & Educators</span>
          </h1>
          <p className="text-[16px] text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-[1.7]">
            Expert tips, research-backed strategies, and inspiring stories from the SkillBridge community.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Featured Post */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <div className="bg-white dark:bg-[#0f172a]/40 border border-slate-200 dark:border-slate-800 rounded-[24px] overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className={`h-72 bg-gradient-to-br ${featured.gradient} relative flex items-end p-8 md:p-10`}>
                <div className="absolute inset-0 bg-slate-900/10" />
                <div className="relative z-10">
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[13px] font-semibold px-3 py-1.5 rounded-full mb-4 border border-white/30">
                    Featured Post
                  </span>
                  <h2 className="text-[28px] md:text-[40px] font-medium text-white max-w-3xl leading-tight tracking-tight">{featured.title}</h2>
                </div>
              </div>
              <div className="p-8 md:p-10">
                <div className="flex flex-wrap items-center gap-4 mb-5">
                  <span className={`text-[13px] font-semibold px-3 py-1.5 rounded-full ${featured.categoryColor}`}>{featured.category}</span>
                  <span className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500"><Calendar className="w-3.5 h-3.5" />{featured.date}</span>
                  <span className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500"><Clock className="w-3.5 h-3.5" />{featured.readTime}</span>
                </div>
                <p className="text-[16px] text-slate-600 dark:text-slate-400 leading-[1.7] mb-8 max-w-3xl">{featured.excerpt}</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${featured.gradient} flex items-center justify-center text-white text-[13px] font-bold shadow-sm`}>{featured.authorInitials}</div>
                    <span className="text-[16px] font-medium text-slate-900 dark:text-slate-50">{featured.author}</span>
                  </div>
                  <Button className="bg-[#6366f1] text-white hover:bg-[#6366f1]/90 rounded-[12px] h-12 px-6 font-medium text-[16px] hover:-translate-y-0.5 active:scale-98 transition-all gap-2">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Post Grid */}
          <div className="mb-12">
            <h2 className="text-[28px] font-medium text-slate-900 dark:text-slate-50 mb-2">More Insights</h2>
            <p className="text-[16px] text-slate-500">Browse our library of expert educational content.</p>
          </div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {rest.map((post) => (
              <motion.article 
                variants={fadeUp}
                key={post.slug} 
                className="bg-white dark:bg-[#0f172a]/40 border border-slate-200 dark:border-slate-800 rounded-[20px] overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className={`h-48 bg-gradient-to-br ${post.gradient} relative`}>
                  <div className="absolute inset-0 bg-slate-900/10" />
                  <div className="absolute bottom-5 left-5">
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[13px] font-semibold px-3 py-1.5 rounded-full border border-white/30">{post.category}</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-[13px] font-medium text-slate-500 mb-4">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
                  </div>
                  <h3 className="font-medium text-[20px] text-slate-900 dark:text-slate-50 leading-tight mb-3 line-clamp-2 group-hover:text-[#6366f1] transition-colors">{post.title}</h3>
                  <p className="text-[16px] text-slate-600 dark:text-slate-400 line-clamp-3 leading-[1.7] flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/60">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${post.gradient} flex items-center justify-center text-white text-[11px] font-bold`}>{post.authorInitials}</div>
                      <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{post.author}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-[8px] text-[#6366f1] hover:text-[#6366f1] hover:bg-indigo-50 dark:hover:bg-indigo-500/10 gap-1.5 text-[13px] font-medium h-9 px-3">
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <div className="text-center mt-16">
            <Button variant="outline" className="rounded-[12px] px-8 h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] text-[16px] font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-indigo-50/50 dark:bg-indigo-500/5 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-[32px] md:text-[40px] font-medium text-slate-900 dark:text-slate-50 mb-4 tracking-tight">Never miss an article</h2>
          <p className="text-[16px] text-slate-600 dark:text-slate-400 mb-8 leading-[1.7]">Get the latest learning tips and tutor guides delivered to your inbox every week.</p>
          <Button asChild className="bg-[#6366f1] text-white hover:bg-[#6366f1]/90 rounded-[12px] h-14 px-10 font-medium text-[16px] shadow-sm hover:-translate-y-0.5 active:scale-98 transition-all">
            <Link href={ROUTES.REGISTER}>Join the Newsletter</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
