"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { tutorService } from "@/services/tutor.service";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, Filter, Loader2 } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useDebounce } from "@/hooks/use-debounce"; // We'll create this

export default function TutorsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [category, setCategory] = useState("all");
    const [page, setPage] = useState(1);

    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: tutorService.getCategories,
    });

    const { data: tutorsResponse, isLoading } = useQuery({
        queryKey: ["tutors", debouncedSearch, category, page],
        queryFn: () => tutorService.getTutors({
            search: debouncedSearch || undefined,
            category: category !== "all" ? category : undefined,
            page,
            limit: 10
        }),
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
            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-muted/30 p-4 rounded-xl border">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, subject, or keyword..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-background"
                    />
                </div>

                <div className="flex gap-4">
                    <Select value={category} onValueChange={(val) => setCategory(val || "all")}>
                        <SelectTrigger className="w-[180px] bg-background">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="All Categories" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {Array.isArray(categories) && categories.map((c: any) => (
                                <SelectItem key={c.id || c.name} value={c.name}>{c.name}</SelectItem>
                            ))}
                            {/* Fallback if API hasn't returned categories during testing */}
                            {!categories?.length && (
                                <>
                                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                                    <SelectItem value="Programming">Programming</SelectItem>
                                    <SelectItem value="Languages">Languages</SelectItem>
                                </>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Tutors Grid */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20 min-h-[40vh]">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : tutors.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {tutors.map((tutor) => (
                            <Card key={tutor.id} className="flex flex-col hover:shadow-md transition-shadow">
                                <CardHeader className="pb-4 flex-row items-start gap-4 space-y-0">
                                    <Avatar className="h-16 w-16 border-2 border-muted">
                                        <AvatarImage src={tutor.user.image || ""} alt={tutor.user.name} />
                                        <AvatarFallback>{tutor.user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <CardTitle className="text-lg line-clamp-1">{tutor.user.name}</CardTitle>
                                        <div className="flex items-center gap-1 text-sm text-yellow-500 font-medium mt-1">
                                            <Star className="h-3.5 w-3.5 fill-current" />
                                            {tutor.rating?.toFixed(1) || "5.0"}
                                            <span className="text-muted-foreground font-normal">({tutor.totalReviews || 0})</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-4 flex-1">
                                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                        {tutor.bio || "Experienced tutor ready to help you reach your goals."}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {tutor.categories?.slice(0, 3).map((cat) => (
                                            <Badge key={cat.id} variant="secondary" className="text-xs">
                                                {cat.name}
                                            </Badge>
                                        ))}
                                        {(tutor.categories?.length || 0) > 3 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{(tutor.categories?.length || 0) - 3}
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-4 border-t flex items-center justify-between bg-muted/10 rounded-b-xl">
                                    <div className="font-semibold text-lg">
                                        ${tutor.hourlyRate} <span className="text-sm font-normal text-muted-foreground">/ hr</span>
                                    </div>
                                    <Button asChild size="sm">
                                        <Link href={`${ROUTES.TUTORS}/${tutor.userId || tutor.user?.id}`}>View Profile</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
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
                    action={<Button variant="outline" onClick={() => { setSearchTerm(""); setCategory("all"); }}>Reset Filters</Button>}
                    className="my-12 py-24"
                />
            )}
        </div>
    );
}
