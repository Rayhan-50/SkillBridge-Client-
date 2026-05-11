"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tutorService } from "@/services/tutor.service";
import { adminService } from "@/services/admin.service";
import { PageHeader } from "@/components/common/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Star, CheckCircle, XCircle, Plus, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { TutorModal } from "./TutorModal";

export default function AdminTutorsPage() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState<any>(null);

    const { data: response, isLoading } = useQuery({
        queryKey: ["adminTutors", searchTerm],
        queryFn: () => tutorService.getTutors({ search: searchTerm || undefined, limit: 50 }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => adminService.deleteTutor(id),
        onSuccess: () => {
            toast.success("Tutor deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["adminTutors"] });
        },
        onError: () => toast.error("Failed to delete tutor")
    });

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this tutor? This action cannot be undone.")) {
            deleteMutation.mutate(id);
        }
    };

    const handleEdit = (tutor: any) => {
        setSelectedTutor(tutor);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedTutor(null);
        setIsModalOpen(true);
    };

    const tutors = response?.data || [];

    if (isLoading && !tutors.length) {
        return <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Manage Tutors"
                description="View and manage tutor profiles, ratings, and approval status."
            />

            <Card className="border-border/50">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <CardTitle>Registered Tutors ({tutors.length})</CardTitle>
                        <div className="flex w-full md:w-auto items-center gap-3">
                            <Input 
                                placeholder="Search tutors..." 
                                className="w-full md:w-64 h-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button onClick={handleAdd} size="sm" className="h-9 whitespace-nowrap">
                                <Plus className="mr-2 h-4 w-4" /> Add Tutor
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-border/50">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Tutor</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Rate</TableHead>
                                    <TableHead>Subjects</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tutors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            No tutors found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tutors.map((tutor) => (
                                        <TableRow key={tutor.id} className="hover:bg-muted/30">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src={tutor.user?.image || ""} />
                                                        <AvatarFallback>{tutor.user?.name?.[0] || "T"}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{tutor.user?.name}</span>
                                                        <span className="text-xs text-muted-foreground">{tutor.user?.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                                                    <Star className="h-3.5 w-3.5 fill-current" />
                                                    {tutor.rating?.toFixed(1) || "New"}
                                                    <span className="text-muted-foreground font-normal text-xs ml-1">({tutor.totalReviews || 0})</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                ${tutor.hourlyRate}/hr
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {tutor.subjects?.slice(0, 2).map((subject: string) => (
                                                        <Badge key={subject} variant="secondary" className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-transparent">
                                                            {subject}
                                                        </Badge>
                                                    ))}
                                                    {(tutor.subjects?.length || 0) > 2 && (
                                                        <span className="text-xs text-muted-foreground">+{tutor.subjects!.length - 2}</span>
                                                    )}
                                                    {(tutor.subjects?.length || 0) === 0 && (
                                                        <span className="text-xs text-muted-foreground italic">None set</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {tutor.user?.status === "BANNED" ? (
                                                    <Badge variant="destructive" className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-transparent gap-1">
                                                        <XCircle className="w-3 h-3" /> Banned
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-transparent gap-1">
                                                        <CheckCircle className="w-3 h-3" /> Active
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => handleEdit(tutor)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(tutor.user?.id)} disabled={deleteMutation.isPending}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            
            <TutorModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                tutor={selectedTutor} 
            />
        </div>
    );
}
