"use server";

import { revalidateTag } from "next/cache";
import { Category } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://skillbridge-server-nu.vercel.app/api";

export async function getCategories(): Promise<Category[]> {
    try {
        const response = await fetch(`${API_URL}/categories`, {
            next: {
                revalidate: 3600, // Revalidate every hour
                tags: ["categories"],
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
    revalidateTag("categories");
    return { revalidated: true, now: Date.now() };
}
