export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
    role: "STUDENT" | "TUTOR" | "ADMIN";
    banned?: boolean;
    banReason?: string | null;
    banExpires?: Date | null;
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
