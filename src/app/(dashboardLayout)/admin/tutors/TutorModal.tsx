"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { Loader2, Image as ImageIcon } from "lucide-react";

interface TutorModalProps {
    isOpen: boolean;
    onClose: () => void;
    tutor?: any; // If provided, it's edit mode
    promoteUser?: any; // If provided, we are promoting an existing user to tutor
}

export function TutorModal({ isOpen, onClose, tutor, promoteUser }: TutorModalProps) {
    const isEdit = !!tutor;
    const isPromote = !!promoteUser;
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        bio: "",
        headline: "",
        hourlyRate: "15",
        subjects: "",
        status: "ACTIVE",
        image: "",
        languages: "",
        location: "",
        experienceYears: "0",
    });

    useEffect(() => {
        if (tutor) {
            setFormData({
                name: tutor.user?.name || "",
                email: tutor.user?.email || "",
                password: "", // empty for edit
                bio: tutor.bio || "",
                headline: tutor.headline || "",
                hourlyRate: tutor.hourlyRate?.toString() || "15",
                subjects: tutor.categories?.map((c: any) => c.name).join(", ") || tutor.subjects?.join(", ") || "",
                status: tutor.user?.status || "ACTIVE",
                image: tutor.user?.image || tutor.profileImage || "",
                languages: tutor.languages?.join(", ") || "",
                location: tutor.location || "",
                experienceYears: tutor.experienceYears?.toString() || "0",
            });
        } else if (promoteUser) {
            setFormData({
                name: promoteUser.name || "",
                email: promoteUser.email || "",
                password: "", // not needed for promotion
                bio: "",
                headline: "Tutor at SkillBridge",
                hourlyRate: "15",
                subjects: "",
                status: promoteUser.status || "ACTIVE",
                image: promoteUser.image || "",
                languages: "",
                location: "",
                experienceYears: "0",
            });
        } else {
            setFormData({
                name: "",
                email: "",
                password: "",
                bio: "",
                headline: "",
                hourlyRate: "15",
                subjects: "",
                status: "ACTIVE",
                image: "",
                languages: "",
                location: "",
                experienceYears: "0",
            });
        }
    }, [tutor, promoteUser, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const mutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const payload = {
                ...data,
                subjects: data.subjects.split(",").map(s => s.trim()).filter(Boolean),
                languages: data.languages.split(",").map(l => l.trim()).filter(Boolean),
                hourlyRate: Number(data.hourlyRate),
                experienceYears: Number(data.experienceYears),
            };

            if (isEdit) {
                if (!payload.password) delete (payload as any).password;
                return await adminService.updateTutor(tutor.user?.id || tutor.userId, payload);
            } else if (isPromote) {
                // For promotion, we use updateUserStatus/Role but with extra data
                return await adminService.updateUserRole(promoteUser.id, "TUTOR", payload);
            } else {
                return await adminService.createTutor(payload);
            }
        },
        onSuccess: () => {
            toast.success(isEdit ? "Tutor updated successfully" : isPromote ? "User promoted to Tutor" : "Tutor created successfully");
            queryClient.invalidateQueries({ queryKey: ["adminTutors"] });
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
            onClose();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || error.message || "An error occurred");
        }
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEdit && !isPromote && !formData.password) {
            toast.error("Password is required for new tutors");
            return;
        }
        mutation.mutate(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col p-0">
                <form onSubmit={onSubmit} className="flex flex-col h-full">
                    <DialogHeader className="px-6 py-4 border-b">
                        <DialogTitle>{isEdit ? "Edit Tutor" : isPromote ? "Promote to Tutor" : "Add New Tutor"}</DialogTitle>
                        <DialogDescription>
                            {isEdit ? "Update the tutor's profile and user status." : isPromote ? `Setting up ${promoteUser.name}'s tutor profile.` : "Create a new tutor user and profile."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                        {isPromote && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-6">
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    Promoting <strong>{promoteUser.name}</strong> to a Tutor account. 
                                    They will be able to edit their full profile, bio, and image once they log in.
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isPromote} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required disabled={isPromote} />
                            </div>
                        </div>

                        {!isPromote && !isEdit && (
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} />
                            </div>
                        )}

                        {/* Only show detailed fields if NOT promoting, or if admin explicitly wants to see them */}
                        {(!isPromote || isEdit) ? (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="image">Profile Image URL</Label>
                                    <div className="relative">
                                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="image" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/photo.jpg" className="pl-9" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="headline">Professional Headline</Label>
                                        <Input id="headline" name="headline" value={formData.headline} onChange={handleChange} placeholder="e.g. Expert Math Tutor" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hourlyRate">Hourly Rate ($/hr)</Label>
                                        <Input id="hourlyRate" name="hourlyRate" type="number" min="0" value={formData.hourlyRate} onChange={handleChange} required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Online, NY" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="experienceYears">Years of Experience</Label>
                                        <Input id="experienceYears" name="experienceYears" type="number" min="0" value={formData.experienceYears} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subjects">Subjects (comma separated)</Label>
                                    <Input id="subjects" name="subjects" value={formData.subjects} onChange={handleChange} placeholder="e.g. Algebra, Physics" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="languages">Languages (comma separated)</Label>
                                    <Input id="languages" name="languages" value={formData.languages} onChange={handleChange} placeholder="e.g. English, Spanish" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={3} placeholder="Write a short introduction..." />
                                </div>
                            </>
                        ) : (
                            /* Minimal fields for Promotion Mode */
                            <div className="space-y-4 pt-4 border-t">
                                <div className="space-y-2">
                                    <Label htmlFor="hourlyRate">Starting Hourly Rate ($/hr)</Label>
                                    <Input id="hourlyRate" name="hourlyRate" type="number" min="0" value={formData.hourlyRate} onChange={handleChange} required />
                                    <p className="text-xs text-muted-foreground">The tutor can change this later.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="headline">Headline (Optional)</Label>
                                    <Input id="headline" name="headline" value={formData.headline} onChange={handleChange} placeholder="Tutor at SkillBridge" />
                                </div>
                            </div>
                        )}

                        {isEdit && (
                            <div className="space-y-2">
                                <Label>Account Status</Label>
                                <Select value={formData.status} onValueChange={(val) => setFormData(prev => ({ ...prev, status: val as string }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                        <SelectItem value="BANNED">Banned</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="px-6 py-4 border-t bg-muted/30">
                        <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={mutation.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? "Save Changes" : isPromote ? "Confirm Promotion" : "Create Tutor"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
