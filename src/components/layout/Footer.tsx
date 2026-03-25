import Link from "next/link";
import { Zap, Github, Twitter, Linkedin } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export function Footer() {
    return (
        <footer className="bg-gray-950 dark:bg-gray-950 text-gray-400 border-t border-white/5">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="space-y-4 md:col-span-1">
                        <Link href={ROUTES.HOME} className="flex items-center space-x-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-btn shadow-sm">
                                <Zap className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white">
                                Skill<span className="gradient-text">Bridge</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed">
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
                                    className="text-gray-500 hover:text-primary transition-colors"
                                    aria-label={label}
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Platform */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-4">Platform</h3>
                        <ul className="space-y-3">
                            {[
                                { href: ROUTES.TUTORS, label: "Find Tutors" },
                                { href: ROUTES.REGISTER, label: "Become a Tutor" },
                                { href: "#", label: "How It Works" },
                                { href: "#", label: "Pricing" },
                            ].map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-sm hover:text-primary transition-colors">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-4">Support</h3>
                        <ul className="space-y-3">
                            {["Help Center", "Terms of Service", "Privacy Policy", "Contact Us"].map((l) => (
                                <li key={l}>
                                    <Link href="#" className="text-sm hover:text-primary transition-colors">
                                        {l}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter teaser */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-4">Stay in the Loop</h3>
                        <p className="text-sm mb-4">Get the latest tutor picks and learning tips.</p>
                        <Link
                            href={ROUTES.REGISTER}
                            className="inline-block text-sm gradient-btn px-4 py-2 rounded-full font-semibold text-white shadow-md"
                        >
                            Join for free →
                        </Link>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-600">
                    <p>© {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
                    <p>Built with Next.js, Tailwind CSS &amp; ❤️</p>
                </div>
            </div>
        </footer>
    );
}
