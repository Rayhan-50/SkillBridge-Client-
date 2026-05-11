"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, Search } from "lucide-react";
import { format } from "date-fns";
import api from "@/lib/api";
import { toast } from "sonner";
import { Booking } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";

export default function AdminBookingsPage() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: response, isLoading } = useQuery({
        queryKey: ["adminBookings"],
        queryFn: async () => {
            const res = await api.get("/bookings");
            return res.data;
        },
    });

    const allBookings: Booking[] = response?.data || (Array.isArray(response) ? response : []);

    const filteredBookings = useMemo(() => {
        return allBookings.filter(b => {
            const studentName = (b.student as any)?.name?.toLowerCase() || "";
            const tutorName = (b.tutor as any)?.user?.name?.toLowerCase() || "";
            
            const matchesSearch = studentName.includes(searchTerm.toLowerCase()) || 
                                  tutorName.includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [allBookings, searchTerm, statusFilter]);

    const totalPages = Math.ceil(filteredBookings.length / limit);
    const paginatedBookings = filteredBookings.slice((page - 1) * limit, page * limit);

    // Reset to page 1 when filters change
    useMemo(() => setPage(1), [searchTerm, statusFilter]);

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

    if (isLoading && !allBookings.length) {
        return <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
    }

    return (
        <div>
            <PageHeader title="All Bookings" description="View and manage all platform bookings." />

            <Card className="border-border/50">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <CardTitle>System Bookings ({filteredBookings.length})</CardTitle>
                        
                        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto">
                            <div className="relative w-full md:w-56">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search by student or tutor..." 
                                    className="pl-8 h-9" 
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "ALL")}>
                                <SelectTrigger className="w-[140px] h-9">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Status</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-border/50">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Student</TableHead>
                                    <TableHead>Tutor</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedBookings.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            No bookings match your filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedBookings.map((b) => (
                                        <TableRow key={b.id} className="hover:bg-muted/30">
                                            <TableCell className="font-medium">{(b.student as any)?.name || "Unknown"}</TableCell>
                                            <TableCell>{(b.tutor as any)?.user?.name || "Unknown"}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                <div className="text-foreground">{format(new Date(b.date), "MMM d, yyyy")}</div>
                                                <div className="text-xs">{b.startTime} - {b.endTime}</div>
                                            </TableCell>
                                            <TableCell className="font-semibold">${b.price?.toFixed(2) || "0.00"}</TableCell>
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
                                                {b.status === "PENDING" ? (
                                                    <div className="flex justify-end gap-2">
                                                        <Button 
                                                            size="icon" 
                                                            variant="outline"
                                                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                                            onClick={() => updateStatusMutation.mutate({ id: b.id, status: "CONFIRMED" })}
                                                            disabled={updateStatusMutation.isPending}
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                        <Button 
                                                            size="icon" 
                                                            variant="outline"
                                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                            onClick={() => updateStatusMutation.mutate({ id: b.id, status: "CANCELLED" })}
                                                            disabled={updateStatusMutation.isPending}
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-xs text-muted-foreground">
                                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, filteredBookings.length)} of {filteredBookings.length} entries
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline" size="sm"
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline" size="sm"
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
