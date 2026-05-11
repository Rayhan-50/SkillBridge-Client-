import { ReactNode } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left — Form panel */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-10 bg-background relative">
                {/* Logo */}
                <div className="absolute top-6 left-6">
                    <Link href={ROUTES.HOME} className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-btn shadow-sm">
                            <Zap className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">
                            Skill<span className="gradient-text">Bridge</span>
                        </span>
                    </Link>
                </div>
                <div className="w-full max-w-sm">
                    {children}
                </div>
            </div>

            {/* Right — Brand panel (hidden on mobile) */}
            <div className="hidden lg:flex flex-col hero-gradient border-l border-border/30 justify-center items-center py-12 px-10">
                <div className="max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-btn shadow-xl mb-8">
                        <Zap className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-foreground dark:text-white">
                        Learn From <span className="gradient-text">The Best</span>
                    </h2>
                    <p className="text-muted-foreground dark:text-white/70 text-base mb-10 leading-relaxed">
                        Join thousands of students and tutors on the #1 educational platform for personalized 1-on-1 learning.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-left">
                        {[
                            { title: "Expert Tutors", desc: "Rigorous vetting process" },
                            { title: "Flexible Scheduling", desc: "Learn at your own pace" },
                            { title: "Secure Payments", desc: "Protected transactions" },
                            { title: "Live Sessions", desc: "Real-time video tutoring" },
                        ].map((item) => (
                            <div key={item.title} className="bg-background/50 backdrop-blur-sm border border-border/50 p-4 rounded-xl">
                                <h4 className="font-semibold text-sm mb-1 text-foreground dark:text-white">{item.title}</h4>
                                <p className="text-xs text-muted-foreground dark:text-white/60">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
