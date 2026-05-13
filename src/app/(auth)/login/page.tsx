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
import { Loader2, Eye, EyeOff } from "lucide-react";

const validateWithZod = (schema: z.ZodTypeAny) => ({ value }: { value: string }) => {
  const result = schema.safeParse(value);
  return result.success ? undefined : result.error.errors[0]?.message;
};

const demoAccounts = [
  { label: "Student", email: "student@demo.com", password: "demo1234", color: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20 hover:bg-teal-500/20" },
  { label: "Teacher", email: "mia.taylor@academyhub.com", password: "Sh@1234344", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 hover:bg-violet-500/20" },
  { label: "Admin", email: "admin@skillbridge.com", password: "password123", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20" },
];

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        await signIn.email({
          email: value.email,
          password: value.password,
          fetchOptions: {
            onSuccess: (ctx) => {
              toast.success("Login successful!");
              const role = ctx.data?.user?.role;
              if (role === "ADMIN") router.push(ROUTES.ADMIN_DASHBOARD);
              else if (role === "TUTOR") router.push(ROUTES.TUTOR_DASHBOARD);
              else router.push(ROUTES.STUDENT_DASHBOARD);
              router.refresh();
            },
            onError: (ctx) => {
              toast.error(ctx.error.message || "Failed to log in.");
              setLoading(false);
            },
          },
        });
      } catch (err) {
        toast.error("An unexpected error occurred.");
        setLoading(false);
      }
    },
  });

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    // Fill form fields for visual feedback
    form.setFieldValue("email", demoEmail);
    form.setFieldValue("password", demoPassword);
    
    setLoading(true);
    try {
      await signIn.email({
        email: demoEmail,
        password: demoPassword,
        fetchOptions: {
          onSuccess: (ctx) => {
            toast.success(`${ctx.data?.user?.name || "Demo"} login successful!`);
            const role = ctx.data?.user?.role;
            if (role === "ADMIN") router.push(ROUTES.ADMIN_DASHBOARD);
            else if (role === "TUTOR") router.push(ROUTES.TUTOR_DASHBOARD);
            else router.push(ROUTES.STUDENT_DASHBOARD);
            router.refresh();
          },
          onError: (ctx) => {
            console.error("Demo login error detail:", ctx.error);
            toast.error(ctx.error.message || "Demo account not available.");
            setLoading(false);
          },
        },
      });
    } catch (err) {
      toast.error("An unexpected error occurred during demo login.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signIn.social({ provider: "google", callbackURL: ROUTES.STUDENT_DASHBOARD });
    } catch {
      toast.error("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mt-12 md:mt-0">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
        <p className="text-muted-foreground">Log in to your SkillBridge account</p>
      </div>

      {/* Demo Login Buttons */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 text-center">Try a Demo Account</p>
        <div className="grid grid-cols-3 gap-2">
          {demoAccounts.map((demo) => (
            <button
              key={demo.label}
              type="button"
              onClick={() => handleDemoLogin(demo.email, demo.password)}
              disabled={loading}
              className={`text-xs font-bold px-3 py-2.5 rounded-xl border transition-all duration-200 ${demo.color} disabled:opacity-50`}
            >
              {demo.label}
            </button>
          ))}
        </div>
      </div>

      {/* Google Sign In */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-11 mb-6 rounded-xl border-border/60 glass-card font-semibold gap-3"
        onClick={handleGoogleLogin}
        disabled={googleLoading || loading}
      >
        {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        )}
        Continue with Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50" /></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-muted-foreground font-medium">or continue with email</span>
        </div>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
        className="space-y-5"
      >
        <form.Field
          name="email"
          validators={{ onChange: validateWithZod(z.string().email("Invalid email address").min(1, "Email is required")) }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Email</Label>
              <Input
                id={field.name} type="email" placeholder="name@example.com"
                value={field.state.value} onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={field.state.meta.errors.length > 0 ? "border-destructive" : ""}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{ onChange: validateWithZod(z.string().min(6, "Password must be at least 6 characters")) }}
        >
          {(field) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={field.name}>Password</Label>
                <Link href="#" className="text-sm text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input
                  id={field.name} type={showPassword ? "text" : "password"}
                  value={field.state.value} onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`pr-10 ${field.state.meta.errors.length > 0 ? "border-destructive" : ""}`}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
              )}
            </div>
          )}
        </form.Field>

        <Button type="submit" className="w-full h-11 gradient-btn border-0 font-bold rounded-xl" disabled={loading}>
          {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Logging in...</> : "Log In"}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.REGISTER} className="text-primary hover:underline font-medium">Sign up</Link>
      </div>
    </div>
  );
}
