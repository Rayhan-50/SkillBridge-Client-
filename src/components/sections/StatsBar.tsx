"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";

const stats = [
    { value: "100%", label: "Satisfaction rate" },
    { value: "12+", label: "Years of experience" },
    { value: "20k+", label: "Total Courses" },
    { value: "90+", label: "Expert Mentors" },
];

export function StatsBar() {
    return (
        <section className="bg-white dark:bg-[#001e2b] relative border-y border-slate-100 dark:border-emerald-950/20 py-16 overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex flex-wrap justify-center md:justify-between items-center gap-y-12 gap-x-8"
                >
                    {stats.map((stat, i) => (
                        <div key={stat.label} className="flex items-center gap-8 group">
                            <motion.div variants={fadeUp} custom={i * 0.1} className="text-center">
                                <div className="text-5xl md:text-6xl font-display font-bold text-[#00b545] dark:text-[#00ed64] mb-3 tracking-tighter">
                                    {stat.value}
                                </div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                                    {stat.label}
                                </div>
                            </motion.div>
                            {i < stats.length - 1 && (
                                <div className="hidden md:block w-2 h-2 rounded-full bg-[#00ed64]/30" />
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export default StatsBar;