"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/hooks/useSession";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, CalendarCheck, Clock, Loader2, TrendingUp } from "lucide-react";
import { bookingService } from "@/services/booking.service";
import { Booking } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function formatDate(dateStr: string | Date) {
    const d = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return `Today`;
    if (d.toDateString() === tomorrow.toDateString()) return `Tomorrow`;
    return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        CONFIRMED: "text-emerald-500 bg-emerald-500/10",
        PENDING: "text-amber-500 bg-amber-500/10",
        COMPLETED: "text-blue-500 bg-blue-500/10",
        CANCELLED: "text-red-500 bg-red-500/10",
        REJECTED: "text-red-400 bg-red-400/10",
    };
    return (
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${colors[status] ?? "text-muted-foreground bg-muted"}`}>
            {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
    );
}

export default function TutorDashboardPage() {
    const { user } = useSession();

    const { data: bookings = [], isLoading: loading } = useQuery({
        queryKey: ["myBookings"],
        queryFn: bookingService.getMyBookings,
    });

    // Derived stats
    const completedBookings = bookings.filter((b) => b.status === "COMPLETED");
    const pendingBookings = bookings.filter((b) => b.status === "PENDING");
    const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.price ?? 0), 0);
    const uniqueStudents = new Set(bookings.map((b) => b.studentId)).size;
    const sessionsHosted = completedBookings.length;
    const pendingCount = pendingBookings.length;

    // Upcoming sessions = PENDING or CONFIRMED, ordered by date
    const upcomingSessions = bookings
        .filter((b) => b.status === "PENDING" || b.status === "CONFIRMED")
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    const stats = [
        {
            title: "Total Earnings",
            value: `$${totalEarnings.toFixed(2)}`,
            sub: `${completedBookings.length} completed session${completedBookings.length !== 1 ? "s" : ""}`,
            icon: DollarSign,
        },
        {
            title: "Active Students",
            value: String(uniqueStudents),
            sub: `Across all bookings`,
            icon: Users,
        },
        {
            title: "Sessions Hosted",
            value: String(sessionsHosted),
            sub: "Completed sessions",
            icon: CalendarCheck,
        },
        {
            title: "Pending Requests",
            value: String(pendingCount),
            sub: pendingCount > 0 ? "Requires attention" : "All caught up!",
            icon: Clock,
            subClass: pendingCount > 0 ? "text-amber-500" : "text-emerald-500",
        },
    ];

    const statColors = [
        "from-teal-500 to-cyan-400",
        "from-violet-500 to-purple-400",
        "from-green-500 to-emerald-400",
        "from-amber-500 to-orange-400",
    ];

    // Mock data for earnings chart
    const earningsData = [
        { name: "Jan", earnings: 150 }, { name: "Feb", earnings: 230 },
        { name: "Mar", earnings: 180 }, { name: "Apr", earnings: 320 },
        { name: "May", earnings: Math.max(totalEarnings, 400) }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight gradient-text">Tutor Dashboard</h1>
                <p className="text-muted-foreground text-sm mt-1">Manage your sessions, availability, and earnings.</p>
            </div>

            {/* Premium Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, idx) => (
                    <Card key={stat.title} className="overflow-hidden border-border/50 hover:shadow-md transition-shadow">
                        <div className={`h-1 w-full bg-gradient-to-r ${statColors[idx % statColors.length]}`} />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${statColors[idx % statColors.length]}`}>
                                <stat.icon className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className={`text-xs mt-0.5 ${stat.subClass ?? "text-muted-foreground"}`}>
                                        {stat.sub}
                                    </p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Earnings Chart */}
                <Card className="col-span-4 border-border/50">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Earnings Overview</CardTitle>
                        <CardDescription className="text-xs">Your monthly income from completed sessions</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] pl-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={earningsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} tickMargin={10} fontSize={12} tickFormatter={(val) => `$${val}`} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(val) => [`$${val}`, "Earnings"]} />
                                <Bar dataKey="earnings" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Upcoming Sessions */}
                <Card className="col-span-3 border-border/50 flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Upcoming Sessions</CardTitle>
                        <CardDescription className="text-xs">Pending and confirmed sessions.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : upcomingSessions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-8">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                    <CalendarCheck className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">No upcoming sessions</p>
                                    <p className="text-xs text-muted-foreground mt-1">Share your profile to get booked!</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcomingSessions.map((booking) => (
                                    <div key={booking.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0 hover:bg-muted/30 px-2 -mx-2 rounded-lg transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full gradient-btn flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">
                                                {((booking.student as any)?.name ?? "S")[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{(booking.student as any)?.name ?? "Student"}</p>
                                                <p className="text-xs text-muted-foreground">{(booking.category as any)?.name ?? "Session"}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium mb-1">{formatDate(booking.date)}, {booking.startTime}</p>
                                            <StatusBadge status={booking.status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
