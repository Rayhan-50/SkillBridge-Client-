"use client";

import { useQuery } from "@tanstack/react-query";
import { tutorService } from "@/services/tutor.service";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, GraduationCap, Clock, Languages, MapPin, Loader2, ArrowLeft, MessageSquare } from "lucide-react";
import { BookingModal } from "@/components/modules/BookingModal";
import { format } from "date-fns";

export default function TutorDetailPage() {
    const params = useParams();
    const router = useRouter();
    const tutorId = params.id as string;

    const { data: tutor, isLoading, isError } = useQuery({
        queryKey: ["tutor", tutorId],
        queryFn: () => tutorService.getTutorById(tutorId),
        enabled: !!tutorId,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-32">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !tutor) {
        return (
            <div className="container mx-auto px-4 py-16">
                <Button variant="ghost" onClick={() => router.back()} className="mb-8">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <EmptyState
                    icon={GraduationCap}
                    title="Tutor not found"
                    description="The tutor profile you're looking for doesn't exist or has been removed."
                    action={<Button onClick={() => router.back()}>Go Back</Button>}
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-4 hover:bg-transparent text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to tutors
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
                            <AvatarImage src={tutor.user?.image || ""} alt={tutor.user?.name || "Tutor"} />
                            <AvatarFallback className="text-4xl">{tutor.user?.name?.[0] || "T"}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">{tutor.user?.name || "Expert Tutor"}</h1>
                                    <p className="text-lg text-muted-foreground mt-1 flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5" />
                                        {tutor.categories?.length ? tutor.categories.map(c => c.name).join(" • ") : "Expert Tutor"}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 px-3 py-1.5 rounded-full font-medium">
                                    <Star className="h-4 w-4 fill-current" />
                                    {tutor.rating?.toFixed(1) || "5.0"}
                                    <span className="text-sm font-normal text-muted-foreground">({tutor.totalReviews || 0} reviews)</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 mt-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-md">
                                    <Clock className="h-4 w-4" />
                                    <span>Joined {tutor.createdAt ? format(new Date(tutor.createdAt), "MMMM yyyy") : "Recently"}</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-md">
                                    <Languages className="h-4 w-4" />
                                    <span>English (Native)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="prose dark:prose-invert max-w-none border-t pt-8">
                        <h3 className="text-xl font-semibold mb-4 text-foreground">About Me</h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {tutor.bio || "This tutor hasn't added a biography yet. But they are vetted and approved to teach on SkillBridge."}
                        </p>
                    </div>

                    <div className="border-t pt-8">
                        <h3 className="text-xl font-semibold mb-4">Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                            {tutor.subjects?.map((subj: string, i: number) => (
                                <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm">
                                    {subj}
                                </Badge>
                            ))}
                            {!tutor.subjects?.length && (
                                <span className="text-sm text-muted-foreground">No specific expertise listed.</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Booking Card */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 border rounded-xl p-6 bg-card text-card-foreground shadow-sm">
                        <div className="flex justify-between items-end pb-6 border-b mb-6">
                            <div>
                                <span className="text-sm text-muted-foreground block mb-1">Session Rate</span>
                                <span className="text-3xl font-bold">${tutor.hourlyRate}</span>
                                <span className="text-muted-foreground"> / hr</span>
                            </div>
                        </div>

                        <BookingModal tutor={tutor}>
                            <Button className="w-full text-lg h-12 mb-4">Book a Session</Button>
                        </BookingModal>

                        <Button variant="outline" className="w-full">
                            <MessageSquare className="mr-2 h-4 w-4" /> Message Tutor
                        </Button>

                        <div className="mt-6 pt-6 border-t text-sm text-muted-foreground space-y-3">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" /> Usually responds within 1 hour
                            </div>
                            <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4" /> Identity Verified
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16 border-t pt-12">
                <h3 className="text-2xl font-bold mb-8">Student Reviews</h3>
                {tutor.reviews?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tutor.reviews.map((review: any) => (
                            <div key={review.id} className="p-6 border rounded-xl bg-card shadow-sm">
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={review.student?.image || ""} />
                                        <AvatarFallback>{review.student?.name?.[0] || "S"}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold text-sm">{review.student?.name || "Student"}</div>
                                        <div className="text-xs text-muted-foreground">{format(new Date(review.createdAt), "MMM d, yyyy")}</div>
                                    </div>
                                    <div className="ml-auto flex items-center bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded-md text-xs font-medium">
                                        <Star className="h-3 w-3 mr-1 fill-current" />
                                        {review.rating.toFixed(1)}
                                    </div>
                                </div>
                                {review.comment ? (
                                    <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
                                ) : (
                                    <p className="text-muted-foreground/50 text-sm italic">No comment provided.</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={MessageSquare}
                        title="No reviews yet"
                        description="This tutor is new or hasn't received any reviews yet. Be the first to book a session and leave a review!"
                        className="bg-transparent border-dashed py-12"
                    />
                )}
            </div>
        </div>
    );
}
