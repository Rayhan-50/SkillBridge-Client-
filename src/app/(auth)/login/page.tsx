"use client";

import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useState } from "react";

const validateWithZod = (schema: z.ZodTypeAny) => ({ value }: { value: string }) => {
    const result = schema.safeParse(value);
    return result.success ? undefined : result.error.errors[0]?.message;
};

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        onSubmit: async ({ value }) => {
            setLoading(true);
            await signIn.email({
                email: value.email,
                password: value.password,
                fetchOptions: {
                    onSuccess: (ctx) => {
                        toast.success("Login successful!");
                        const userRole = ctx.data?.user?.role;

                        if (userRole === "ADMIN") {
                            router.push(ROUTES.ADMIN_DASHBOARD);
                        } else if (userRole === "TUTOR") {
                            router.push(ROUTES.TUTOR_DASHBOARD);
                        } else {
                            router.push(ROUTES.STUDENT_DASHBOARD);
                        }

                        router.refresh();
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message || "Failed to log in.");
                        setLoading(false);
                    },
                },
            });
        },
    });

    return (
        <div className="w-full max-w-sm mt-12 md:mt-0">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
                <p className="text-muted-foreground">Log in to your SkillBridge account</p>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-6"
            >
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
                            <div className="flex items-center justify-between">
                                <Label htmlFor={field.name}>Password</Label>
                                <Link href="#" className="text-sm text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
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

                <Button type="submit" className="w-full h-11" disabled={loading}>
                    {loading ? "Logging in..." : "Log In"}
                </Button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href={ROUTES.REGISTER} className="text-primary hover:underline font-medium relative z-10">
                    Sign up
                </Link>
            </div>
        </div>
    );
}
