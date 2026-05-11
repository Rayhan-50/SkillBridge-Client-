import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, AlertCircle } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:30px_30px]" />

            <div className="z-10 flex flex-col items-center text-center px-4 max-w-md">
                <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 relative">
                    <GraduationCap className="h-12 w-12 text-primary" />
                    <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                    </div>
                </div>

                <h1 className="text-6xl font-black mb-4 tracking-tighter">404</h1>
                <h2 className="text-2xl font-bold mb-3 tracking-tight">Page Not Found</h2>
                <p className="text-muted-foreground mb-8 text-lg">
                    The class you're looking for seems to have moved or doesn't exist. Let's get you back on track.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Button asChild size="lg" className="flex-1">
                        <Link href={ROUTES.HOME}>Return Home</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="flex-1">
                        <Link href={ROUTES.TUTORS}>Find a Tutor</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
