"use server";

import { revalidateTag } from "next/cache";
import { Category } from "@/types";

// Use BACKEND_URL for server-side API calls to avoid relative URL parsing errors
const API_URL = process.env.BACKEND_URL 
    ? `${process.env.BACKEND_URL}/api` 
    : "http://localhost:4000/api";

export async function getCategories(): Promise<Category[]> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_URL}/categories`, {
            next: {
                revalidate: 3600, // Revalidate every hour
                tags: ["categories-v2"],
            },
            signal: controller.signal,
        }).finally(() => clearTimeout(timeoutId));

        if (!response.ok) {
            console.warn(`[BUILD] Categories fetch failed: ${response.statusText}`);
            return [];
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.warn(`[BUILD] Categories endpoint returned non-JSON response: ${contentType}`);
            return [];
        }

        const data = await response.json();
        return data.data || data;
    } catch (error: any) {
        console.warn("[BUILD] getCategories error:", error.message);
        return [];
    }
}

export async function revalidateCategoriesCache() {
    revalidateTag("categories-v2", "default");
    return { revalidated: true, now: Date.now() };
}
