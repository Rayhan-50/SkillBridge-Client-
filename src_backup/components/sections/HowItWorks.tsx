"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Search, Clock, Zap } from "lucide-react";
import { SectionHeader } from "../ui/section-header";

const steps = [
    { step: "01", title: "Find Your Tutor", desc: "Browse hundreds of verified tutors by subject, rating, and availability.", icon: Search },
    { step: "02", title: "Book a Session", desc: "Pick a date & time that works for you. Instant confirmation.", icon: Clock },
    { step: "03", title: "Start Learning", desc: "Join your 1-on-1 session and start achieving your goals.", icon: Zap },
];

export default function HowItWorks() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="container mx-auto px-4 relative z-10">
                <SectionHeader
                    label="Simple Process"
                    title={
                        <>How <span className="gradient-text">SkillBridge</span> Works</>
                    }
                    subtitle="Get started in minutes with three easy steps."
                />
                
                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16"
                >
                    {steps.map((s, i) => (
                        <motion.div key={s.step} variants={fadeUp} custom={i * 0.2} className="relative text-center group">
                            <div className="absolute top-10 left-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden md:block" />
                            <div className="relative mx-auto inline-flex items-center justify-center w-20 h-20 rounded-2xl glass-card border border-primary/20 shadow-[0_0_20px_rgba(45,212,191,0.1)] group-hover:shadow-[0_0_30px_rgba(45,212,191,0.3)] transition-all duration-500 mb-6 group-hover:-translate-y-2 group-hover:border-primary/50 bg-background/50">
                                <s.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full gradient-btn text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-primary/20">
                                    {s.step}
                                </div>
                            </div>
                            <h3 className="font-display font-bold text-xl mb-3 text-foreground">{s.title}</h3>
                            <p className="text-muted-foreground leading-relaxed px-4">{s.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
