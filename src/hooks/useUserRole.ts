import { useSession } from "./useSession";

export function useUserRole() {
    const { user, isLoading } = useSession();

    return {
        role: user?.role ?? null,
        isLoading,
        isAdmin: user?.role === "ADMIN",
        isTutor: user?.role === "TUTOR",
        isStudent: user?.role === "STUDENT",
    };
}
