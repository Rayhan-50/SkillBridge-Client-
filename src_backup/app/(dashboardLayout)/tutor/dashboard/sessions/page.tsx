"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/services/booking.service";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Calendar, Clock, CheckCircle, XCircle, Video } from "lucide-react";
import { format } from "date-fns";
import { Booking } from "@/types";
import { toast } from "sonner";

export default function TutorSessionsPage() {
    const queryClient = useQueryClient();

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ["myBookings"],
        queryFn: bookingService.getMyBookings,
    });

    const updateStatus = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            bookingService.updateBookingStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myBookings"] });
            toast.success("Booking status updated.");
        },
        onError: () => toast.error("Failed to update booking status."),
    });

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    const pending = bookings.filter((b: Booking) => b.status === "PENDING");
    const upcoming = bookings.filter((b: Booking) => b.status === "CONFIRMED");
    const past = bookings.filter((b: Booking) =>
        b.status === "COMPLETED" || b.status === "CANCELLED"
    );

    const statusBadge = (status: string) => {
        const map: Record<string, string> = {
            PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
            CONFIRMED: "bg-green-500/10 text-green-600 border-green-500/20",
            COMPLETED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
            CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
        };
        return (
            <Badge variant="outline" className={map[status] || ""}>
                {status}
            </Badge>
        );
    };

    const SessionTable = ({ rows, emptyMsg }: { rows: Booking[]; emptyMsg: string }) => (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Date &amp; Time</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-20 text-muted-foreground">
                                {emptyMsg}
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((b: Booking) => (
                            <TableRow key={b.id}>
                                <TableCell className="font-medium">
                                    {(b as any).student?.user?.name || "Student"}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1 text-sm">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            {format(new Date(b.date), "MMM d, yyyy")}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-muted-foreground">
                                            <Clock className="h-3.5 w-3.5" />
                                            {b.startTime} – {b.endTime}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>${b.price}</TableCell>
                                <TableCell>{statusBadge(b.status)}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    {b.status === "PENDING" && (
                                        <>
                                            <Button
                                                size="sm"
                                                onClick={() => updateStatus.mutate({ id: b.id, status: "CONFIRMED" })}
                                                disabled={updateStatus.isPending}
                                            >
                                                <CheckCircle className="mr-1 h-4 w-4" /> Accept
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => updateStatus.mutate({ id: b.id, status: "CANCELLED" })}
                                                disabled={updateStatus.isPending}
                                            >
                                                <XCircle className="mr-1 h-4 w-4" /> Decline
                                            </Button>
                                        </>
                                    )}
                                    {b.status === "CONFIRMED" && b.meetingLink && (
                                        <Button size="sm" asChild>
                                            <a href={b.meetingLink} target="_blank" rel="noreferrer">
                                                <Video className="mr-1 h-4 w-4" /> Join
                                            </a>
                                        </Button>
                                    )}
                                    {(b.status === "COMPLETED" || b.status === "CANCELLED") && (
                                        <span className="text-xs text-muted-foreground">—</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <div className="space-y-8">
            <PageHeader title="My Sessions" description="Manage all your tutoring session requests and upcoming classes." />

            {/* Pending Requests */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Pending Requests
                        {pending.length > 0 && (
                            <Badge className="bg-yellow-500 text-white">{pending.length}</Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <SessionTable rows={pending} emptyMsg="No pending requests." />
                </CardContent>
            </Card>

            {/* Upcoming Confirmed */}
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                    <SessionTable rows={upcoming} emptyMsg="No confirmed upcoming sessions." />
                </CardContent>
            </Card>

            {/* History */}
            <Card>
                <CardHeader>
                    <CardTitle>Session History</CardTitle>
                </CardHeader>
                <CardContent>
                    <SessionTable rows={past} emptyMsg="No past sessions yet." />
                </CardContent>
            </Card>
        </div>
    );
}
