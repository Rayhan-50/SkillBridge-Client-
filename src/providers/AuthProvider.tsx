"use client";

import { useSession } from "@/lib/auth-client";
import { createContext, useContext, ReactNode } from "react";
import { User, Session } from "@/types";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isPending: boolean;
    error: Error | null;
    refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data, isPending, error, refetch } = useSession();

    return (
        <AuthContext.Provider
            value={{
                user: (data?.user as User) || null,
                session: (data?.session as unknown as Session) || null,
                isPending,
                error,
                refetch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};