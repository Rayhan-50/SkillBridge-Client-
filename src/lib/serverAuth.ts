import { cookies } from "next/headers";
import { ROUTES } from "@/constants/routes";

export async function getServerSession() {
    try {
        const apiUrl = `${process.env.BACKEND_URL || "https://skillbridge-server-nu.vercel.app"}/api`;
        const baseUrl = apiUrl.endsWith('/api') ? apiUrl + '/auth' : apiUrl.replace('/api/v1', '/api/auth');
        
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

        const response = await fetch(`${baseUrl}/get-session`, {
            headers: { cookie: cookieHeader },
            cache: 'no-store'
        });

        if (response.ok) {
            return await response.json(); // { user: { role, ... }, session: { ... } }
        }
        return null;
    } catch (error) {
        console.error("Error fetching server session:", error);
        return null;
    }
}
