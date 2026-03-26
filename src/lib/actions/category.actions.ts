"use server";

import { revalidateTag } from "next/cache";
import { Category } from "@/types";

// Use BACKEND_URL for server-side API calls to avoid relative URL parsing errors
const API_URL = process.env.BACKEND_URL 
    ? `${process.env.BACKEND_URL}/api` 
    : "https://skillbridge-server-nu.vercel.app/api";

export async function getCategories(): Promise<Category[]> {
    try {
        const response = await fetch(`${API_URL}/categories`, {
            next: {
                revalidate: 3600, // Revalidate every hour
                tags: ["categories-v2"],
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data || data; // Handle depending on api response shape
    } catch (error) {
        console.error("[CATEGORY_ACTION] getCategories error:", error);
        return [];
    }
}

export async function revalidateCategoriesCache() {
    // @ts-expect-error - Next.js 16 canary type strictly requires a second 'profile' argument, but it works at runtime
    revalidateTag("categories-v2");
    return { revalidated: true, now: Date.now() };
}
