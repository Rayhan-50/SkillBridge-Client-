"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { tutorService } from "@/services/tutor.service";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";

type TimeSlot = { start: string; end: string };
type DayAvailability = { active: boolean; slots: TimeSlot[] };
type WeeklyAvailability = Record<string, DayAvailability>;

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_OPTIONS = Array.from({ length: 48 }).map((_, i) => {
    const hour = Math.floor(i / 2).toString().padStart(2, "0");
    const minute = (i % 2) === 0 ? "00" : "30";
    return `${hour}:${minute}`;
});

export default function TutorAvailabilityPage() {
    const [schedule, setSchedule] = useState<WeeklyAvailability>({});
    
    const { data: savedAvailability, isLoading } = useQuery({
        queryKey: ["tutorAvailability"],
        queryFn: tutorService.getAvailability,
    });

    useEffect(() => {
        if (savedAvailability && Object.keys(savedAvailability).length > 0) {
            setSchedule(savedAvailability);
        } else {
            // Initialize default empty schedule
            const defaultSchedule: WeeklyAvailability = {};
            DAYS.forEach(day => {
                defaultSchedule[day] = { active: false, slots: [{ start: "09:00", end: "17:00" }] };
            });
            setSchedule(defaultSchedule);
        }
    }, [savedAvailability]);

    const updateMutation = useMutation({
        mutationFn: (newSchedule: WeeklyAvailability) => tutorService.updateAvailability(newSchedule),
        onSuccess: () => {
            toast.success("Availability updated successfully");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to update availability");
        }
    });

    const toggleDay = (day: string) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], active: !prev[day].active }
        }));
    };

    const addSlot = (day: string) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], slots: [...prev[day].slots, { start: "09:00", end: "17:00" }] }
        }));
    };

    const removeSlot = (day: string, index: number) => {
        setSchedule(prev => {
            const newSlots = [...prev[day].slots];
            newSlots.splice(index, 1);
            return { ...prev, [day]: { ...prev[day], slots: newSlots } };
        });
    };

    const updateSlot = (day: string, index: number, field: "start" | "end", value: string) => {
        setSchedule(prev => {
            const newSlots = [...prev[day].slots];
            newSlots[index] = { ...newSlots[index], [field]: value };
            return { ...prev, [day]: { ...prev[day], slots: newSlots } };
        });
    };

    const handleSave = () => {
        updateMutation.mutate(schedule);
    };

    if (isLoading || Object.keys(schedule).length === 0) {
        return <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
    }

    return (
        <div>
            <PageHeader title="Availability settings" description="Manage your weekly working hours." />

            <div className="max-w-3xl mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Schedule</CardTitle>
                        <CardDescription>Select the days and times you are available for bookings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {DAYS.map((day) => (
                            <div key={day} className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 border rounded-md bg-card">
                                <div className="sm:w-40 flex items-center space-x-2 pt-2">
                                    <Switch 
                                        id={`day-${day}`} 
                                        checked={schedule[day]?.active || false}
                                        onCheckedChange={() => toggleDay(day)}
                                    />
                                    <Label htmlFor={`day-${day}`} className="font-medium text-base">{day}</Label>
                                </div>
                                
                                <div className="flex-1 space-y-3">
                                    {schedule[day]?.active ? (
                                        <>
                                            {schedule[day].slots.map((slot, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <Select value={slot.start} onValueChange={(val: string | null) => val && updateSlot(day, index, "start", val)}>
                                                        <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {TIME_OPTIONS.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                    <span className="text-muted-foreground">-</span>
                                                    <Select value={slot.end} onValueChange={(val: string | null) => val && updateSlot(day, index, "end", val)}>
                                                        <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {TIME_OPTIONS.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                    <Button variant="ghost" size="icon" onClick={() => removeSlot(day, index)} className="text-red-500 hover:text-red-700 hover:bg-red-50" disabled={schedule[day].slots.length === 1}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button variant="outline" size="sm" onClick={() => addSlot(day)} className="mt-2 text-xs h-8">
                                                <Plus className="h-3 w-3 mr-1" /> Add Time Slot
                                            </Button>
                                        </>
                                    ) : (
                                        <p className="text-muted-foreground text-sm pt-2">Unavailable</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        <div className="pt-4 flex justify-end">
                            <Button onClick={handleSave} disabled={updateMutation.isPending}>
                                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Availability
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
