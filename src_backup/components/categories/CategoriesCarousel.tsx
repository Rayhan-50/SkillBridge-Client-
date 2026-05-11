"use client";

import { Category } from "@/types";
import { CategoryCard } from "./CategoryCard";

interface CategoriesCarouselProps {
    categories: Category[];
}

export function CategoriesCarousel({ categories }: CategoriesCarouselProps) {
    if (!categories || categories.length === 0) {
        return (
            <div className="text-center py-10 bg-muted/30 rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground">No categories available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Mobile Carousel View (Horizontal scroll) */}
            <div
                className="flex md:hidden overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory gap-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
            >
                {categories.map((category) => (
                    <div key={category.id} className="min-w-[280px] w-4/5 snap-center flex-shrink-0">
                        <CategoryCard category={category} />
                    </div>
                ))}
            </div>

            {/* Desktop Grid View */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>
        </div>
    );
}
