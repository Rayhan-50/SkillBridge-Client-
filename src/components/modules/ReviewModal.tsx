"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/review.service";
import { Booking } from "@/types";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2, MessageSquare, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReviewModalProps {
    booking: Booking;
    children: React.ReactNode;
}

export function ReviewModal({ booking, children }: ReviewModalProps) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState("");

    const tutorId =
        (booking.tutor as any)?.userId ||
        (booking.tutor as any)?.user?.id ||
        booking.tutorId;

    const createReview = useMutation({
        mutationFn: () =>
            reviewService.createReview({
                bookingId: booking.id,
                tutorId,
                rating,
                comment,
            }),
        onSuccess: () => {
            toast.success("Review submitted! Thank you for your feedback.");
            queryClient.invalidateQueries({ queryKey: ["myBookings"] });
            setOpen(false);
            setRating(0);
            setComment("");
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message || "Failed to submit review."
            );
        },
    });

    const handleSubmit = () => {
        if (rating === 0) {
            toast.error("Please select a star rating.");
            return;
        }
        createReview.mutate();
    };

    const tutorName =
        (booking.tutor as any)?.user?.name ||
        (booking.tutor as any)?.name ||
        "the tutor";

    const ratingLabel =
        ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating] || "";
    const ratingDone = rating > 0;
    const commentDone = comment.trim().length > 0;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={children as React.ReactElement} />

            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-2xl border-border shadow-2xl">
                {/* Gradient top stripe */}
                <div className="h-1 w-full gradient-btn" />

                <div className="flex flex-col items-center px-8 pt-7 pb-7 gap-5">

                    {/* Gradient icon badge */}
                    <div className="w-16 h-16 rounded-2xl gradient-btn flex items-center justify-center shadow-lg">
                        <Star className="h-8 w-8 text-white fill-white" />
                    </div>

                    {/* Title & description */}
                    <div className="text-center">
                        <h2 className="text-xl font-bold">Leave a Review</h2>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            Share your experience with{" "}
                            <span className="font-semibold text-foreground">{tutorName}</span>.{" "}
                            Your feedback helps other students.
                        </p>
                    </div>

                    {/* Step rows */}
                    <div className="w-full flex flex-col gap-3">

                        {/* Rating row */}
                        <div className={cn(
                            "flex flex-col gap-3 rounded-xl px-4 py-3 border transition-colors",
                            ratingDone
                                ? "bg-primary/5 border-primary/30"
                                : "bg-muted/40 border-border"
                        )}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm font-medium">Your Rating</span>
                                </div>
                                {ratingDone ? (
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-semibold gradient-text">{ratingLabel}</span>
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full gradient-btn text-white text-[10px] font-bold">✓</span>
                                    </div>
                                ) : (
                                    <span className="text-xs text-muted-foreground font-semibold">Not set</span>
                                )}
                            </div>

                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHovered(star)}
                                        onMouseLeave={() => setHovered(0)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                                    >
                                        <Star
                                            className={cn(
                                                "h-7 w-7 transition-colors",
                                                (hovered || rating) >= star
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-muted-foreground/30"
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Comment row */}
                        <div className={cn(
                            "flex flex-col gap-2 rounded-xl px-4 py-3 border transition-colors",
                            commentDone
                                ? "bg-primary/5 border-primary/30"
                                : "bg-muted/40 border-border"
                        )}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">
                                        Comment{" "}
                                        <span className="text-muted-foreground font-normal">(optional)</span>
                                    </span>
                                </div>
                                {commentDone ? (
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full gradient-btn text-white text-[10px] font-bold">✓</span>
                                ) : (
                                    <span className="text-xs text-muted-foreground font-semibold">Not set</span>
                                )}
                            </div>

                            <Textarea
                                placeholder="Describe your experience with this tutor..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={3}
                                maxLength={500}
                                className="resize-none bg-background border-border text-sm"
                            />
                            <span className="text-xs text-muted-foreground text-right">{comment.length}/500</span>
                        </div>
                    </div>

                    {/* CTA button */}
                    <Button
                        className="w-full gradient-btn border-0 rounded-xl py-5 text-sm font-semibold shadow-md"
                        onClick={handleSubmit}
                        disabled={createReview.isPending || rating === 0}
                    >
                        {createReview.isPending && (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        )}
                        {!createReview.isPending && <CheckCircle2 className="w-4 h-4 mr-2" />}
                        Submit Review
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
