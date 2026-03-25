"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { PageHeader } from "@/components/common/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ShieldAlert, ShieldCheck, MoreHorizontal, UserCog, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminUsersPage() {
    const queryClient = useQueryClient();

    const { data: response, isLoading } = useQuery({
        queryKey: ["adminUsers"],
        queryFn: adminService.getUsers,
    });

    const users: User[] = response?.data || (Array.isArray(response) ? response : []);

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

    if (isLoading) {
        return <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
    }

    return (
        <div>
            <PageHeader
                title="Manage Users"
                description="View all platform users, manage permissions, and enforce community guidelines."
            />

            <Card>
                <CardHeader>
                    <CardTitle>All Users ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((u) => (
                                        <TableRow key={u.id}>
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
                                                        u.role === "ADMIN" ? "bg-primary/10 text-primary border-primary/20" :
                                                            u.role === "TUTOR" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : ""
                                                    }
                                                >
                                                    {u.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {format(new Date(u.createdAt), "MMM d, yyyy")}
                                            </TableCell>
                                            <TableCell>
                                                {u.banned ? (
                                                    <Badge variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-transparent">Banned</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-transparent border-green-500/20 dark:text-green-400">Active</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 hover:bg-accent hover:text-accent-foreground">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        
                                                        {u.role !== "ADMIN" && (
                                                            <DropdownMenuItem 
                                                                onClick={() => toggleBanStatus.mutate({ id: u.id, isBanned: !u.banned })}
                                                                disabled={toggleBanStatus.isPending}
                                                            >
                                                                {u.banned ? (
                                                                    <><ShieldCheck className="mr-2 h-4 w-4 text-green-500" /> Unban User</>
                                                                ) : (
                                                                    <><ShieldAlert className="mr-2 h-4 w-4 text-orange-500" /> Ban User</>
                                                                )}
                                                            </DropdownMenuItem>
                                                        )}

                                                        <DropdownMenuItem
                                                            onClick={() => updateRoleMutation.mutate({ id: u.id, role: "ADMIN" })}
                                                            disabled={updateRoleMutation.isPending || u.role === "ADMIN"}
                                                        >
                                                            <UserCog className="mr-2 h-4 w-4" /> Make Admin
                                                        </DropdownMenuItem>
                                                        
                                                        <DropdownMenuItem
                                                            onClick={() => updateRoleMutation.mutate({ id: u.id, role: "TUTOR" })}
                                                            disabled={updateRoleMutation.isPending || u.role === "TUTOR"}
                                                        >
                                                            <UserCog className="mr-2 h-4 w-4" /> Make Tutor
                                                        </DropdownMenuItem>
                                                        
                                                        <DropdownMenuItem
                                                            onClick={() => updateRoleMutation.mutate({ id: u.id, role: "STUDENT" })}
                                                            disabled={updateRoleMutation.isPending || u.role === "STUDENT"}
                                                        >
                                                            <UserCog className="mr-2 h-4 w-4" /> Make Student
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator />
                                                        
                                                        <DropdownMenuItem 
                                                            className="text-destructive focus:text-destructive"
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
                </CardContent>
            </Card>
        </div>
    );
}
