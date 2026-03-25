"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, Zap } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function Navbar() {
    const { user, isPending, refetch } = useAuth();
    const { setTheme, theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
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

    const getDashboardRoute = () => {
        if (user?.role === "ADMIN") return ROUTES.ADMIN_DASHBOARD;
        if (user?.role === "TUTOR") return ROUTES.TUTOR_DASHBOARD;
        return ROUTES.STUDENT_DASHBOARD;
    };

    const NavLinks = () => (
        <>
            <Link
                href={ROUTES.TUTORS}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
                Find Tutors
            </Link>
            {user ? (
                <Link
                    href={getDashboardRoute()}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    Dashboard
                </Link>
            ) : null}
        </>
    );

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href={ROUTES.HOME} className="flex items-center space-x-2 group">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-btn shadow-sm">
                        <Zap className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">
                        Skill<span className="gradient-text">Bridge</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8">
                    <NavLinks />
                </div>

                <div className="hidden md:flex items-center space-x-3">
                    {/* Theme toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        className="rounded-full text-muted-foreground hover:text-foreground"
                    >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {isPending ? (
                        <div className="flex items-center space-x-2">
                            <div className="h-9 w-16 animate-pulse rounded-full bg-muted" />
                            <div className="h-9 w-24 animate-pulse rounded-full bg-muted" />
                        </div>
                    ) : user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={<Button variant="ghost" className="relative h-9 w-9 rounded-full p-0" />}
                            >
                                <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                                    <AvatarImage src={user.image || ""} alt={user.name} />
                                    <AvatarFallback className="gradient-btn text-white text-xs font-bold">
                                        {user.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-semibold leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem render={<Link href={getDashboardRoute()} />}>
                                    Dashboard
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleSignOut}
                                    className="text-destructive cursor-pointer"
                                >
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Button variant="ghost" asChild className="rounded-full hidden md:inline-flex text-sm">
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Button
                                asChild
                                className="rounded-full hidden md:inline-flex gradient-btn border-0 shadow-md text-sm px-5"
                            >
                                <Link href="/register">Sign up free</Link>
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        className="rounded-full"
                    >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger render={<Button variant="outline" size="icon" className="rounded-full" />}>
                            <Menu className="h-4 w-4" />
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64">
                            <div className="flex items-center gap-2 mb-8 mt-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-btn">
                                    <Zap className="h-4 w-4 text-white" />
                                </div>
                                <span className="font-bold text-lg">
                                    Skill<span className="gradient-text">Bridge</span>
                                </span>
                            </div>
                            <div className="flex flex-col space-y-4">
                                <NavLinks />
                                <div className="border-t pt-4 flex flex-col space-y-2">
                                    {isPending ? (
                                        <div className="h-10 w-full animate-pulse rounded-full bg-muted" />
                                    ) : user ? (
                                        <Button
                                            variant="destructive"
                                            className="rounded-full"
                                            onClick={() => { handleSignOut(); setIsOpen(false); }}
                                        >
                                            Log out
                                        </Button>
                                    ) : (
                                        <>
                                            <Button variant="outline" asChild className="rounded-full" onClick={() => setIsOpen(false)}>
                                                <Link href="/login">Log in</Link>
                                            </Button>
                                            <Button asChild className="rounded-full gradient-btn border-0" onClick={() => setIsOpen(false)}>
                                                <Link href="/register">Sign up free</Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
