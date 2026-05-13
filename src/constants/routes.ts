export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    TUTORS: "/tutors",
    CATEGORIES: "/categories",
    ABOUT: "/about",
    CONTACT: "/contact",
    BLOG: "/blog",
    PRIVACY: "/privacy",
    STUDENT_DASHBOARD: "/dashboard",
    TUTOR_DASHBOARD: "/tutor/dashboard",
    ADMIN_DASHBOARD: "/admin",
    ADMIN_ANALYTICS: "/admin/analytics",
    ADMIN_TUTORS: "/admin/tutors",
} as const;

export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.TUTORS,
    ROUTES.CATEGORIES,
    ROUTES.BLOG,
    ROUTES.ABOUT,
    ROUTES.CONTACT,
    ROUTES.PRIVACY,
];

export const STUDENT_ROUTES = ["/dashboard"];
export const TUTOR_ROUTES = ["/tutor"];
export const ADMIN_ROUTES = ["/admin"];