import { useSession as useBetterAuthSession } from "@/lib/auth-client";

// Define the shape of our User including the custom field
export interface AuthUser {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
    role?: "ADMIN" | "TUTOR" | "STUDENT";
}

export function useSession() {
    const { data: session, isPending, error } = useBetterAuthSession();

    // Explicitly cast the user to our custom type
    const user = session?.user as AuthUser | undefined;

    return {
        session: session?.session ?? null,
        user,
        isLoading: isPending,
        error,
        isAuthenticated: !!user,
    };
}