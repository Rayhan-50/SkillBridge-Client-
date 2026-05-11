"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Star, Quote } from "lucide-react";
import { SectionHeader } from "../ui/section-header";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Review } from "@/types";

interface TestimonialsProps {
    reviews: Review[];
}

export default function Testimonials({ reviews }: TestimonialsProps) {
    return (
        <section className="py-24 bg-card relative overflow-hidden border-y border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 blur-[150px] rounded-full pointer-events-none" />
            
            <div className="container mx-auto px-4 relative z-10">
                <SectionHeader
                    label="Testimonials"
                    title={
                        <>What Our <span className="gradient-text">Students Say</span></>
                    }
                    subtitle="Real stories from real learners who transformed their skills with SkillBridge."
                />

                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12"
                >
                    {(reviews.length > 0 ? reviews : [
                        {
                            id: "d1",
                            comment: "The structured lessons and expert guidance on SkillBridge helped me land my dream job as a developer. Highly recommended!",
                            rating: 5,
                            student: { name: "Sarah Johnson", image: "https://i.pravatar.cc/150?u=sarah" },
                            tutor: { user: { name: "Alex Rivera" } }
                        },
                        {
                            id: "d2",
                            comment: "I was struggling with advanced calculus until I found my tutor here. The 1-on-1 sessions made all the difference.",
                            rating: 5,
                            student: { name: "Michael Chen", image: "https://i.pravatar.cc/150?u=michael" },
                            tutor: { user: { name: "Dr. Emily Smith" } }
                        },
                        {
                            id: "d3",
                            comment: "Great platform! Finding a native Spanish speaker to practice with was so easy. My confidence has soared.",
                            rating: 5,
                            student: { name: "Elena Rodriguez", image: "https://i.pravatar.cc/150?u=elena" },
                            tutor: { user: { name: "Carlos Mendez" } }
                        }
                    ]).map((review, i) => (
                        <motion.div key={review.id} variants={fadeUp} custom={i * 0.15} className="glass-card p-8 rounded-2xl relative group hover:border-primary/30 transition-colors duration-500">
                            <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/10 group-hover:text-primary/20 transition-colors duration-500" />
                            <div className="flex text-amber-400 mb-6">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                    <Star key={idx} className={`w-5 h-5 ${idx < (review.rating || 5) ? "fill-current" : "text-muted"}`} />
                                ))}
                            </div>
                            <p className="text-foreground/90 leading-relaxed mb-8 italic relative z-10 min-h-[80px]">"{review.comment}"</p>
                            <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                                    <AvatarImage src={review.student?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.student?.name || "S")}&background=7c3aed&color=fff`} />
                                    <AvatarFallback className="gradient-btn text-white text-sm font-bold font-display">{review.student?.name?.[0] || "S"}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-bold text-foreground font-display">{review.student?.name || "Student"}</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1">Student of {review.tutor?.user?.name || "Expert"}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
