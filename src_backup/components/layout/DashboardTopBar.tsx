"use client";

import { useAuth } from "@/providers/AuthProvider";
import { signOut } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, LayoutDashboard, Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const pageTitles: Record<string, string> = {
  "/dashboard": "Student Dashboard",
  "/dashboard/bookings": "My Bookings",
  "/dashboard/payment-history": "Payment History",
  "/dashboard/settings": "Profile & Settings",
  "/admin": "Admin Overview",
  "/admin/analytics": "Analytics",
  "/admin/users": "Manage Users",
  "/admin/bookings": "All Bookings",
  "/admin/tutors": "Manage Tutors",
  "/admin/categories": "Categories",
  "/tutor/dashboard": "Tutor Dashboard",
  "/tutor/dashboard/sessions": "My Sessions",
  "/tutor/dashboard/availability": "Availability",
  "/tutor/dashboard/settings": "Profile Settings",
};

interface Props { mobile?: boolean }

export function DashboardTopBar({ mobile = false }: Props) {
  const { user, refetch } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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

  const getDashboardRoute = () => {
    if (user?.role === "ADMIN") return ROUTES.ADMIN_DASHBOARD;
    if (user?.role === "TUTOR") return ROUTES.TUTOR_DASHBOARD;
    return ROUTES.STUDENT_DASHBOARD;
  };

  const pageTitle = pageTitles[pathname] || "Dashboard";

  const roleColors: Record<string, string> = {
    STUDENT: "bg-teal-500/20 text-teal-600 dark:text-teal-400",
    TUTOR: "bg-violet-500/20 text-violet-600 dark:text-violet-400",
    ADMIN: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
  };

  if (mobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="relative h-9 w-9 rounded-full p-0 border-2 border-primary/20 hover:border-primary/50 overflow-hidden cursor-pointer">
            <Avatar className="h-full w-full">
              <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
              <AvatarFallback className="gradient-btn text-white text-xs font-bold">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 glass-card border-border/50" align="end" sideOffset={8}>
          <DropdownMenuLabel className="font-normal p-3">
            <p className="font-semibold text-sm">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer focus:bg-white/10 m-1 rounded-md">
            <Link href={getDashboardRoute()} className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer focus:bg-white/10 m-1 rounded-md">
            <Link href={`${getDashboardRoute()}/settings`} className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer m-1 rounded-md">
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="h-16 px-6 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl">
      {/* Page title */}
      <div>
        <h2 className="font-display font-bold text-lg text-foreground">{pageTitle}</h2>
        <p className="text-xs text-muted-foreground hidden sm:block">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <Button variant="ghost" size="icon" className="rounded-full relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
        </Button>

        {/* Search */}
        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground" asChild>
          <Link href={ROUTES.TUTORS}><Search className="h-5 w-5" /></Link>
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="relative h-10 rounded-full pl-1 pr-3 flex items-center gap-2.5 border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                <AvatarFallback className="gradient-btn text-white text-xs font-bold">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold leading-none">{user?.name?.split(" ")[0]}</p>
                <span className={cn("text-[9px] font-bold uppercase px-1.5 py-0.5 rounded", roleColors[user?.role ?? ""] || roleColors.STUDENT)}>
                  {user?.role}
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 glass-card border-border/50" align="end" sideOffset={8}>
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.image || ""} />
                  <AvatarFallback className="gradient-btn text-white">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-semibold leading-none font-display truncate">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground mt-1 truncate">{user?.email}</p>
                  <span className={cn("text-[10px] uppercase font-bold w-max mt-1.5 px-1.5 py-0.5 rounded-sm", roleColors[user?.role ?? ""] || roleColors.STUDENT)}>
                    {user?.role}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem asChild className="cursor-pointer focus:bg-white/10 m-1 rounded-md">
              <Link href={getDashboardRoute()} className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer focus:bg-white/10 m-1 rounded-md">
              <Link href={`${getDashboardRoute()}/settings`} className="flex items-center gap-2">
                <User className="h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer focus:bg-white/10 m-1 rounded-md">
              <Link href={`${getDashboardRoute()}/settings`} className="flex items-center gap-2">
                <Settings className="h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer m-1 rounded-md"
            >
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
