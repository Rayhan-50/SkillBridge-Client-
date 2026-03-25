"use client";

import { useSession } from "@/hooks/useSession";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, TrendingUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminDashboardPage() {
    const { user } = useSession();

    const adminStats = [
        { title: "Total Users", value: "1,429", sub: "+20% from last month", icon: Users, color: "from-teal-500 to-cyan-400" },
        { title: "Active Tutors", value: "145", sub: "+12 since yesterday", icon: GraduationCap, color: "from-violet-500 to-purple-400" },
        { title: "Total Bookings", value: "3,254", sub: "120 pending", icon: BookOpen, color: "from-green-500 to-emerald-400" },
        { title: "Platform Revenue", value: "$12,450", sub: "This month (estimated)", icon: TrendingUp, color: "from-amber-500 to-orange-400" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight gradient-text">Admin Overview</h1>
                <p className="text-muted-foreground text-sm mt-1">Platform statistics and management dashboard.</p>
            </div>

            {/* Premium Stat Cards */}
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

            {/* Main Content */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 lg:col-span-5 border-border/50">
                    <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <CardTitle className="text-base font-semibold">Recent Users</CardTitle>
                                <CardDescription className="text-xs">Latest signups across the platform.</CardDescription>
                            </div>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type="search" placeholder="Search users..." className="pl-8 rounded-full h-9 text-sm" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            {[
                                { name: "Alice Smith", email: "alice@example.com", role: "STUDENT", status: "Active" },
                                { name: "Bob Johnson", email: "bob@example.com", role: "TUTOR", status: "Active" },
                                { name: "Charlie Brown", email: "charlie@example.com", role: "STUDENT", status: "Banned" },
                            ].map((u, i) => (
                                <div key={i} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full gradient-btn flex items-center justify-center text-white text-xs font-bold shrink-0">
                                            {u.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{u.name}</p>
                                            <p className="text-xs text-muted-foreground">{u.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className={`px-2.5 py-1 rounded-full font-semibold ${u.role === "TUTOR" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"}`}>
                                            {u.role}
                                        </span>
                                        <span className={`hidden sm:inline-block px-2.5 py-1 rounded-full font-semibold ${u.status === "Banned" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}`}>
                                            {u.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 lg:col-span-2 border-border/50 overflow-hidden">
                    <div className="h-1 w-full gradient-btn" />
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">System Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {[
                            { label: "Signed in as", value: user?.email },
                            { label: "Admin Name", value: user?.name },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex flex-col gap-0.5 py-2 border-b border-border/30 last:border-0">
                                <span className="text-xs text-muted-foreground">{label}</span>
                                <span className="text-sm font-semibold truncate">{value}</span>
                            </div>
                        ))}
                        <div className="pt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <p className="text-xs text-muted-foreground">All Systems Operational</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">SkillBridge V1.0.0</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
