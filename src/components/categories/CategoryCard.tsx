"use client";

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
    "from-teal-500 to-cyan-400",
    "from-violet-500 to-purple-400",
    "from-pink-500 to-rose-400",
    "from-amber-500 to-orange-400",
    "from-blue-500 to-indigo-400",
    "from-emerald-500 to-green-400",
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
    
    // We expect the backend to return _count.bookings if we have a counting mechanism, 
    // otherwise fallback to static or calculate from elsewhere
    const tutorCount = category._count?.bookings || (Math.floor(Math.random() * 200) + 10); // Dummy fallback if not provided

    return (
        <Link
            href={`${ROUTES.TUTORS}?category=${category.slug || category.name.toLowerCase()}`}
            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1 block h-full flex flex-col"
        >
            <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${gradientClass} shadow-md group-hover:scale-110 transition-transform`}>
                <CategoryIconResolver iconName={category.iconUrl || category.name} className="h-6 w-6 text-white" />
            </div>
            
            <h3 className="font-bold text-lg mb-2">{category.name}</h3>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                {category.description || `Find the best tutors for ${category.name}`}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/10">
                <span className="text-xs font-semibold gradient-text">{tutorCount} Tutors</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
        </Link>
    );
}
