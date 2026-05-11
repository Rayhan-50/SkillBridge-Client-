import Link from "next/link";
import { Zap, Github, Twitter, Linkedin } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export function Footer() {
    return (
        <footer className="bg-background relative overflow-hidden border-t border-border/50">
            {/* Background glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 blur-[150px] pointer-events-none" />
            
            <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand */}
                    <div className="space-y-6 md:col-span-1">
                        <Link href={ROUTES.HOME} className="flex items-center space-x-3 group">
                            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl gradient-btn shadow-[0_0_15px_rgba(45,212,191,0.3)]">
                                <Zap className="h-5 w-5 text-white group-hover:animate-pulse" />
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-[neon-ping_2s_infinite]" />
                            </div>
                            <span className="font-display font-bold text-2xl tracking-tight">
                                Skill<span className="gradient-text">Bridge</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            Connect with world-class tutors and learn anything, anytime, anywhere. Your journey to mastery starts here.
                        </p>
                        {/* Social icons */}
                        <div className="flex space-x-4 pt-2">
                            {[
                                { Icon: Twitter, href: "#", label: "Twitter" },
                                { Icon: Github, href: "#", label: "GitHub" },
                                { Icon: Linkedin, href: "#", label: "LinkedIn" },
                            ].map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:shadow-[0_0_15px_rgba(45,212,191,0.2)] transition-all duration-300"
                                    aria-label={label}
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Platform */}
                    <div>
                        <h3 className="text-xs font-display font-bold text-foreground uppercase tracking-widest mb-6">Platform</h3>
                        <ul className="space-y-4">
                            {[
                                { href: ROUTES.TUTORS, label: "Find Tutors" },
                                { href: ROUTES.REGISTER, label: "Become a Tutor" },
                                { href: "/#how-it-works", label: "How It Works" },
                                { href: "/#pricing", label: "Pricing" },
                            ].map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 rounded-full bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-xs font-display font-bold text-foreground uppercase tracking-widest mb-6">Support</h3>
                        <ul className="space-y-4">
                            {[
                                { href: ROUTES.ABOUT, label: "About Us" },
                                { href: ROUTES.BLOG, label: "Blog" },
                                { href: ROUTES.PRIVACY, label: "Privacy Policy" },
                                { href: ROUTES.CONTACT, label: "Contact Us" },
                            ].map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 rounded-full bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter teaser */}
                    <div>
                        <h3 className="text-xs font-display font-bold text-foreground uppercase tracking-widest mb-6">Stay in the Loop</h3>
                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Get the latest tutor picks and learning tips directly to your inbox.</p>
                        <Link
                            href={ROUTES.REGISTER}
                            className="inline-flex items-center justify-center text-sm gradient-btn px-6 py-3 rounded-full font-bold text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 w-full sm:w-auto"
                        >
                            Join for free <span className="ml-2">→</span>
                        </Link>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-muted-foreground">
                    <p>© {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Built with Next.js, Tailwind v4 &amp; <span className="text-rose-500 animate-pulse">❤️</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
