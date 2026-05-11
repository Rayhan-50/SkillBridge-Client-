"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { ROUTES } from "@/constants/routes";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ("ADMIN" | "TUTOR" | "STUDENT")[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, isLoading, isAuthenticated } = useSession();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || isLoading) return;

        if (!isAuthenticated) {
            router.push(ROUTES.LOGIN);
            return;
        }

        if (allowedRoles && user?.role && !allowedRoles.includes(user.role as any)) {
            // Redirect to their default dashboard if they try to access an unauthorized route
            if (user.role === "ADMIN") {
                router.push(ROUTES.ADMIN_DASHBOARD);
            } else if (user.role === "TUTOR") {
                router.push(ROUTES.TUTOR_DASHBOARD);
            } else {
                router.push(ROUTES.STUDENT_DASHBOARD);
            }
        }
    }, [isAuthenticated, isLoading, user, router, allowedRoles, mounted]);

    if (!mounted || isLoading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // If we require roles and user doesn't have one of them, don't render children
    // (the useEffect above will redirect them)
    if (allowedRoles && user?.role && !allowedRoles.includes(user.role as any)) {
        return null;
    }

    if (!isAuthenticated) {
        return null; // Will redirect
    }

    return <>{children}</>;
}
