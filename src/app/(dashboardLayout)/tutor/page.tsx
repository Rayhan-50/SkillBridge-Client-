"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/hooks/useSession";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, CalendarCheck, Clock, Loader2 } from "lucide-react";
import { bookingService } from "@/services/booking.service";
import { Booking } from "@/types";

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
        CONFIRMED: "text-emerald-500",
        PENDING: "text-amber-500",
        COMPLETED: "text-blue-500",
        CANCELLED: "text-red-500",
        REJECTED: "text-red-400",
    };
    return (
        <p className={`text-sm font-medium ${colors[status] ?? "text-muted-foreground"}`}>
            {status.charAt(0) + status.slice(1).toLowerCase()}
        </p>
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
                {/* Upcoming Sessions */}
                <Card className="col-span-4 border-border/50">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Upcoming Sessions</CardTitle>
                        <CardDescription className="text-xs">Pending and confirmed sessions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : upcomingSessions.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-4 text-center">
                                No upcoming sessions. Share your profile to get booked!
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {upcomingSessions.map((booking) => (
                                    <div key={booking.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full gradient-btn flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                {((booking.student as any)?.name ?? "S")[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{(booking.student as any)?.name ?? "Student"}</p>
                                                <p className="text-xs text-muted-foreground">{(booking.category as any)?.name ?? "Session"}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{formatDate(booking.date)}, {booking.startTime}</p>
                                            <StatusBadge status={booking.status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Profile Details */}
                <Card className="col-span-3 border-border/50">
                    <div className="h-1 w-full gradient-btn rounded-t-lg" />
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Profile Details</CardTitle>
                        <CardDescription className="text-xs">{user?.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { label: "Name", value: user?.name },
                                { label: "Role", value: user?.role },
                                { label: "Total Bookings", value: loading ? "—" : String(bookings.length) },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between items-center text-sm py-1.5 border-b border-border/30 last:border-0">
                                    <span className="text-muted-foreground">{label}</span>
                                    <span className="font-semibold text-xs bg-muted px-2 py-0.5 rounded-full">{value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
