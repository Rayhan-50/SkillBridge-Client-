"use client";

import { useAuth } from "@/providers/AuthProvider";
import { ROUTES } from "@/constants/routes";
import {
    LayoutDashboard,
    Calendar,
    Settings,
    LogOut,
    Zap,
    Users,
    BookOpen,
    History,
    Tag,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";

export function Sidebar() {
    const { user, refetch } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    refetch();
                    router.push(ROUTES.HOME);
                    router.refresh();
                },
            },
        });
    };

    const getNavItems = () => {
        if (!user) return [];

        if (user.role === "ADMIN") {
            return [
                { title: "Overview", href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
                { title: "Manage Users", href: `${ROUTES.ADMIN_DASHBOARD}/users`, icon: Users },
                { title: "All Bookings", href: `${ROUTES.ADMIN_DASHBOARD}/bookings`, icon: BookOpen },
                { title: "Categories", href: `${ROUTES.ADMIN_DASHBOARD}/categories`, icon: Tag },
            ];
        }

        if (user.role === "TUTOR") {
            return [
                { title: "Dashboard", href: ROUTES.TUTOR_DASHBOARD, icon: LayoutDashboard },
                { title: "My Sessions", href: `${ROUTES.TUTOR_DASHBOARD}/sessions`, icon: Calendar },
                { title: "Availability", href: `${ROUTES.TUTOR_DASHBOARD}/availability`, icon: History },
                { title: "Profile Settings", href: `${ROUTES.TUTOR_DASHBOARD}/settings`, icon: Settings },
            ];
        }

        return [
            { title: "Dashboard", href: ROUTES.STUDENT_DASHBOARD, icon: LayoutDashboard },
            { title: "My Bookings", href: `${ROUTES.STUDENT_DASHBOARD}/bookings`, icon: Calendar },
            { title: "Find Tutors", href: ROUTES.TUTORS, icon: Users },
            { title: "Settings", href: `${ROUTES.STUDENT_DASHBOARD}/settings`, icon: Settings },
        ];
    };

    const navItems = getNavItems();

    const roleLabel: Record<string, string> = {
        STUDENT: "Student",
        TUTOR: "Tutor",
        ADMIN: "Admin",
    };
    const roleBg: Record<string, string> = {
        STUDENT: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
        TUTOR: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        ADMIN: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    };

    return (
        <div className="flex h-full flex-col border-r border-border/50 bg-sidebar">
            {/* Brand */}
            <div className="p-5 pb-4 border-b border-border/50">
                <Link href={ROUTES.HOME} className="flex items-center space-x-2 group">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-btn shadow-sm">
                        <Zap className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">
                        Skill<span className="gradient-text">Bridge</span>
                    </span>
                </Link>
                {user && (
                    <div className="mt-3 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full gradient-btn flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {user.name?.charAt(0) || "U"}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">{user.name}</p>
                            <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full", roleBg[user.role ?? ""] ?? roleBg.STUDENT)}>
                                {roleLabel[user.role ?? ""] ?? user.role}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Nav items */}
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid gap-1 px-3 text-sm font-medium">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150",
                                    isActive
                                        ? "gradient-btn text-white shadow-sm"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4 shrink-0" />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Sign out */}
            <div className="p-3 mt-auto border-t border-border/50">
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
                >
                    <LogOut className="h-4 w-4" />
                    Log out
                </button>
            </div>
        </div>
    );
}
