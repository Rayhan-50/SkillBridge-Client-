"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
    label?: string;
    title: string | React.ReactNode;
    subtitle?: string;
    centered?: boolean;
    className?: string;
}

export function SectionHeader({ label, title, subtitle, centered = true, className }: SectionHeaderProps) {
    return (
        <div className={cn("mb-12", centered && "text-center mx-auto", className)}>
            {label && (
                <motion.div variants={fadeUp} custom={0}>
                    <span className="inline-block px-4 py-1.5 rounded-full glass-card border-primary/20 text-primary font-mono text-sm uppercase tracking-wider mb-4 font-bold shadow-[0_0_15px_var(--primary-glow)]">
                        {label}
                    </span>
                </motion.div>
            )}
            
            <motion.h2 
                variants={fadeUp} 
                custom={0.1}
                className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-4"
            >
                {title}
            </motion.h2>
            
            {subtitle && (
                <motion.p 
                    variants={fadeUp} 
                    custom={0.2}
                    className={cn("text-muted-foreground text-lg", centered && "max-w-2xl mx-auto")}
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
}
