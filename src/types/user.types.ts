export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
    role: "STUDENT" | "TUTOR" | "ADMIN";
    status?: "ACTIVE" | "INACTIVE" | "BANNED";
}

export interface Session {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
}