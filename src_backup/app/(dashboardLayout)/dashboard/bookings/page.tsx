"use client";

import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/services/booking.service";
import { PageHeader } from "@/components/common/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar, Clock, Video, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { Booking } from "@/types";
import { Button } from "@/components/ui/button";
import { ReviewModal } from "@/components/modules/ReviewModal";

export default function StudentBookingsPage() {
    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ["myBookings"],
        queryFn: bookingService.getMyBookings,
    });

    if (isLoading) {
        return <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
    }

    return (
        <div>
            <PageHeader title="My Bookings" description="View details, join active sessions, or review your booking history." />

            <Card>
                <CardHeader>
                    <CardTitle>Session History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tutor</TableHead>
                                    <TableHead>Date &amp; Time</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                            You haven&apos;t booked any sessions yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    bookings.map((b: Booking) => {
                                        // The booking endpoint returns tutor as a plain User object
                                        const tutorName = (b.tutor as any)?.name || (b.tutor as any)?.user?.name || "Tutor";
                                        const alreadyReviewed = !!b.review;

                                        return (
                                            <TableRow key={b.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex flex-col">
                                                        <span>{tutorName}</span>
                                                        <span className="text-xs text-muted-foreground">{(b.category as any)?.name || "Session"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col space-y-1">
                                                        <div className="flex items-center text-sm">
                                                            <Calendar className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                                            {format(new Date(b.date), "MMM d, yyyy")}
                                                        </div>
                                                        <div className="flex items-center text-sm text-muted-foreground">
                                                            <Clock className="mr-2 h-3.5 w-3.5" />
                                                            {b.startTime} - {b.endTime}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            b.status === "CONFIRMED" ? "bg-green-500/10 text-green-600 border-green-500/20" :
                                                            b.status === "PENDING" ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" :
                                                            b.status === "COMPLETED" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                                                            "bg-red-500/10 text-red-600 border-red-500/20"
                                                        }
                                                    >
                                                        {b.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {b.status === "CONFIRMED" && b.meetingLink && (
                                                            <Button size="sm" asChild>
                                                                <a href={b.meetingLink} target="_blank" rel="noreferrer">
                                                                    <Video className="mr-2 h-4 w-4" /> Join
                                                                </a>
                                                            </Button>
                                                        )}
                                                        
                                                        {(b.status === "COMPLETED" || b.status === "CONFIRMED") && (
                                                            alreadyReviewed ? (
                                                                <span className="inline-flex items-center gap-1.5 text-xs text-green-600 font-medium">
                                                                    <CheckCircle2 className="h-4 w-4" /> Reviewed
                                                                </span>
                                                            ) : (
                                                                <ReviewModal booking={b}>
                                                                    <Button size="sm" variant="outline">
                                                                        Leave Review
                                                                    </Button>
                                                                </ReviewModal>
                                                            )
                                                        )}
                                                        
                                                        {b.status !== "COMPLETED" && b.status !== "CONFIRMED" && (
                                                            <span className="text-xs text-muted-foreground">No Actions</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

