"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/services/booking.service";
import { TutorProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Clock, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";

const bookingSchema = z.object({
    date: z.date({
        required_error: "Please select a date.",
    }),
    time: z.string({
        required_error: "Please select a time.",
    }).min(1, "Please select a time."),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingModalProps {
    tutor: TutorProfile;
    children: React.ReactNode;
}

export function BookingModal({ tutor, children }: BookingModalProps) {
    const { user } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    
    // For Success State
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<BookingFormValues>({
        resolver: zodResolver(bookingSchema),
    });

    const selectedDate = form.watch("date");

    const DEFAULT_SLOTS = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];

    const getAvailableSlots = (dateVal: Date | undefined): string[] => {
        if (!dateVal) return [];
        if (!tutor.availability) return DEFAULT_SLOTS;

        const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"] as const;
        const dayName = days[dateVal.getDay()];
        const dayAvailability = (tutor.availability as any)[dayName];

        if (!dayAvailability || !Array.isArray(dayAvailability) || dayAvailability.length === 0) {
            return DEFAULT_SLOTS;
        }

        const slots: string[] = [];
        dayAvailability.forEach((block: any) => {
            if (!block.start || !block.end) return;
            let currentHour = parseInt(block.start.split(":")[0]);
            const endHour = parseInt(block.end.split(":")[0]);
            while (currentHour < endHour) {
                slots.push(`${currentHour.toString().padStart(2, "0")}:00`);
                currentHour++;
            }
        });

        return slots.length > 0 ? slots : DEFAULT_SLOTS;
    };

    const availableSlots = getAvailableSlots(selectedDate);

    const createBooking = useMutation({
        mutationFn: (data: any) => bookingService.createBooking(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myBookings"] });
            setIsSuccess(true);
            setTimeout(() => {
                setOpen(false);
                setIsSuccess(false);
                form.reset();
            }, 2500);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create booking request.");
        },
    });

    const onSubmit = (data: BookingFormValues) => {
        if (!user) {
            toast.error("Please log in to book a session.");
            router.push(ROUTES.LOGIN);
            return;
        }
        if (user.role === "TUTOR") {
            toast.error("Tutors cannot book sessions. Please use a student account.");
            return;
        }

        const endTime = `${(parseInt(data.time.split(":")[0]) + 1).toString().padStart(2, "0")}:00`;
        createBooking.mutate({
            tutorId: tutor.userId || tutor.user?.id,
            date: data.date.toISOString(),
            startTime: data.time,
            endTime,
            price: tutor.hourlyRate,
            status: "PENDING",
        });
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
                setIsSuccess(false);
                form.reset();
            }
        }}>
            <DialogTrigger render={React.isValidElement(children) ? children : <Button>{children}</Button>} />

            <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden rounded-[16px] border border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-[#0f172a] shadow-2xl">
                <AnimatePresence mode="wait">
                    {isSuccess ? (
                        <motion.div 
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center justify-center py-16 px-8 text-center"
                        >
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <h2 className="text-[28px] font-medium text-[#0f172a] dark:text-[#f8fafc] mb-2">Request Sent!</h2>
                            <p className="text-[16px] text-slate-500 max-w-[280px]">
                                Your session request with <span className="font-medium text-[#0f172a] dark:text-[#f8fafc]">{tutor.user?.name}</span> has been submitted successfully.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="h-1 w-full bg-gradient-to-r from-[#6366f1] to-purple-400" />

                            <div className="flex flex-col px-8 pt-7 pb-7 gap-6">
                                {/* Header */}
                                <div className="text-center flex flex-col items-center">
                                    <div className="w-[64px] h-[64px] rounded-[16px] bg-[#6366f1]/10 flex items-center justify-center mb-4">
                                        <CalendarIcon className="h-8 w-8 text-[#6366f1]" aria-hidden="true" />
                                    </div>
                                    <h2 className="text-[24px] font-medium text-[#0f172a] dark:text-[#f8fafc]">Book a Session</h2>
                                    <p className="text-[16px] text-slate-500 mt-1">
                                        Booking with <span className="font-medium text-[#0f172a] dark:text-[#f8fafc]">{tutor.user?.name}</span>.{" "}
                                        Rate: <span className="font-medium text-[#6366f1]">${tutor.hourlyRate}/hr</span>
                                    </p>
                                </div>

                                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                                    {/* Date Selection */}
                                    <Controller
                                        name="date"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between px-1">
                                                    <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <CalendarIcon className="w-4 h-4 text-slate-400" /> Date
                                                    </label>
                                                    {field.value && (
                                                        <span className="text-[13px] font-medium text-[#6366f1]">{format(field.value, "MMM d, yyyy")}</span>
                                                    )}
                                                </div>
                                                <Popover>
                                                    <PopoverTrigger render={
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal h-12 rounded-[12px] border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a]/50 hover:bg-slate-50 dark:hover:bg-slate-800",
                                                                !field.value && "text-muted-foreground",
                                                                fieldState.error && "border-red-500"
                                                            )}
                                                        >
                                                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                                                        </Button>
                                                    } />
                                                    <PopoverContent className="w-auto p-0 rounded-[12px]" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={(date) => {
                                                                field.onChange(date);
                                                                form.setValue("time", ""); // reset time
                                                            }}
                                                            disabled={(d) =>
                                                                d < new Date(new Date().setHours(0, 0, 0, 0))
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                {fieldState.error && <span className="text-red-500 text-[13px] px-1">{fieldState.error.message}</span>}
                                            </div>
                                        )}
                                    />

                                    {/* Time Selection */}
                                    <Controller
                                        name="time"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between px-1">
                                                    <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-slate-400" /> Time
                                                    </label>
                                                    {field.value && (
                                                        <span className="text-[13px] font-medium text-[#6366f1]">{field.value}</span>
                                                    )}
                                                </div>
                                                <Select value={field.value} onValueChange={field.onChange} disabled={!selectedDate}>
                                                    <SelectTrigger 
                                                        className={cn(
                                                            "w-full h-12 rounded-[12px] border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a]/50",
                                                            fieldState.error && "border-red-500"
                                                        )}
                                                    >
                                                        <SelectValue placeholder={selectedDate ? "Select a time slot" : "Select a date first"} />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-[12px]">
                                                        {availableSlots.map((slot) => (
                                                            <SelectItem key={slot} value={slot}>
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="w-4 h-4 text-slate-400" />
                                                                    {slot}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {fieldState.error && <span className="text-red-500 text-[13px] px-1">{fieldState.error.message}</span>}
                                            </div>
                                        )}
                                    />

                                    {/* Total Price */}
                                    <div className="bg-slate-100 dark:bg-slate-800/50 rounded-[12px] px-4 py-3 flex justify-between items-center mt-2">
                                        <span className="text-[16px] text-slate-600 dark:text-slate-400">Total estimated</span>
                                        <span className="font-medium text-[20px] text-[#0f172a] dark:text-[#f8fafc]">${tutor.hourlyRate}</span>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={createBooking.isPending}
                                        className="w-full bg-[#6366f1] text-white hover:bg-[#6366f1]/90 rounded-[12px] h-[56px] text-[16px] font-medium 
                                                 hover:-translate-y-0.5 hover:shadow-lg active:scale-98 
                                                 focus-visible:ring-2 focus-visible:ring-[#6366f1] focus-visible:outline-none transition-all mt-2 group relative overflow-hidden"
                                    >
                                        <AnimatePresence mode="wait">
                                            {createBooking.isPending ? (
                                                <motion.div
                                                    key="loading"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="flex items-center justify-center"
                                                >
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="idle"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="flex items-center justify-center gap-2"
                                                >
                                                    Request Booking
                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </Button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
