import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { getServerSession } from "@/lib/serverAuth";
import { ROUTES } from "@/constants/routes";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionData = await getServerSession();

  if (!sessionData?.user) {
    redirect(ROUTES.LOGIN);
  }

  const role = sessionData.user.role;
  if (role !== "STUDENT" && role !== "ADMIN") {
    if (role === "TUTOR") redirect(ROUTES.TUTOR_DASHBOARD);
    if (role === "ADMIN") redirect(ROUTES.ADMIN_DASHBOARD);
    redirect(ROUTES.HOME);
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
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
