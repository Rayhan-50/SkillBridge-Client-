"use client";

import { useAuth } from "@/providers/AuthProvider";
import { ROUTES } from "@/constants/routes";
import {
  LayoutDashboard, Calendar, Settings, LogOut, Zap, Users, BookOpen,
  History, Tag, BarChart2, GraduationCap, CreditCard, Clock,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";
import { motion } from "framer-motion";

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
        { title: "Analytics", href: ROUTES.ADMIN_ANALYTICS, icon: BarChart2 },
        { title: "Manage Users", href: `${ROUTES.ADMIN_DASHBOARD}/users`, icon: Users },
        { title: "All Bookings", href: `${ROUTES.ADMIN_DASHBOARD}/bookings`, icon: BookOpen },
        { title: "Tutors", href: ROUTES.ADMIN_TUTORS, icon: GraduationCap },
        { title: "Categories", href: `${ROUTES.ADMIN_DASHBOARD}/categories`, icon: Tag },
      ];
    }

    if (user.role === "TUTOR") {
      return [
        { title: "Dashboard", href: ROUTES.TUTOR_DASHBOARD, icon: LayoutDashboard },
        { title: "My Sessions", href: `${ROUTES.TUTOR_DASHBOARD}/sessions`, icon: Calendar },
        { title: "Availability", href: `${ROUTES.TUTOR_DASHBOARD}/availability`, icon: Clock },
        { title: "Earnings", href: ROUTES.TUTOR_DASHBOARD, icon: BarChart2 },
        { title: "Profile Settings", href: `${ROUTES.TUTOR_DASHBOARD}/settings`, icon: Settings },
      ];
    }

    return [
      { title: "Dashboard", href: ROUTES.STUDENT_DASHBOARD, icon: LayoutDashboard },
      { title: "My Bookings", href: `${ROUTES.STUDENT_DASHBOARD}/bookings`, icon: Calendar },
      { title: "Payment History", href: `${ROUTES.STUDENT_DASHBOARD}/payment-history`, icon: CreditCard },
      { title: "Find Tutors", href: ROUTES.TUTORS, icon: Users },
      { title: "Settings", href: `${ROUTES.STUDENT_DASHBOARD}/settings`, icon: Settings },
    ];
  };

  const navItems = getNavItems();

  const roleLabel: Record<string, string> = { STUDENT: "Student", TUTOR: "Tutor", ADMIN: "Admin" };
  const roleBg: Record<string, string> = {
    STUDENT: "badge-teal",
    TUTOR: "badge-purple",
    ADMIN: "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30",
  };

  return (
    <div className="flex h-full flex-col border-r border-border/50 bg-sidebar relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] pointer-events-none" />

      {/* Brand */}
      <div className="p-6 pb-4 border-b border-border/50 relative z-10">
        <Link href={ROUTES.HOME} className="flex items-center space-x-2.5 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl gradient-btn shadow-lg">
            <Zap className="h-4 w-4 text-white" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-[neon-ping_2s_infinite]" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Skill<span className="gradient-text">Bridge</span>
          </span>
        </Link>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-auto py-6 px-4 relative z-10 scrollbar-hide">
        <nav className="grid gap-1.5 text-sm font-medium">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 relative group",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full shadow-[0_0_10px_var(--primary-glow)]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                  {item.title}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Sign out */}
      <div className="p-4 mt-auto border-t border-border/50 relative z-10 bg-sidebar/50 backdrop-blur-md">
        {user && (
          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl glass-card">
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center text-white text-sm font-display font-bold shrink-0 shadow-lg relative">
              {user.name?.charAt(0) || "U"}
              <div className="absolute inset-0 rounded-xl ring-2 ring-primary/20 ring-offset-2 ring-offset-background" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold font-display truncate text-foreground">{user.name}</p>
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-0.5 inline-block tracking-wider", roleBg[user.role ?? ""] ?? roleBg.STUDENT)}>
                {roleLabel[user.role ?? ""] ?? user.role}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-destructive bg-destructive/10 hover:bg-destructive hover:text-white transition-all duration-300"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </div>
  );
}
