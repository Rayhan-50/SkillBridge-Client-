import { getServerSession } from "@/lib/serverAuth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

// Server-side auth guard — no client-side flash, no ProtectedRoute needed
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const sessionData = await getServerSession();

    if (!sessionData?.user) {
        redirect(ROUTES.LOGIN);
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden relative">
            {/* Sidebar for Desktop */}
            <div className="hidden md:flex w-64 flex-col border-r bg-muted/20">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto w-full p-4 md:p-8">
                    <div className="mx-auto max-w-6xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
