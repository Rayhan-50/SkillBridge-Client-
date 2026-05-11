import api from "@/lib/api";
import { TutorProfile, ApiResponse } from "@/types";

export interface TutorFilters {
    search?: string;
    category?: string;
    minRate?: number;
    maxRate?: number;
    rating?: number;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
}

export const tutorService = {
    getTutors: async (filters?: TutorFilters): Promise<ApiResponse<TutorProfile[]>> => {
        // Convert filters to query params
        const params = new URLSearchParams();
        if (filters) {
            if (filters.search) params.append("search", filters.search);
            if (filters.category) params.append("category", filters.category);
            if (filters.minRate) params.append("minRate", filters.minRate.toString());
            if (filters.maxRate) params.append("maxRate", filters.maxRate.toString());
            if (filters.rating) params.append("rating", filters.rating.toString());
            if (filters.sortBy) params.append("sortBy", filters.sortBy);
            if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
            if (filters.page) params.append("page", filters.page.toString());
            if (filters.limit) params.append("limit", filters.limit.toString());
        }

        const response = await api.get<ApiResponse<TutorProfile[]>>(`/tutors?${params.toString()}`);
        return response.data;
    },

    getTutorById: async (id: string): Promise<TutorProfile> => {
        const response = await api.get<any>(`/tutors/${id}`);
        return response.data.data || response.data; // fallback based on how api shapes single responses
    },

    getCategories: async () => {
        const response = await api.get<any>("/categories");
        return response.data?.data || response.data;
    },

    // Tutor Availability
    getAvailability: async () => {
        const response = await api.get<any>("/tutor/availability");
        return response.data?.data || response.data;
    },

    updateAvailability: async (availability: any) => {
        const response = await api.put<any>("/tutor/availability", { schedule: availability });
        return response.data;
    }
};
