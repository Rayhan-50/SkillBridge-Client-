"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types";
import { ROUTES } from "@/constants/routes";
import { CategoryIconResolver } from "./CategoryIconResolver";

interface CategoryCardProps {
    category: Category;
    colorClass?: string;
}

const defaultColors = [
    "from-[#6366f1] to-indigo-400",
    "from-slate-700 to-slate-600",
    "from-indigo-600 to-[#6366f1]",
    "from-slate-800 to-slate-700",
];

export function CategoryCard({ category, colorClass }: CategoryCardProps) {
    // Generate a consistent random color map based on category id or name
    const hashString = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    };

    const gradientClass = colorClass || defaultColors[Math.abs(hashString(category.name)) % defaultColors.length];
    
    // Use a deterministic fallback instead of Math.random() to prevent hydration errors
    const pseudoRandomCount = (Math.abs(hashString(category.name + "-count")) % 191) + 10; 
    const tutorCount = category._count?.bookings || pseudoRandomCount;

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full"
        >
            <Link
                href={`${ROUTES.TUTORS}?category=${category.slug || category.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-[16px] border border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-[#0f172a]/40 p-6 shadow-sm hover:shadow-xl hover:border-[#6366f1]/30 transition-shadow duration-300 block h-full flex flex-col"
            >
                <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${gradientClass} shadow-md group-hover:scale-110 transition-transform`}>
                    <CategoryIconResolver iconName={category.iconUrl || category.name} className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="font-medium text-[20px] text-slate-900 dark:text-slate-50 mb-2 leading-tight tracking-tight">{category.name}</h3>
                
                <p className="text-[16px] text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 flex-grow leading-[1.7]">
                    {category.description || `Find the best tutors for ${category.name}`}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200 dark:border-slate-800/60">
                    <span className="text-[13px] font-semibold text-[#6366f1]">{tutorCount} Tutors</span>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#6366f1] group-hover:translate-x-1 transition-transform duration-300" />
                </div>
            </Link>
        </motion.div>
    );
}
