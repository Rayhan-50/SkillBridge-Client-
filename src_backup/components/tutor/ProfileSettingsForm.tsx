"use client";

import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

const validateWithZod = (schema: z.ZodTypeAny) => ({ value }: { value: any }) => {
    const result = schema.safeParse(value);
    return result.success ? undefined : result.error.errors[0]?.message;
};

// Based on the updateTutorProfileSchema in backend
const TutorProfileSchema = z.object({
  bio: z.string().optional(),
  headline: z.string().optional(),
  hourlyRate: z.coerce.number().positive("Must be positive").optional(),
  subjects: z.string().optional(),
  languages: z.string().optional(),
  location: z.string().optional(),
  experienceYears: z.coerce.number().int().min(0).optional(),
});

export function ProfileSettingsForm() {
    const [loading, setLoading] = useState(false);
    const [initialFetchDone, setInitialFetchDone] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const form = useForm({
        defaultValues: {
            bio: "",
            headline: "",
            hourlyRate: 0,
            subjects: "",
            languages: "",
            location: "",
            experienceYears: 0,
        },
        onSubmit: async ({ value }) => {
            setLoading(true);
            try {
                // transform comma separated strings back to arrays
                const payload = {
                    ...value,
                    hourlyRate: Number(value.hourlyRate),
                    experienceYears: Number(value.experienceYears),
                    subjects: value.subjects ? value.subjects.split(",").map(i => i.trim()).filter(Boolean) : [],
                    languages: value.languages ? value.languages.split(",").map(i => i.trim()).filter(Boolean) : [],
                };

                const response = await api.patch('/tutor/profile', payload);
                if (response.data.success) {
                    setShowSuccess(true);
                }
            } catch (err: any) {
                toast.error(err.response?.data?.message || err.message || "Failed to update profile");
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/me');
                const user = res.data.data;
                const profile = user.tutorProfile;
                if (profile) {
                    form.setFieldValue("bio", profile.bio || "");
                    form.setFieldValue("headline", profile.headline || "");
                    form.setFieldValue("hourlyRate", profile.hourlyRate || 0);
                    form.setFieldValue("location", profile.location || "");
                    form.setFieldValue("experienceYears", profile.experienceYears || 0);
                    form.setFieldValue("subjects", profile.subjects?.join(", ") || "");
                    form.setFieldValue("languages", profile.languages?.join(", ") || "");
                }
            } catch (err) {
                console.error("Failed to fetch initial profile", err);
            } finally {
                setInitialFetchDone(true);
            }
        };
        fetchProfile();
    }, []);

    if (!initialFetchDone) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading profile data...</div>;
    }

    return (
        <>
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="space-y-6 max-w-2xl text-left"
        >
            <form.Field
                name="headline"
                validators={{ onChange: validateWithZod(TutorProfileSchema.shape.headline!) }}
            >
                {(field) => (
                    <div className="space-y-2">
                        <Label htmlFor={field.name}>Professional Headline</Label>
                        <Input
                            id={field.name}
                            placeholder="e.g. Senior Full-stack Engineer"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                         {field.state.meta.errors.length > 0 && <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>}
                    </div>
                )}
            </form.Field>

            <form.Field
                name="bio"
                validators={{ onChange: validateWithZod(TutorProfileSchema.shape.bio!) }}
            >
                {(field) => (
                    <div className="space-y-2">
                        <Label htmlFor={field.name}>Bio</Label>
                        <Textarea
                            id={field.name}
                            placeholder="Tell students about your teaching experience and style..."
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            rows={4}
                        />
                         {field.state.meta.errors.length > 0 && <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>}
                    </div>
                )}
            </form.Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <form.Field
                    name="hourlyRate"
                    validators={{ onChange: validateWithZod(TutorProfileSchema.shape.hourlyRate!) }}
                >
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>Hourly Rate ($)</Label>
                            <Input
                                id={field.name}
                                type="number"
                                placeholder="50"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value as any)}
                            />
                             {field.state.meta.errors.length > 0 && <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>}
                        </div>
                    )}
                </form.Field>

                <form.Field
                    name="experienceYears"
                    validators={{ onChange: validateWithZod(TutorProfileSchema.shape.experienceYears!) }}
                >
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>Years of Experience</Label>
                            <Input
                                id={field.name}
                                type="number"
                                placeholder="5"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value as any)}
                            />
                             {field.state.meta.errors.length > 0 && <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>}
                        </div>
                    )}
                </form.Field>
            </div>

            <form.Field
                name="subjects"
                validators={{ onChange: validateWithZod(TutorProfileSchema.shape.subjects!) }}
            >
                {(field) => (
                    <div className="space-y-2">
                        <Label htmlFor={field.name}>Subjects (comma separated)</Label>
                        <Input
                            id={field.name}
                            placeholder="e.g. Mathematics, Physics, Chemistry"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                         {field.state.meta.errors.length > 0 && <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>}
                    </div>
                )}
            </form.Field>
            
            <form.Field
                name="languages"
                validators={{ onChange: validateWithZod(TutorProfileSchema.shape.languages!) }}
            >
                {(field) => (
                    <div className="space-y-2">
                        <Label htmlFor={field.name}>Languages (comma separated)</Label>
                        <Input
                            id={field.name}
                            placeholder="e.g. English, Spanish"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                         {field.state.meta.errors.length > 0 && <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>}
                    </div>
                )}
            </form.Field>

            <form.Field
                name="location"
                validators={{ onChange: validateWithZod(TutorProfileSchema.shape.location!) }}
            >
                {(field) => (
                    <div className="space-y-2">
                        <Label htmlFor={field.name}>Location</Label>
                        <Input
                            id={field.name}
                            placeholder="e.g. Online, New York"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                         {field.state.meta.errors.length > 0 && <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>}
                    </div>
                )}
            </form.Field>

            <Button type="submit" disabled={loading} className="gradient-btn border-0 rounded-full px-8 shadow-md">
                {loading ? "Saving changes..." : "Save Profile Settings"}
            </Button>
        </form>

        {/* ── Success Modal ── */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
            <DialogContent className="sm:max-w-md text-center rounded-2xl">
                <DialogHeader className="items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl gradient-btn flex items-center justify-center shadow-lg mx-auto">
                        <CheckCircle2 className="h-8 w-8 text-white" />
                    </div>
                    <DialogTitle className="text-xl font-bold">Profile Updated!</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        Your tutor profile has been saved successfully. Students can now see your updated information.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center mt-2">
                    <Button
                        className="gradient-btn border-0 rounded-full px-8"
                        onClick={() => setShowSuccess(false)}
                    >
                        Awesome, thanks!
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    );
}
