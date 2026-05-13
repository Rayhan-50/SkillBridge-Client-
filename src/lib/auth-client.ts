import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { env } from "@/env";

// better-auth requires a full absolute URL — relative paths like "/api/auth" are rejected.
// In the browser we construct it from the current origin; on the server we fall back
// to the backend URL (the middleware proxies /api/auth/* anyway).
const rawUrl = env.NEXT_PUBLIC_BETTER_AUTH_URL || "/api/auth";
const baseURL = rawUrl.startsWith("http")
    ? rawUrl
    : typeof window !== "undefined"
        ? `${window.location.origin}${rawUrl}`
        : `${process.env.BACKEND_URL || "http://localhost:4000"}${rawUrl}`;

export const authClient = createAuthClient({
    baseURL,
    plugins: [
        inferAdditionalFields({
            user: {
                role: { type: "string", required: false },
                status: { type: "string", required: false },
                phone: { type: "string", required: false },
            },
        }),
    ],
});

export const { signIn, signUp, signOut, useSession: useBetterAuthSession } = authClient;

// Re-export for backward compatibility with hooks/useSession
export const useSession = useBetterAuthSession;