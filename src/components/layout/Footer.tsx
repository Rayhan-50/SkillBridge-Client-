import Link from "next/link";
import { Leaf, Github, Twitter, Linkedin } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export function Footer() {
    return (
        <footer className="bg-[#001e2b] text-white relative overflow-hidden border-t border-emerald-950/40">
            {/* Background glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00a35c]/5 blur-[150px] pointer-events-none" />
            
            <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand */}
                    <div className="space-y-6 md:col-span-1">
                        <Link href={ROUTES.HOME} className="flex items-center space-x-3 group">
                            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-emerald-950/60 shadow-sm border border-emerald-500/30 group-hover:scale-105 transition-transform duration-300">
                                <Leaf className="h-5 w-5 text-[#00ed64] fill-[#00ed64]/10 group-hover:animate-pulse" />
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00ed64] rounded-full" />
                            </div>
                            <span className="font-display font-bold text-2xl tracking-tight text-white">
                                Skill<span className="text-[#00ed64]">Bridge</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
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
                                    className="w-10 h-10 rounded-full border border-emerald-950/80 bg-emerald-950/20 hover:bg-emerald-900/40 flex items-center justify-center text-slate-400 hover:text-[#00ed64] hover:border-[#00ed64]/50 hover:shadow-[0_0_15px_rgba(0,237,100,0.2)] transition-all duration-300"
                                    aria-label={label}
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Platform */}
                    <div>
                        <h3 className="text-xs font-display font-bold text-[#00ed64] uppercase tracking-widest mb-6">Platform</h3>
                        <ul className="space-y-4">
                            {[
                                { href: ROUTES.TUTORS, label: "Find Tutors" },
                                { href: ROUTES.REGISTER, label: "Become a Tutor" },
                                { href: "/#how-it-works", label: "How It Works" },
                                { href: "/#pricing", label: "Pricing" },
                            ].map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-sm text-slate-300 hover:text-[#00ed64] transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ed64] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-xs font-display font-bold text-[#00ed64] uppercase tracking-widest mb-6">Support</h3>
                        <ul className="space-y-4">
                            {[
                                { href: ROUTES.ABOUT, label: "About Us" },
                                { href: ROUTES.BLOG, label: "Blog" },
                                { href: ROUTES.PRIVACY, label: "Privacy Policy" },
                                { href: ROUTES.CONTACT, label: "Contact Us" },
                            ].map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-sm text-slate-300 hover:text-[#00ed64] transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ed64] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter teaser */}
                    <div>
                        <h3 className="text-xs font-display font-bold text-[#00ed64] uppercase tracking-widest mb-6">Stay in the Loop</h3>
                        <p className="text-sm text-slate-300 mb-6 leading-relaxed">Get the latest tutor picks and learning tips directly to your inbox.</p>
                        <Link
                            href={ROUTES.REGISTER}
                            className="inline-flex items-center justify-center text-sm bg-[#00ed64] text-[#001e2b] hover:bg-[#00b545] px-6 py-3 rounded-full font-bold shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/30 transition-all duration-300 w-full sm:w-auto"
                        >
                            Join for free <span className="ml-2">→</span>
                        </Link>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-16 pt-8 border-t border-emerald-950/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
                    <p>© {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Built with Next.js, Tailwind v4 &amp; <span className="text-emerald-400">Leaf Green</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
