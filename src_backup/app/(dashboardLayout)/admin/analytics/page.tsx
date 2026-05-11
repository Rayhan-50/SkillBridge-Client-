"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, BarChart, Bar, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { Loader2 } from "lucide-react";

export default function AdminAnalyticsPage() {
    const { data: statsData, isLoading } = useQuery({
        queryKey: ["adminStats"],
        queryFn: adminService.getStats,
    });

    const stats = statsData?.data || {};

    // Mock historical data for advanced analytics
    const revenueData = [
        { month: "Jan", revenue: 4000 }, { month: "Feb", revenue: 5000 },
        { month: "Mar", revenue: 4500 }, { month: "Apr", revenue: 6000 },
        { month: "May", revenue: 8000 }, { month: "Jun", revenue: 9500 },
        { month: "Jul", revenue: 11000 }, { month: "Aug", revenue: Math.max(stats.revenue || 12000, 12000) }
    ];

    const userGrowthData = [
        { month: "Jan", students: 400, tutors: 40 }, { month: "Feb", students: 500, tutors: 50 },
        { month: "Mar", students: 650, tutors: 70 }, { month: "Apr", students: 800, tutors: 90 },
        { month: "May", students: 1000, tutors: 110 }, { month: "Jun", students: 1200, tutors: 130 },
        { month: "Jul", students: 1350, tutors: 140 }, { month: "Aug", students: stats.totalStudents || 1500, tutors: stats.totalTutors || 150 }
    ];

    const categoryData = [
        { name: "Mathematics", bookings: 450 }, { name: "Programming", bookings: 600 },
        { name: "Languages", bookings: 300 }, { name: "Science", bookings: 250 },
        { name: "Arts", bookings: 100 }
    ];

    if (isLoading) {
        return <div className="flex justify-center items-center py-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Analytics & Reporting"
                description="Deep dive into platform growth, revenue, and user engagement metrics."
            />

            {/* Revenue Trend - Area Chart */}
            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Revenue Growth</CardTitle>
                    <CardDescription className="text-xs">Monthly platform revenue over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />
                            <YAxis axisLine={false} tickLine={false} tickMargin={10} fontSize={12} tickFormatter={(val) => `$${val}`} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(val) => [`$${val}`, "Revenue"]} />
                            <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth - Line Chart */}
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">User Acquisition</CardTitle>
                        <CardDescription className="text-xs">Growth of students vs tutors</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="students" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Students" />
                                <Line type="monotone" dataKey="tutors" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Tutors" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Popular Categories - Bar Chart */}
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Top Categories</CardTitle>
                        <CardDescription className="text-xs">Bookings distributed by subject category</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} layout="vertical" margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                                <XAxis type="number" axisLine={false} tickLine={false} tickMargin={10} fontSize={12} />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={12} width={100} />
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#333" opacity={0.2} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="bookings" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} name="Total Bookings">
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#14b8a6', '#8b5cf6', '#f59e0b', '#ec4899'][index % 5]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
