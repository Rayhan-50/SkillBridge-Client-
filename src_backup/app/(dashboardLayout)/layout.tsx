import { getServerSession } from "@/lib/serverAuth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { DashboardTopBar } from "@/components/layout/DashboardTopBar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const sessionData = await getServerSession();

  if (!sessionData?.user) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 shrink-0 flex-col z-20">
        <Sidebar />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-primary/5 blur-[120px] pointer-events-none" />

        {/* Desktop Top Bar */}
        <div className="hidden md:block shrink-0 z-20 sticky top-0">
          <DashboardTopBar />
        </div>

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between h-16 px-4 border-b border-border/50 glass-card rounded-none shrink-0 z-20 sticky top-0">
          <div className="flex items-center gap-3">
            <MobileSidebar />
            <span className="font-display font-bold text-lg">
              Skill<span className="gradient-text">Bridge</span>
            </span>
          </div>
          <DashboardTopBar mobile />
        </div>

        <main className="flex-1 overflow-y-auto w-full p-4 md:p-6 lg:p-8 scroll-smooth relative z-10">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
