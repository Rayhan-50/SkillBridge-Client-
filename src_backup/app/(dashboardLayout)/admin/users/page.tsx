"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { PageHeader } from "@/components/common/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ShieldAlert, ShieldCheck, MoreHorizontal, UserCog, Trash2, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TutorModal } from "../tutors/TutorModal";

export default function AdminUsersPage() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
    const [selectedUserForPromotion, setSelectedUserForPromotion] = useState<any>(null);
    const limit = 10;

    const { data: response, isLoading } = useQuery({
        queryKey: ["adminUsers"],
        queryFn: adminService.getUsers,
    });

    const allUsers: User[] = response?.data || (Array.isArray(response) ? response : []);

    const filteredUsers = useMemo(() => {
        return allUsers.filter(u => {
            const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  u.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
            const matchesStatus = statusFilter === "ALL" || 
                                  (statusFilter === "ACTIVE" ? u.status !== "BANNED" : u.status === "BANNED");
            
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [allUsers, searchTerm, roleFilter, statusFilter]);

    const totalPages = Math.ceil(filteredUsers.length / limit);
    const paginatedUsers = filteredUsers.slice((page - 1) * limit, page * limit);

    // Reset to page 1 when filters change
    useMemo(() => setPage(1), [searchTerm, roleFilter, statusFilter]);

    const toggleBanStatus = useMutation({
        mutationFn: ({ id, isBanned }: { id: string, isBanned: boolean }) =>
            adminService.updateUserStatus(id, isBanned),
        onSuccess: (updatedUser, variables) => {
            toast.success(`User ${variables.isBanned ? 'banned' : 'unbanned'} successfully`);
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to update user status");
        }
    });

    const updateRoleMutation = useMutation({
        mutationFn: ({ id, role }: { id: string, role: string }) =>
            adminService.updateUserRole(id, role),
        onSuccess: (updatedUser, variables) => {
            toast.success(`User role updated to ${variables.role} successfully`);
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to update user role");
        }
    });

    const deleteUserMutation = useMutation({
        mutationFn: (id: string) => adminService.deleteUser(id),
        onSuccess: () => {
            toast.success("User deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to delete user");
        }
    });

    if (isLoading && !allUsers.length) {
        return <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
    }

    return (
        <div>
            <PageHeader
                title="Manage Users"
                description="View all platform users, manage permissions, and enforce community guidelines."
            />

            <Card className="border-border/50">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <CardTitle>All Users ({filteredUsers.length})</CardTitle>
                        
                        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto">
                            <div className="relative w-full md:w-48">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search users..." 
                                    className="pl-8 h-9" 
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <Select value={roleFilter} onValueChange={(val) => setRoleFilter(val || "ALL")}>
                                <SelectTrigger className="w-[110px] h-9">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Roles</SelectItem>
                                    <SelectItem value="STUDENT">Student</SelectItem>
                                    <SelectItem value="TUTOR">Tutor</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "ALL")}>
                                <SelectTrigger className="w-[120px] h-9">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Status</SelectItem>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="BANNED">Banned</SelectItem>
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
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                            No users match your filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedUsers.map((u) => (
                                        <TableRow key={u.id} className="hover:bg-muted/30">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src={u.image || ""} />
                                                        <AvatarFallback>{u.name?.[0] || "U"}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{u.name}</span>
                                                        <span className="text-xs text-muted-foreground">{u.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        u.role === "ADMIN" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                                                        u.role === "TUTOR" ? "bg-purple-500/10 text-purple-600 border-purple-500/20" : 
                                                        "bg-teal-500/10 text-teal-600 border-teal-500/20"
                                                    }
                                                >
                                                    {u.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {format(new Date(u.createdAt), "MMM d, yyyy")}
                                            </TableCell>
                                            <TableCell>
                                                {u.status === "BANNED" ? (
                                                    <Badge variant="destructive" className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-transparent gap-1">
                                                        <ShieldAlert className="w-3 h-3" /> Banned
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-transparent gap-1">
                                                        <ShieldCheck className="w-3 h-3" /> Active
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 hover:bg-accent hover:text-accent-foreground">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="glass-card">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        
                                                        {u.role !== "ADMIN" && (
                                                            <DropdownMenuItem 
                                                                onClick={() => toggleBanStatus.mutate({ id: u.id, isBanned: u.status !== "BANNED" })}
                                                                disabled={toggleBanStatus.isPending}
                                                                className="cursor-pointer"
                                                            >
                                                                {u.status === "BANNED" ? (
                                                                    <><ShieldCheck className="mr-2 h-4 w-4 text-green-500" /> Unban User</>
                                                                ) : (
                                                                    <><ShieldAlert className="mr-2 h-4 w-4 text-orange-500" /> Ban User</>
                                                                )}
                                                            </DropdownMenuItem>
                                                        )}

                                                        <DropdownMenuItem
                                                            onClick={() => updateRoleMutation.mutate({ id: u.id, role: "ADMIN" })}
                                                            disabled={updateRoleMutation.isPending || u.role === "ADMIN"}
                                                            className="cursor-pointer"
                                                        >
                                                            <UserCog className="mr-2 h-4 w-4" /> Make Admin
                                                        </DropdownMenuItem>
                                                        
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedUserForPromotion(u);
                                                                setIsPromoteModalOpen(true);
                                                            }}
                                                            disabled={updateRoleMutation.isPending || u.role === "TUTOR"}
                                                            className="cursor-pointer"
                                                        >
                                                            <UserCog className="mr-2 h-4 w-4" /> Make Tutor
                                                        </DropdownMenuItem>
                                                        
                                                        <DropdownMenuItem
                                                            onClick={() => updateRoleMutation.mutate({ id: u.id, role: "STUDENT" })}
                                                            disabled={updateRoleMutation.isPending || u.role === "STUDENT"}
                                                            className="cursor-pointer"
                                                        >
                                                            <UserCog className="mr-2 h-4 w-4" /> Make Student
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator />
                                                        
                                                        <DropdownMenuItem 
                                                            className="text-destructive focus:text-destructive cursor-pointer"
                                                            onClick={() => deleteUserMutation.mutate(u.id)}
                                                            disabled={deleteUserMutation.isPending || u.role === "ADMIN"}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete User
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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
                                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, filteredUsers.length)} of {filteredUsers.length} entries
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

            <TutorModal 
                isOpen={isPromoteModalOpen} 
                onClose={() => {
                    setIsPromoteModalOpen(false);
                    setSelectedUserForPromotion(null);
                }} 
                promoteUser={selectedUserForPromotion} 
            />
        </div>
    );
}
