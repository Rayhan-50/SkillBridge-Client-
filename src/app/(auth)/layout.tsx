import { ReactNode } from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center p-8 bg-background relative flex-1">
                <div className="absolute top-8 left-8">
                    <Link href={ROUTES.HOME} className="flex items-center space-x-2">
                        <GraduationCap className="h-6 w-6 text-primary" />
                        <span className="font-bold text-xl tracking-tight">SkillBridge</span>
                    </Link>
                </div>
                {children}
            </div>
            <div className="hidden md:flex flex-col bg-muted/30 border-l justify-center items-center py-12 px-8">
                <div className="max-w-md text-center">
                    <GraduationCap className="h-24 w-24 text-primary mx-auto mb-8 opacity-90" />
                    <h2 className="text-3xl font-bold mb-4">Learn From The Best</h2>
                    <p className="text-muted-foreground text-lg mb-8">
                        Join thousands of students and tutors on the #1 educational platform for 1-on-1 personalized learning.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="bg-background p-4 rounded-xl shadow-sm border">
                            <h4 className="font-semibold mb-1">Expert Tutors</h4>
                            <p className="text-sm text-muted-foreground">Rigorous vetting process</p>
                        </div>
                        <div className="bg-background p-4 rounded-xl shadow-sm border">
                            <h4 className="font-semibold mb-1">Flexible Scheduling</h4>
                            <p className="text-sm text-muted-foreground">Learn at your own pace</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
