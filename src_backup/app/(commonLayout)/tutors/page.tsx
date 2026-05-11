"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { tutorService } from "@/services/tutor.service";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, Filter, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useDebounce } from "@/hooks/use-debounce";
import { TutorCard } from "@/components/modules/TutorCard";
import { TutorGridSkeleton } from "@/components/modules/TutorCardSkeleton";

export default function TutorsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [category, setCategory] = useState("all");
    const [rating, setRating] = useState("all");
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);

    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: tutorService.getCategories,
    });

    const { data: tutorsResponse, isLoading } = useQuery({
        queryKey: ["tutors", debouncedSearch, category, rating, sort, page],
        queryFn: () => {
            let sortBy = undefined;
            let sortOrder = undefined;

            if (sort === "highest-rated") {
                sortBy = "rating";
                sortOrder = "desc";
            } else if (sort === "price-asc") {
                sortBy = "hourlyRate";
                sortOrder = "asc";
            } else if (sort === "price-desc") {
                sortBy = "hourlyRate";
                sortOrder = "desc";
            }

            return tutorService.getTutors({
                search: debouncedSearch || undefined,
                category: category !== "all" ? category : undefined,
                rating: rating !== "all" ? Number(rating) : undefined,
                sortBy,
                sortOrder,
                page,
                limit: 12
            });
        },
    });

    const tutors = tutorsResponse?.data || [];
    const meta = tutorsResponse?.meta;

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader
                title="Find Expert Tutors"
                description="Browse our curated list of expert tutors to help you achieve your learning goals."
            />

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8 bg-muted/30 p-4 rounded-xl border">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, subject, or keyword..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-background h-10"
                    />
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-3">
                    <Select value={category} onValueChange={(val) => { setCategory(val || "all"); setPage(1); }}>
                        <SelectTrigger className="w-full md:w-[160px] bg-background h-10">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Category" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {Array.isArray(categories) && categories.map((c: any) => (
                                <SelectItem key={c.id || c.name} value={c.name}>{c.name}</SelectItem>
                            ))}
                            {!categories?.length && (
                                <>
                                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                                    <SelectItem value="Programming">Programming</SelectItem>
                                    <SelectItem value="Languages">Languages</SelectItem>
                                </>
                            )}
                        </SelectContent>
                    </Select>

                    <Select value={rating} onValueChange={(val) => { setRating(val || "all"); setPage(1); }}>
                        <SelectTrigger className="w-full md:w-[140px] bg-background h-10">
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Rating" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any Rating</SelectItem>
                            <SelectItem value="4.5">4.5 & up</SelectItem>
                            <SelectItem value="4.0">4.0 & up</SelectItem>
                            <SelectItem value="3.5">3.5 & up</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sort} onValueChange={(val) => { setSort(val || "newest"); setPage(1); }}>
                        <SelectTrigger className="w-full md:w-[160px] bg-background h-10">
                            <div className="flex items-center gap-2">
                                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Sort By" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="highest-rated">Highest Rated</SelectItem>
                            <SelectItem value="price-asc">Price: Low to High</SelectItem>
                            <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Tutors Grid */}
            {isLoading ? (
                <div className="py-8">
                    <TutorGridSkeleton count={8} />
                </div>
            ) : tutors.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {tutors.map((tutor) => (
                            <TutorCard key={tutor.id} tutor={tutor} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {meta && meta.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-10">
                            <Button
                                variant="outline"
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground px-4">
                                Page {page} of {meta.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                disabled={page === meta.totalPages}
                                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <EmptyState
                    icon={Search}
                    title="No tutors found"
                    description="We couldn't find any tutors matching your current filters. Try relaxing your search criteria."
                    action={<Button variant="outline" onClick={() => { setSearchTerm(""); setCategory("all"); setRating("all"); setSort("newest"); }}>Reset Filters</Button>}
                    className="my-12 py-24"
                />
            )}
        </div>
    );
}
