export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    TUTORS: "/tutors",
    STUDENT_DASHBOARD: "/dashboard",
    TUTOR_DASHBOARD: "/tutor/dashboard",
    ADMIN_DASHBOARD: "/admin",
} as const;

export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.TUTORS,
];

export const STUDENT_ROUTES = ["/dashboard"];
export const TUTOR_ROUTES = ["/tutor"];
export const ADMIN_ROUTES = ["/admin"];
