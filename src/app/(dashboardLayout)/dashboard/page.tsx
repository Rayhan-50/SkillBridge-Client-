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
import { Calendar, Clock, Video, Loader2, History } from "lucide-react";
import { format } from "date-fns";
import { EmptyState } from "@/components/common/EmptyState";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Booking } from "@/types";

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

    const renderBookingCard = (booking: Booking, isUpcoming: boolean) => (
        <Card key={booking.id} className="mb-4">
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
        <div>
            <PageHeader
                title={`Welcome back, ${user?.name?.split(" ")[0] || "Student"}!`}
                description="Manage your learning journey and upcoming sessions."
                action={
                    <Button asChild>
                        <Link href={ROUTES.TUTORS}>Book New Session</Link>
                    </Button>
                }
            />

            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="upcoming">Upcoming Sessions ({upcomingBookings.length})</TabsTrigger>
                    <TabsTrigger value="past">Past Sessions ({pastBookings.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                    {isLoading ? (
                        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                    ) : upcomingBookings.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {upcomingBookings.map(b => renderBookingCard(b, true))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Calendar}
                            title="No upcoming sessions"
                            description="You don't have any scheduled tutoring sessions yet."
                            action={<Button asChild><Link href={ROUTES.TUTORS}>Find a Tutor</Link></Button>}
                        />
                    )}
                </TabsContent>

                <TabsContent value="past">
                    {isLoading ? (
                        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                    ) : pastBookings.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {pastBookings.map(b => renderBookingCard(b, false))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={History}
                            title="No past sessions"
                            description="Your completed and cancelled sessions will appear here."
                        />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
