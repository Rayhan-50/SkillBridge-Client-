"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  Moon, Sun, Menu, Leaf, LayoutDashboard, Calendar, Settings,
  LogOut, Search, User, BookOpen, Info, Mail, FileText,
  ChevronDown, GraduationCap, BarChart2
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { signOut } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { motion, useScroll } from "framer-motion";

export function Navbar() {
  const { user, isPending, refetch } = useAuth();
  const { setTheme, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return scrollY.onChange((latest) => setIsScrolled(latest > 20));
  }, [scrollY]);

  const currentTheme = mounted ? theme : "light";

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

  // Logged-out links (4+)
  const publicLinks = [
    { name: "Find Tutors", href: ROUTES.TUTORS, icon: Search },
    { name: "Categories", href: ROUTES.CATEGORIES, icon: GraduationCap },
    { name: "Blog", href: ROUTES.BLOG, icon: BookOpen },
    { name: "About", href: ROUTES.ABOUT, icon: Info },
  ];

  // Additional logged-in links (6+ total)
  const authLinks = [
    { name: "Find Tutors", href: ROUTES.TUTORS, icon: Search },
    { name: "Categories", href: ROUTES.CATEGORIES, icon: GraduationCap },
    { name: "Dashboard", href: getDashboardRoute(), icon: LayoutDashboard },
    { name: "Blog", href: ROUTES.BLOG, icon: BookOpen },
    { name: "About", href: ROUTES.ABOUT, icon: Info },
    { name: "Contact", href: ROUTES.CONTACT, icon: Mail },
  ];

  const navLinks = user ? authLinks : publicLinks;

  // Resources dropdown items
  const resourceLinks = [
    { name: "Blog", href: ROUTES.BLOG, icon: BookOpen, desc: "Tips & learning strategies" },
    { name: "About Us", href: ROUTES.ABOUT, icon: Info, desc: "Our mission & team" },
    { name: "Contact", href: ROUTES.CONTACT, icon: Mail, desc: "Get in touch with us" },
    { name: "Privacy Policy", href: ROUTES.PRIVACY, icon: FileText, desc: "How we protect your data" },
  ];

  return (
    <motion.nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex items-center space-x-2.5 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 shadow-sm group-hover:scale-105 transition-transform duration-300">
            <Leaf className="h-5 w-5 text-[#00ed64] fill-[#00ed64]/10" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00ed64] rounded-full border-2 border-white dark:border-[#001e2b]" />
          </div>
          <span className="font-display font-medium text-2xl tracking-tight text-slate-900 dark:text-slate-50">
            Skill<span className="text-[#00ed64]">Bridge</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-1 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#0f172a]/50 backdrop-blur-md px-2 py-1.5 rounded-full shadow-sm">
          {navLinks.slice(0, user ? 3 : 3).map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300",
                  isActive ? "text-[#00b545] dark:text-[#00ed64]" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 bg-emerald-50 dark:bg-emerald-950/40 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <link.icon className="w-3.5 h-3.5" />
                  {link.name}
                </span>
              </Link>
            );
          })}

          {/* Resources Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className={cn(
                "relative px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 flex items-center gap-1",
                resourceLinks.some(r => pathname === r.href)
                  ? "text-[#00b545] dark:text-[#00ed64] bg-emerald-50 dark:bg-emerald-950/40"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}>
                Resources <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[16px] shadow-lg mt-2 p-2" align="center">
              {resourceLinks.map((item) => (
                <DropdownMenuItem key={item.name} asChild className="cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800/50 rounded-full p-2 transition-colors">
                  <Link href={item.href} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-[#00b545] dark:text-[#00ed64]" />
                    </div>
                    <div>
                      <p className="font-medium text-[13px] text-slate-900 dark:text-slate-50">{item.name}</p>
                      <p className="text-[12px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {user && (
            <Link
              href={ROUTES.CONTACT}
              className={cn(
                "relative px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300",
                pathname === ROUTES.CONTACT 
                  ? "text-[#00b545] dark:text-[#00ed64] bg-emerald-50 dark:bg-emerald-950/40" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />Contact</span>
            </Link>
          )}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost" size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800 relative overflow-hidden"
          >
            <motion.div
              initial={false}
              animate={{ rotate: currentTheme === "dark" ? 0 : 90, scale: currentTheme === "dark" ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="h-5 w-5" />
            </motion.div>
            <motion.div
              initial={false}
              animate={{ rotate: currentTheme === "light" ? 0 : -90, scale: currentTheme === "light" ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="h-5 w-5" />
            </motion.div>
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isPending ? (
            <div className="flex items-center space-x-2">
              <div className="h-10 w-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
              <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
            </div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-10 w-10 rounded-full p-0 border-2 border-emerald-100 dark:border-emerald-500/20 hover:border-[#00ed64]/50 transition-colors overflow-hidden focus:outline-none">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={user.image || ""} alt={user.name} />
                    <AvatarFallback className="bg-emerald-50 dark:bg-emerald-950/40 text-[#00b545] dark:text-[#00ed64] text-sm font-medium">
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[16px] shadow-lg p-2" align="end" sideOffset={8}>
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal p-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image || ""} />
                        <AvatarFallback className="bg-emerald-50 dark:bg-emerald-950/40 text-[#00b545] dark:text-[#00ed64] text-sm font-medium">{user.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-[14px] font-medium leading-none text-slate-900 dark:text-slate-50">{user.name}</p>
                        <p className="text-[12px] leading-none text-slate-500">{user.email}</p>
                        <span className="text-[10px] uppercase font-bold w-max mt-1 px-1.5 py-0.5 rounded-sm bg-emerald-50 text-[#00b545] dark:text-[#00ed64] dark:bg-emerald-950/40">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1" />
                <DropdownMenuItem asChild className="cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800/50 rounded-[12px] p-2 transition-colors">
                  <Link href={getDashboardRoute()} className="flex items-center gap-2 text-[13px] text-slate-700 dark:text-slate-300">
                    <LayoutDashboard className="h-4 w-4" /><span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800/50 rounded-[12px] p-2 transition-colors">
                  <Link href={`${getDashboardRoute()}/settings`} className="flex items-center gap-2 text-[13px] text-slate-700 dark:text-slate-300">
                    <User className="h-4 w-4" /><span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800/50 rounded-[12px] p-2 transition-colors">
                  <Link href={`${getDashboardRoute()}/settings`} className="flex items-center gap-2 text-[13px] text-slate-700 dark:text-slate-300">
                    <Settings className="h-4 w-4" /><span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                {user.role !== "STUDENT" && (
                  <DropdownMenuItem asChild className="cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800/50 rounded-[12px] p-2 transition-colors">
                    <Link href={user.role === "ADMIN" ? ROUTES.ADMIN_ANALYTICS : `${ROUTES.TUTOR_DASHBOARD}/sessions`} className="flex items-center gap-2 text-[13px] text-slate-700 dark:text-slate-300">
                      <BarChart2 className="h-4 w-4" /><span>{user.role === "ADMIN" ? "Analytics" : "My Sessions"}</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800 my-1" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 focus:bg-red-50 dark:focus:bg-red-900/10 cursor-pointer rounded-[12px] p-2 transition-colors"
                >
                  <LogOut className="mr-2 h-4 w-4" /><span className="text-[13px] font-medium">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild className="rounded-full font-bold text-[13px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800 px-5">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild className="rounded-full bg-[#00ed64] text-[#001e2b] hover:bg-[#00b545] font-bold text-[13px] px-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-98 transition-all">
                <Link href="/register">Sign Up Free</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <Button
            variant="ghost" size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-full text-slate-500 relative overflow-hidden"
          >
            <motion.div
              initial={false}
              animate={{ rotate: currentTheme === "dark" ? 0 : 90, scale: currentTheme === "dark" ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="h-5 w-5" />
            </motion.div>
            <motion.div
              initial={false}
              animate={{ rotate: currentTheme === "light" ? 0 : -90, scale: currentTheme === "light" ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="h-5 w-5" />
            </motion.div>
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger>
              <div className="inline-flex items-center justify-center rounded-[12px] border border-slate-200 dark:border-slate-800 h-10 w-10 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
                <Menu className="h-5 w-5" />
              </div>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-l border-slate-200 dark:border-slate-800 p-6 sm:max-w-[300px]">
              <div className="flex items-center gap-3 mb-8 mt-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40">
                  <Leaf className="h-5 w-5 text-[#00ed64] fill-[#00ed64]/10" />
                </div>
                <span className="font-display font-medium text-2xl text-slate-900 dark:text-slate-50">
                  Skill<span className="text-[#00ed64]">Bridge</span>
                </span>
              </div>

              {user && (
                <div className="flex items-center gap-3 mb-6 p-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback className="bg-emerald-50 dark:bg-emerald-950/40 text-[#00b545] dark:text-[#00ed64] text-sm font-medium">{user.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="text-[14px] font-medium truncate text-slate-900 dark:text-slate-50">{user.name}</p>
                    <p className="text-[12px] text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-[12px] transition-colors font-medium text-[14px]",
                        isActive
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-[#00b545] dark:text-[#00ed64]"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50"
                      )}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.name}
                    </Link>
                  )
                })}
                {!user && (
                  <Link
                    href={ROUTES.CONTACT}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-[12px] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50 font-medium text-[14px] transition-colors"
                  >
                    <Mail className="h-4 w-4" /> Contact
                  </Link>
                )}

                <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mt-4 flex flex-col space-y-3">
                  {isPending ? (
                    <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-[12px] animate-pulse" />
                  ) : user ? (
                    <Button
                      variant="destructive"
                      className="rounded-[12px] h-12 w-full bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                      onClick={() => { handleSignOut(); setIsOpen(false); }}
                    >
                      <LogOut className="mr-2 h-5 w-5" /> Log out
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" asChild className="rounded-full h-12 border-slate-200 dark:border-slate-800 text-[14px] font-bold" onClick={() => setIsOpen(false)}>
                        <Link href="/login">Log In</Link>
                      </Button>
                      <Button asChild className="rounded-full h-12 bg-[#00ed64] text-[#001e2b] hover:bg-[#00b545] text-[14px] font-bold shadow-sm" onClick={() => setIsOpen(false)}>
                        <Link href="/register">Sign Up Free</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
