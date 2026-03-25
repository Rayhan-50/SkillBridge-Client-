import { getServerSession } from "@/lib/serverAuth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileSidebar } from "@/components/layout/MobileSidebar";

// Server-side auth guard — no client-side flash, no ProtectedRoute needed
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const sessionData = await getServerSession();

    if (!sessionData?.user) {
        redirect(ROUTES.LOGIN);
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex w-64 shrink-0 flex-col">
                <Sidebar />
            </div>

            {/* Right panel */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile top bar */}
                <div className="md:hidden flex items-center gap-3 h-14 px-4 border-b border-border/50 bg-background/80 backdrop-blur-sm shrink-0">
                    <MobileSidebar />
                    <span className="font-bold text-base">
                        Skill<span className="gradient-text">Bridge</span>
                    </span>
                </div>

                <main className="flex-1 overflow-y-auto w-full p-4 md:p-6 lg:p-8">
                    <div className="mx-auto max-w-6xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
