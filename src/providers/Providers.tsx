"use client";

import { ThemeProvider } from "next-themes";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange={false}
        >
            <QueryProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </QueryProvider>
            <Toaster />
        </ThemeProvider>
    );
}
