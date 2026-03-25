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
import { Star, Loader2 } from "lucide-react";
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

            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
                <div className="flex flex-col items-center px-8 pt-8 pb-6 gap-5">

                    {/* Green badge icon */}
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                        <svg
                            className="w-10 h-10 text-green-500"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.41 14.59L6.7 12.7a1 1 0 1 1 1.41-1.41l2.49 2.49 5.79-5.79a1 1 0 1 1 1.41 1.41l-6.21 6.21a1 1 0 0 1-1.42 0z" />
                        </svg>
                    </div>

                    {/* Title & description */}
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-gray-900">Leave a Review</h2>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                            Share your experience with{" "}
                            <span className="font-medium text-gray-700">{tutorName}</span>.
                            <br />
                            Your feedback helps other students.
                        </p>
                    </div>

                    {/* Step rows */}
                    <div className="w-full flex flex-col gap-3">

                        {/* Rating row */}
                        <div
                            className={cn(
                                "flex flex-col gap-3 rounded-xl px-4 py-3 border transition-colors",
                                ratingDone
                                    ? "bg-green-50 border-green-200"
                                    : "bg-gray-50 border-gray-200"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-base">⭐</span>
                                    <span className="text-sm font-medium text-gray-700">
                                        Your Rating
                                    </span>
                                </div>
                                {ratingDone ? (
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-semibold text-green-600">
                                            {ratingLabel}
                                        </span>
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white text-[10px] font-bold">
                                            ✓
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-xs font-semibold text-red-500">
                                        Incomplete
                                    </span>
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
                                                    : "text-gray-300"
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Comment row */}
                        <div
                            className={cn(
                                "flex flex-col gap-2 rounded-xl px-4 py-3 border transition-colors",
                                commentDone
                                    ? "bg-green-50 border-green-200"
                                    : "bg-gray-50 border-gray-200"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-base">💬</span>
                                    <span className="text-sm font-medium text-gray-700">
                                        Comment{" "}
                                        <span className="text-gray-400 font-normal">(optional)</span>
                                    </span>
                                </div>
                                {commentDone ? (
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white text-[10px] font-bold">
                                        ✓
                                    </span>
                                ) : (
                                    <span className="text-xs font-semibold text-red-500">
                                        Incomplete
                                    </span>
                                )}
                            </div>

                            <Textarea
                                placeholder="Describe your experience with this tutor..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={3}
                                maxLength={500}
                                className="resize-none bg-white border-gray-200 text-sm"
                            />
                            <span className="text-xs text-gray-400 text-right">
                                {comment.length}/500
                            </span>
                        </div>
                    </div>

                    {/* CTA button */}
                    <Button
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl py-5 text-sm"
                        onClick={handleSubmit}
                        disabled={createReview.isPending || rating === 0}
                    >
                        {createReview.isPending && (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        )}
                        Submit Review
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
