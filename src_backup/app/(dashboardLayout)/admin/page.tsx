"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { useSession } from "@/hooks/useSession";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, TrendingUp, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import { format } from "date-fns";

export default function AdminDashboardPage() {
    const { user } = useSession();

    const { data: statsData, isLoading: isStatsLoading } = useQuery({
        queryKey: ["adminStats"],
        queryFn: adminService.getStats,
    });

    const { data: usersData, isLoading: isUsersLoading } = useQuery({
        queryKey: ["adminRecentUsers"],
        queryFn: adminService.getUsers,
    });

    const stats = statsData?.data || {};
    const recentUsers = Array.isArray(usersData?.data) ? usersData.data.slice(0, 5) : [];

    const adminStats = [
        { title: "Total Users", value: stats.totalUsers || 0, sub: "Registered across platform", icon: Users, color: "from-teal-500 to-cyan-400" },
        { title: "Active Tutors", value: stats.totalTutors || 0, sub: "Approved tutors", icon: GraduationCap, color: "from-violet-500 to-purple-400" },
        { title: "Total Bookings", value: stats.totalBookings || 0, sub: "All time sessions", icon: BookOpen, color: "from-green-500 to-emerald-400" },
        { title: "Platform Revenue", value: `$${(stats.revenue || 0).toLocaleString()}`, sub: "Completed sessions", icon: TrendingUp, color: "from-amber-500 to-orange-400" },
    ];

    // Mock data for charts
    const barData = [
        { name: "Jan", bookings: 65 }, { name: "Feb", bookings: 85 },
        { name: "Mar", bookings: 120 }, { name: "Apr", bookings: 150 },
        { name: "May", bookings: Math.max(stats.totalBookings || 200, 200) }
    ];

    const pieData = [
        { name: "Students", value: stats.totalStudents || 60 },
        { name: "Tutors", value: stats.totalTutors || 20 },
        { name: "Admins", value: Math.max((stats.totalUsers || 0) - (stats.totalStudents || 0) - (stats.totalTutors || 0), 1) }
    ];
    const pieColors = ["#14b8a6", "#8b5cf6", "#f59e0b"];

    if (isStatsLoading || isUsersLoading) {
        return <div className="flex justify-center items-center py-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight gradient-text">Admin Overview</h1>
                <p className="text-muted-foreground text-sm mt-1">Platform statistics and management dashboard.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {adminStats.map((stat) => (
                    <Card key={stat.title} className="overflow-hidden border-border/50 hover:shadow-md transition-shadow">
                        <div className={`h-1 w-full bg-gradient-to-r ${stat.color}`} />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${stat.color}`}>
                                <stat.icon className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-border/50">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Bookings Trend</CardTitle>
                        <CardDescription className="text-xs">Number of sessions booked per month</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-0 h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tickMargin={8} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="bookings" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-border/50">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">User Roles</CardTitle>
                        <CardDescription className="text-xs">Distribution of users on the platform</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <span className="text-2xl font-bold text-foreground">{stats.totalUsers || 0}</span>
                            <span className="block text-[10px] text-muted-foreground">Total</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Users Table */}
            <Card className="border-border/50">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="text-base font-semibold">Recent Registrations</CardTitle>
                            <CardDescription className="text-xs">Latest users to join the platform.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        {recentUsers.length === 0 ? (
                            <div className="py-8 text-center text-sm text-muted-foreground">No recent users found.</div>
                        ) : recentUsers.map((u: any) => (
                            <div key={u.id} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0 hover:bg-muted/30 px-2 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full gradient-btn flex items-center justify-center text-white text-xs font-bold shrink-0">
                                        {u.name?.substring(0, 2).toUpperCase() || "U"}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{u.name}</p>
                                        <p className="text-xs text-muted-foreground">{u.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-muted-foreground hidden md:inline-block mr-2">
                                        {format(new Date(u.createdAt), "MMM d, yyyy")}
                                    </span>
                                    <span className={`px-2.5 py-1 rounded-full font-semibold ${u.role === "TUTOR" ? "bg-purple-500/20 text-purple-600 dark:text-purple-400" : u.role === "ADMIN" ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-teal-500/20 text-teal-600 dark:text-teal-400"}`}>
                                        {u.role}
                                    </span>
                                    <span className={`hidden sm:inline-block px-2.5 py-1 rounded-full font-semibold ${u.status === "BANNED" ? "bg-red-500/20 text-red-600 dark:text-red-400" : "bg-green-500/20 text-green-600 dark:text-green-400"}`}>
                                        {u.status === "BANNED" ? "Banned" : "Active"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
