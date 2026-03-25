"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import api from "@/lib/api";
import { toast } from "sonner";
import { Booking } from "@/types";
import { Button } from "@/components/ui/button";

export default function AdminBookingsPage() {
    const queryClient = useQueryClient();

    const { data: response, isLoading } = useQuery({
        queryKey: ["adminBookings"],
        queryFn: async () => {
            const res = await api.get("/bookings");
            return res.data;
        },
    });

    const bookings: Booking[] = response?.data || (Array.isArray(response) ? response : []);

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const res = await api.patch(`/bookings/${id}`, { status });
            return res.data;
        },
        onSuccess: () => {
            toast.success("Booking status updated");
            queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to update booking status");
        }
    });

    if (isLoading) {
        return <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
    }

    return (
        <div>
            <PageHeader title="All Bookings" description="View and manage all bookings in the system." />

            <Card>
                <CardHeader>
                    <CardTitle>System Bookings ({bookings.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Tutor</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bookings.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            No bookings found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    bookings.map((b) => (
                                        <TableRow key={b.id}>
                                            <TableCell className="font-medium">{(b.student as any)?.name || "Unknown"}</TableCell>
                                            <TableCell>{(b.tutor as any)?.user?.name || "Unknown"}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                <div>{format(new Date(b.date), "MMM d, yyyy")}</div>
                                                <div>{b.startTime} - {b.endTime}</div>
                                            </TableCell>
                                            <TableCell>${b.price?.toFixed(2) || "0.00"}</TableCell>
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
                                                {b.status === "PENDING" && (
                                                    <div className="flex justify-end gap-2">
                                                        <Button 
                                                            size="icon" 
                                                            variant="outline"
                                                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            onClick={() => updateStatusMutation.mutate({ id: b.id, status: "CONFIRMED" })}
                                                            disabled={updateStatusMutation.isPending}
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                        <Button 
                                                            size="icon" 
                                                            variant="outline"
                                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => updateStatusMutation.mutate({ id: b.id, status: "CANCELLED" })}
                                                            disabled={updateStatusMutation.isPending}
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                                {b.status !== "PENDING" && (
                                                    <span className="text-xs text-muted-foreground">None</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
