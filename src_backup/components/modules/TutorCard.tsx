"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { TutorProfile } from "@/types";

interface TutorCardProps {
    tutor: TutorProfile;
    ctaText?: string;
}

export function TutorCard({ tutor, ctaText = "View Profile" }: TutorCardProps) {
    const isAvailable = true; // Replace with actual availability logic if present

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="group flex flex-col h-full bg-[#f8fafc] dark:bg-[#0f172a]/40 border border-slate-200 dark:border-slate-800 rounded-[16px] overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
            <div className="p-6 flex flex-col flex-1">
                {/* Header: Avatar, Name, Category */}
                <div className="flex items-start gap-4 mb-5">
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6366f1] to-purple-400 opacity-0 group-hover:opacity-100 blur-[6px] transition-opacity duration-300" />
                        <div className="relative rounded-full bg-gradient-to-tr from-[#6366f1] to-purple-400 p-[2px]">
                            <Avatar className="h-[64px] w-[64px] rounded-full border-[3px] border-[#f8fafc] dark:border-[#0f172a]">
                                <AvatarImage src={tutor.user?.image || ""} alt={tutor.user?.name || "Tutor"} />
                                <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-[#0f172a] dark:text-[#f8fafc] font-medium text-[16px]">
                                    {tutor.user?.name?.[0] || "T"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        {/* Availability Dot */}
                        {isAvailable && (
                            <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#f8fafc] dark:border-[#0f172a] rounded-full z-10" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-[#0f172a] dark:text-[#f8fafc] font-medium text-[20px] truncate leading-tight">
                                {tutor.user?.name || "Expert Tutor"}
                            </h3>
                            {tutor.user?.role === "TUTOR" && (
                                <CheckCircle2 className="w-[16px] h-[16px] text-[#6366f1] shrink-0" aria-label="Verified Tutor" />
                            )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="flex text-amber-400">
                                <Star className="w-[14px] h-[14px] fill-current" />
                            </div>
                            <span className="text-[#0f172a] dark:text-[#f8fafc] font-medium text-[13px]">
                                {tutor.rating?.toFixed(1) || "5.0"}
                            </span>
                            <span className="text-slate-500 text-[13px]">
                                ({tutor.totalReviews || 0})
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <p className="text-slate-600 dark:text-slate-400 text-[16px] leading-[1.7] line-clamp-3 mb-6 flex-1">
                    {tutor.bio || "Passionate educator ready to share knowledge and help you achieve your learning goals."}
                </p>

                {/* Subjects/Tags */}
                <div className="flex flex-wrap gap-2 mt-auto">
                    {tutor.subjects?.slice(0, 3).map((subject) => (
                        <span
                            key={subject}
                            className="inline-flex items-center px-3 py-1 rounded-[999px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[13px] font-medium"
                        >
                            {subject}
                        </span>
                    ))}
                    {(tutor.subjects?.length || 0) > 3 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-[999px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[13px] font-medium">
                            +{(tutor.subjects?.length || 0) - 3}
                        </span>
                    )}
                    {(tutor.subjects?.length || 0) === 0 && (
                        <span className="text-slate-400 text-[13px] italic">No subjects listed</span>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-[#0f172a]/60 flex items-center justify-between">
                <div>
                    <span className="text-[20px] font-bold text-[#0f172a] dark:text-[#f8fafc] tracking-tight">
                        ${tutor.hourlyRate || 0}
                    </span>
                    <span className="text-slate-500 text-[13px] font-medium ml-1">/ hr</span>
                </div>
                
                <Link href={`${ROUTES.TUTORS}/${tutor.userId || tutor.user?.id}`} tabIndex={-1}>
                    <Button 
                        className="bg-[#6366f1] text-white hover:bg-[#6366f1]/90 rounded-[8px] h-9 px-4 text-[13px] font-medium 
                                   hover:-translate-y-0.5 hover:shadow-lg active:scale-98 
                                   focus-visible:ring-2 focus-visible:ring-[#6366f1] focus-visible:outline-none transition-all"
                    >
                        {ctaText}
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
}
