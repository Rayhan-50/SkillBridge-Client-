export const ROLES = {
    STUDENT: "STUDENT",
    TUTOR: "TUTOR",
    ADMIN: "ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
