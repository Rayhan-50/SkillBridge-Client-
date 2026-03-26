import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/services/booking.service";
import { TutorProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

interface BookingModalProps {
    tutor: TutorProfile;
    children: React.ReactNode;
}

export function BookingModal({ tutor, children }: BookingModalProps) {
    const { user } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date>();
    const [time, setTime] = useState<string>("");

    const DEFAULT_SLOTS = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];

    const getAvailableSlots = (selectedDate: Date | undefined): string[] => {
        if (!selectedDate) return [];
        if (!tutor.availability) return DEFAULT_SLOTS;

        const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"] as const;
        const dayName = days[selectedDate.getDay()];
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

    const availableSlots = getAvailableSlots(date);

    const createBooking = useMutation({
        mutationFn: (data: any) => bookingService.createBooking(data),
        onSuccess: () => {
            toast.success("Booking request sent successfully!");
            queryClient.invalidateQueries({ queryKey: ["myBookings"] });
            setOpen(false);
            setDate(undefined);
            setTime("");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create booking request.");
        },
    });

    const handleBook = () => {
        if (!user) {
            toast.error("Please log in to book a session.");
            router.push(ROUTES.LOGIN);
            return;
        }
        if (user.role === "TUTOR") {
            toast.error("Tutors cannot book sessions. Please use a student account.");
            return;
        }
        if (!date || !time) {
            toast.error("Please select a date and time.");
            return;
        }
        const endTime = `${(parseInt(time.split(":")[0]) + 1).toString().padStart(2, "0")}:00`;
        createBooking.mutate({
            tutorId: tutor.userId || tutor.user?.id,
            date: date.toISOString(),
            startTime: time,
            endTime,
            price: tutor.hourlyRate,
            status: "PENDING",
        });
    };

    const dateDone = !!date;
    const timeDone = !!time;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={children as React.ReactElement} />

            <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden rounded-2xl border-border shadow-2xl">
                {/* Gradient top stripe */}
                <div className="h-1 w-full gradient-btn" />

                <div className="flex flex-col items-center px-8 pt-7 pb-7 gap-5">

                    {/* Gradient icon badge */}
                    <div className="w-16 h-16 rounded-2xl gradient-btn flex items-center justify-center shadow-lg">
                        <CalendarIcon className="h-8 w-8 text-white" />
                    </div>

                    {/* Title & description */}
                    <div className="text-center">
                        <h2 className="text-xl font-bold">Book a Session</h2>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                            Booking with{" "}
                            <span className="font-semibold text-foreground">{tutor.user?.name}</span>.{" "}
                            Rate: <span className="font-semibold gradient-text">${tutor.hourlyRate}/hr</span> · 1 hour session.
                        </p>
                    </div>

                    {/* Step rows */}
                    <div className="w-full flex flex-col gap-3">

                        {/* Date row */}
                        <div className={cn(
                            "flex flex-col gap-2 rounded-xl px-4 py-3 border transition-colors",
                            dateDone
                                ? "bg-primary/5 border-primary/30"
                                : "bg-muted/40 border-border"
                        )}>
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Select Date</span>
                                </div>
                                {dateDone ? (
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-semibold gradient-text">{format(date!, "PPP")}</span>
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full gradient-btn text-white text-[10px] font-bold">✓</span>
                                    </div>
                                ) : (
                                    <span className="text-xs font-semibold text-muted-foreground">Not set</span>
                                )}
                            </div>
                            <Popover>
                                <PopoverTrigger render={
                                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-background", !date && "text-muted-foreground")} />
                                }>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        disabled={(d) =>
                                            d < new Date() ||
                                            d < new Date(new Date().setHours(0, 0, 0, 0))
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Time row */}
                        <div className={cn(
                            "flex flex-col gap-2 rounded-xl px-4 py-3 border transition-colors",
                            timeDone
                                ? "bg-primary/5 border-primary/30"
                                : "bg-muted/40 border-border"
                        )}>
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Select Time</span>
                                </div>
                                {timeDone ? (
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-semibold gradient-text">{time}</span>
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full gradient-btn text-white text-[10px] font-bold">✓</span>
                                    </div>
                                ) : (
                                    <span className="text-xs font-semibold text-muted-foreground">Not set</span>
                                )}
                            </div>
                            <Select value={time} onValueChange={(val) => setTime(val || "")} disabled={!date}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder={date ? "Select a time slot" : "Select a date first"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableSlots.map((slot) => (
                                        <SelectItem key={slot} value={slot}>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                {slot}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Price summary */}
                        <div className="bg-muted/30 border border-border rounded-xl px-4 py-3 flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Total estimated price</span>
                            <span className="font-bold text-lg gradient-text">${tutor.hourlyRate}</span>
                        </div>
                    </div>

                    {/* CTA button */}
                    <Button
                        className="w-full gradient-btn border-0 rounded-xl py-5 text-sm font-semibold shadow-md"
                        onClick={handleBook}
                        disabled={createBooking.isPending || !date || !time}
                    >
                        {createBooking.isPending && (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        )}
                        {!createBooking.isPending && <CheckCircle2 className="w-4 h-4 mr-2" />}
                        Request Booking
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
