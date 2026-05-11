"use client";

import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/services/booking.service";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuth } from "@/providers/AuthProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, Loader2, History, BookOpen, CheckCircle, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { EmptyState } from "@/components/common/EmptyState";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Booking } from "@/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentDashboard() {
    const { user } = useAuth();

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ["myBookings"],
        queryFn: bookingService.getMyBookings,
    });

    const getStatusColor = (status: Booking["status"]) => {
        switch (status) {
            case "CONFIRMED": return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
            case "PENDING": return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
            case "COMPLETED": return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
            case "CANCELLED":
            case "REJECTED": return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
            default: return "";
        }
    };

    const upcomingBookings = bookings.filter(b => ["CONFIRMED", "PENDING"].includes(b.status));
    const pastBookings = bookings.filter(b => ["COMPLETED", "CANCELLED", "REJECTED"].includes(b.status));
    const completedBookings = pastBookings.filter(b => b.status === "COMPLETED");

    // Calculate stats
    const totalSpent = completedBookings.reduce((sum, b) => sum + (b.price || 0), 0);
    const totalHours = completedBookings.length; // assuming 1 session = 1 hour for simplicity

    // Mock data for learning progress chart
    const learningData = [
        { month: "Jan", hours: 2 }, { month: "Feb", hours: 5 },
        { month: "Mar", hours: 4 }, { month: "Apr", hours: 8 },
        { month: "May", hours: Math.max(totalHours, 10) }
    ];

    const studentStats = [
        { title: "Total Sessions", value: bookings.length, icon: Calendar, color: "from-[#6366f1] to-indigo-400" },
        { title: "Completed", value: completedBookings.length, icon: CheckCircle, color: "from-slate-700 to-slate-600" },
        { title: "Hours Learned", value: totalHours, icon: Clock, color: "from-indigo-600 to-[#6366f1]" },
        { title: "Total Spent", value: `$${totalSpent.toLocaleString()}`, icon: TrendingUp, color: "from-slate-800 to-slate-700" },
    ];

    const renderBookingCard = (booking: Booking, isUpcoming: boolean) => (
        <Card key={booking.id} className="mb-4 hover:-translate-y-1 transition-all duration-300 border-slate-200 dark:border-slate-800/60 rounded-[16px] shadow-sm hover:shadow-md bg-white dark:bg-[#0f172a]/40">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border">
                        <AvatarImage src={booking.tutor.user?.image || ""} />
                        <AvatarFallback>{booking.tutor.user?.name?.[0] || "T"}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-lg">{booking.tutor.user?.name || "Tutor"}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(booking.date), "PPP")}
                            <span className="mx-1">•</span>
                            <Clock className="h-3.5 w-3.5" />
                            {booking.startTime} - {booking.endTime}
                        </CardDescription>
                    </div>
                </div>
                <Badge className={getStatusColor(booking.status)} variant="outline">
                    {booking.status}
                </Badge>
            </CardHeader>
            {(isUpcoming && booking.status === "CONFIRMED" && booking.meetingLink) && (
                <CardContent className="pb-3">
                    <div className="bg-muted/50 rounded-md p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                            <Video className="h-4 w-4 text-primary" />
                            <span className="font-medium">Meeting Link Ready</span>
                        </div>
                        <Button size="sm" asChild>
                            <a href={booking.meetingLink} target="_blank" rel="noreferrer">Join Session</a>
                        </Button>
                    </div>
                </CardContent>
            )}
            {!isUpcoming && booking.status === "COMPLETED" && (
                <CardFooter className="pt-0 pb-4">
                    <Button variant="outline" size="sm" className="w-full">Leave a Review</Button>
                </CardFooter>
            )}
        </Card>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title={`Welcome back, ${user?.name?.split(" ")[0] || "Student"}!`}
                description="Manage your learning journey and upcoming sessions."
                action={
                    <Button asChild>
                        <Link href={ROUTES.TUTORS}>Book New Session</Link>
                    </Button>
                }
            />

            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {studentStats.map((stat) => (
                    <Card key={stat.title} className="overflow-hidden border-slate-200 dark:border-slate-800/60 rounded-[16px] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-[#0f172a]/40">
                        <div className={`h-1 w-full bg-gradient-to-r ${stat.color}`} />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${stat.color}`}>
                                <stat.icon className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Tabs defaultValue="upcoming" className="w-full">
                        <TabsList className="mb-6 bg-muted/50 p-1">
                            <TabsTrigger value="upcoming" className="rounded-md">Upcoming Sessions ({upcomingBookings.length})</TabsTrigger>
                            <TabsTrigger value="past" className="rounded-md">Past Sessions ({pastBookings.length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="upcoming">
                            <AnimatePresence mode="wait">
                                <motion.div key="upcoming" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                                    {isLoading ? (
                                        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>
                                    ) : upcomingBookings.length > 0 ? (
                                        <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-2">
                                            {upcomingBookings.map(b => renderBookingCard(b, true))}
                                        </div>
                                    ) : (
                                        <EmptyState
                                            icon={Calendar}
                                            title="No upcoming sessions"
                                            description="You don't have any scheduled tutoring sessions yet."
                                            action={<Button className="bg-[#6366f1] text-white hover:bg-[#6366f1]/90 rounded-[8px]" asChild><Link href={ROUTES.TUTORS}>Find a Tutor</Link></Button>}
                                            className="border-slate-200 dark:border-slate-800 py-12 rounded-[16px]"
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </TabsContent>

                        <TabsContent value="past">
                            <AnimatePresence mode="wait">
                                <motion.div key="past" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                                    {isLoading ? (
                                        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>
                                    ) : pastBookings.length > 0 ? (
                                        <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-2">
                                            {pastBookings.map(b => renderBookingCard(b, false))}
                                        </div>
                                    ) : (
                                        <EmptyState
                                            icon={History}
                                            title="No past sessions"
                                            description="Your completed and cancelled sessions will appear here."
                                            className="border-slate-200 dark:border-slate-800 py-12 rounded-[16px]"
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    {/* Learning Progress Chart */}
                    <Card className="border-slate-200 dark:border-slate-800/60 rounded-[16px] shadow-sm bg-white dark:bg-[#0f172a]/40">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">Learning Progress</CardTitle>
                            <CardDescription className="text-xs">Hours spent learning over time</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[250px] pl-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={learningData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />
                                    <YAxis axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Line type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Hours" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Quick Resources */}
                    <Card className="border-slate-200 dark:border-slate-800/60 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-[#6366f1]/10 rounded-[16px] shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-[#6366f1]" /> Learning Resources
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-slate-500">Access your saved materials and course recommendations.</p>
                            <Button variant="outline" className="w-full justify-start text-sm h-9 rounded-[8px] border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">View Saved Notes</Button>
                            <Button variant="outline" className="w-full justify-start text-sm h-9 rounded-[8px] border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">Recommended Tutors</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
