"use client";

import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const validateWithZod = (schema: z.ZodTypeAny) => ({ value }: { value: string }) => {
    const result = schema.safeParse(value);
    return result.success ? undefined : result.error.errors[0]?.message;
};

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "STUDENT" as "STUDENT" | "TUTOR",
        },
        onSubmit: async ({ value }) => {
            setLoading(true);
            await signUp.email({
                email: value.email,
                password: value.password,
                name: value.name,
                // @ts-ignore - better-auth custom fields
                role: value.role,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Account created successfully!");
                        router.push(value.role === "TUTOR" ? ROUTES.TUTOR_DASHBOARD : ROUTES.STUDENT_DASHBOARD);
                        router.refresh();
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message || "Failed to create account.");
                        setLoading(false);
                    },
                },
            });
        },
    });

    return (
        <div className="w-full max-w-sm mt-12 md:mt-0">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Create Account</h1>
                <p className="text-muted-foreground">Join SkillBridge and start your journey</p>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-4"
            >
                <form.Field
                    name="name"
                    validators={{
                        onChange: validateWithZod(z.string().min(2, "Name must be at least 2 characters")),
                    }}
                >
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>Full Name</Label>
                            <Input
                                id={field.name}
                                type="text"
                                placeholder="John Doe"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {field.state.meta.errors.length > 0 && (
                                <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
                            )}
                        </div>
                    )}
                </form.Field>

                <form.Field
                    name="email"
                    validators={{
                        onChange: validateWithZod(z.string().email("Invalid email address").min(1, "Email is required")),
                    }}
                >
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>Email</Label>
                            <Input
                                id={field.name}
                                type="email"
                                placeholder="name@example.com"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {field.state.meta.errors.length > 0 && (
                                <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
                            )}
                        </div>
                    )}
                </form.Field>

                <form.Field
                    name="password"
                    validators={{
                        onChange: validateWithZod(z.string().min(6, "Password must be at least 6 characters")),
                    }}
                >
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>Password</Label>
                            <Input
                                id={field.name}
                                type="password"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {field.state.meta.errors.length > 0 && (
                                <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
                            )}
                        </div>
                    )}
                </form.Field>

                <form.Field name="role">
                    {(field) => (
                        <div className="space-y-2">
                            <Label>I am a</Label>
                            <RadioGroup
                                value={field.state.value}
                                onValueChange={(val) => field.handleChange(val as "STUDENT" | "TUTOR")}
                                className="flex gap-6"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="STUDENT" id="student" />
                                    <Label htmlFor="student">Student</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="TUTOR" id="tutor" />
                                    <Label htmlFor="tutor">Tutor</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    )}
                </form.Field>

                <Button type="submit" className="w-full h-11 mt-6" disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                </Button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href={ROUTES.LOGIN} className="text-primary hover:underline font-medium relative z-10">
                    Log in
                </Link>
            </div>
        </div>
    );
}
