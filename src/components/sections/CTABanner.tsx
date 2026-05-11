"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { Button } from "../ui/button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTABanner() {
    return (
        <section className="py-24 bg-white dark:bg-[#001e2b] relative overflow-hidden border-b border-slate-100 dark:border-emerald-950/20">
            {/* Glowing orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#00ed64]/5 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#003d4f]/10 blur-[100px] pointer-events-none" />
            
            <div className="container mx-auto px-4 relative z-10">
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto glass-card rounded-3xl p-10 md:p-16 text-center border border-slate-200 dark:border-emerald-950/40 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00ed64]/5 to-[#003d4f]/5 pointer-events-none" />
                    
                    <motion.div variants={fadeUp} custom={0} className="inline-flex items-center justify-center p-3 glass-card rounded-2xl mb-8 shadow-[0_0_20px_rgba(0,237,100,0.2)]">
                        <Sparkles className="w-8 h-8 text-[#00ed64] animate-pulse" />
                    </motion.div>
                    
                    <motion.h2 variants={fadeUp} custom={0.1} className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight text-[#001e2b] dark:text-white">
                        Ready to Start <br className="hidden md:block" />
                        <span className="text-[#00ed64]">Your Learning Journey?</span>
                    </motion.h2>
                    
                    <motion.p variants={fadeUp} custom={0.2} className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                        Join thousands of students already learning with expert tutors on SkillBridge. Transform your potential into reality today.
                    </motion.p>
                    
                    <motion.div variants={fadeUp} custom={0.3} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button size="lg" className="rounded-full bg-[#00ed64] text-[#001e2b] hover:bg-[#00b545] border-0 shadow-[0_0_30px_rgba(0,237,100,0.3)] px-10 h-14 text-lg font-bold group w-full sm:w-auto" asChild>
                            <Link href={ROUTES.REGISTER}>
                                Get Started Free 
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-lg font-bold glass-card border-slate-200 dark:border-emerald-950/40 hover:bg-[#00ed64]/10 text-slate-700 dark:text-slate-300 transition-colors w-full sm:w-auto" asChild>
                            <Link href={ROUTES.TUTORS}>Browse Tutors</Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
