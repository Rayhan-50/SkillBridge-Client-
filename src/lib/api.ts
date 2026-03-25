import axios from "axios";
import { env } from "@/env";
import { ROUTES } from "@/constants/routes";

// Create an Axios instance
const api = axios.create({
    baseURL: env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // Required for better-auth cookies
    headers: {
        "Content-Type": "application/json",
    },
});

// Response interceptor — only redirect on 401 for non-public pages
// The middleware already blocks unauthenticated users from protected routes,
// so this is a last-resort fallback. Avoid hard reloads where possible.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response?.status === 401 &&
            typeof window !== "undefined" &&
            !window.location.pathname.startsWith("/login") &&
            !window.location.pathname.startsWith("/register")
        ) {
            window.location.href = ROUTES.LOGIN;
        }
        return Promise.reject(error);
    }
);

export default api;
