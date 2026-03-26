"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { tutorService } from "@/services/tutor.service";
import { revalidateCategoriesCache } from "@/lib/actions/category.actions";
import { PageHeader } from "@/components/common/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminCategoriesPage() {
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<{ id: string, name: string, description?: string } | null>(null);
    const [formData, setFormData] = useState({ name: "", slug: "", description: "", iconUrl: "" });

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["adminCategories"],
        queryFn: tutorService.getCategories,
    });

    const createMutation = useMutation({
        mutationFn: (data: { name: string, slug: string, description: string, iconUrl: string }) => adminService.createCategory(data),
        onSuccess: () => {
            toast.success("Category created successfully");
            setIsCreateOpen(false);
            setFormData({ name: "", slug: "", description: "", iconUrl: "" });
            queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            revalidateCategoriesCache();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to create category");
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data: { id: string, name: string, slug: string, description: string, iconUrl: string }) =>
            adminService.updateCategory(data.id, { name: data.name, slug: data.slug, description: data.description, iconUrl: data.iconUrl }),
        onSuccess: () => {
            toast.success("Category updated successfully");
            setIsEditOpen(false);
            setCurrentCategory(null);
            queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            revalidateCategoriesCache();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to update category");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => adminService.deleteCategory(id),
        onSuccess: () => {
            toast.success("Category deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            revalidateCategoriesCache();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to delete category");
        }
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentCategory) {
            updateMutation.mutate({ id: currentCategory.id, ...formData });
        }
    };

    const openEdit = (category: any) => {
        setCurrentCategory(category);
        setFormData({ name: category.name, slug: category.slug || "", description: category.description || "", iconUrl: category.iconUrl || "" });
        setIsEditOpen(true);
    };

    if (isLoading) {
        return <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
    }

    const availableCategories = Array.isArray(categories) ? categories : [];

    return (
        <div>
            <PageHeader
                title="Manage Categories"
                description="View, add, and manage tutoring subjects available on the platform."
            />

            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>All Categories ({availableCategories.length})</CardTitle>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger render={<Button size="sm" />}>
                            <Plus className="mr-2 h-4 w-4" /> Add Category
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
                            <div className="flex flex-col items-center px-8 pt-8 pb-6 gap-5">
                                {/* Icon badge */}
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100">
                                    <svg className="w-9 h-9 text-indigo-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" />
                                    </svg>
                                </div>
                                {/* Title */}
                                <div className="text-center">
                                    <h2 className="text-xl font-bold text-gray-900">Create New Category</h2>
                                    <p className="text-sm text-gray-500 mt-1">Add a new subject category to the platform.</p>
                                </div>
                                {/* Form */}
                                <form onSubmit={handleCreate} className="w-full space-y-3">
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 space-y-3">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Name</label>
                                            <Input
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="e.g. Data Science"
                                                required
                                                className="bg-white !text-black placeholder:!text-gray-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Slug</label>
                                            <Input
                                                value={formData.slug}
                                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                placeholder="e.g. data-science"
                                                required
                                                className="bg-white !text-black placeholder:!text-gray-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Description</label>
                                            <Textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Brief description about the category"
                                                rows={2}
                                                className="bg-white !text-black placeholder:!text-gray-500 resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Icon URL</label>
                                            <Input
                                                value={formData.iconUrl}
                                                onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                                                placeholder="https://example.com/icon.png"
                                                className="bg-white !text-black placeholder:!text-gray-500"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={createMutation.isPending}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl py-5 text-sm"
                                    >
                                        {createMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin mr-2 inline" />Creating...</> : "Create Category"}
                                    </Button>
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category Name</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {availableCategories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                            No categories found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    availableCategories.map((c: any) => (
                                        <TableRow key={c.id}>
                                            <TableCell className="font-medium">{c.name}</TableCell>
                                            <TableCell className="text-muted-foreground text-xs font-mono">{c.slug || "—"}</TableCell>
                                            <TableCell className="text-muted-foreground max-w-xs truncate whitespace-nowrap">
                                                {c.description || "No description"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => openEdit(c)}>
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => {
                                                            if (confirm("Are you sure you want to delete this category?")) {
                                                                deleteMutation.mutate(c.id);
                                                            }
                                                        }}
                                                        disabled={deleteMutation.isPending}
                                                    >
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

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
                    <div className="flex flex-col items-center px-8 pt-8 pb-6 gap-5">
                        {/* Icon badge */}
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100">
                            <svg className="w-9 h-9 text-amber-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.46a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                            </svg>
                        </div>
                        {/* Title */}
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-gray-900">Edit Category</h2>
                            <p className="text-sm text-gray-500 mt-1">Update the details for <span className="font-medium text-gray-700">{currentCategory?.name}</span>.</p>
                        </div>
                        {/* Form */}
                        <form onSubmit={handleUpdate} className="w-full space-y-3">
                            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 space-y-3">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Name</label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="bg-white !text-black placeholder:!text-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Slug</label>
                                    <Input
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        required
                                        className="bg-white !text-black placeholder:!text-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Description</label>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={2}
                                        className="bg-white !text-black placeholder:!text-gray-500 resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Icon URL</label>
                                    <Input
                                        value={formData.iconUrl}
                                        onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                                        placeholder="https://example.com/icon.png"
                                        className="bg-white !text-black placeholder:!text-gray-500"
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={updateMutation.isPending}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl py-5 text-sm"
                            >
                                {updateMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin mr-2 inline" />Saving...</> : "Save Changes"}
                            </Button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
