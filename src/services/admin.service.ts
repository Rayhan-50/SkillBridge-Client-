import api from "@/lib/api";
import { User, ApiResponse } from "@/types";

export const adminService = {
    getUsers: async (): Promise<ApiResponse<User[]>> => {
        const response = await api.get<ApiResponse<User[]>>("/admin/users");
        // Depending on backend, might be { data: [...] } or { success: true, data: [...] }
        return response.data;
    },

    updateUserStatus: async (userId: string, isBanned: boolean): Promise<User> => {
        const response = await api.patch<User>(`/admin/users/${userId}`, { status: isBanned ? "BANNED" : "ACTIVE" });
        return response.data;
    },

    updateUserRole: async (userId: string, role: string): Promise<User> => {
        const response = await api.patch<User>(`/admin/users/${userId}`, { role });
        return response.data;
    },

    getStats: async (): Promise<any> => {
        const response = await api.get<any>("/admin/stats");
        return response.data;
    },

    deleteUser: async (userId: string): Promise<any> => {
        const response = await api.delete<any>(`/admin/users/${userId}`);
        return response.data;
    },

    // Category Management
    createCategory: async (data: { name: string, slug: string, description?: string, iconUrl?: string }): Promise<any> => {
        const response = await api.post<any>("/categories", data);
        return response.data;
    },

    updateCategory: async (id: string, data: { name?: string, slug?: string, description?: string, iconUrl?: string }): Promise<any> => {
        const response = await api.patch<any>(`/categories/${id}`, data);
        return response.data;
    },

    deleteCategory: async (id: string): Promise<any> => {
        const response = await api.delete<any>(`/categories/${id}`);
        return response.data;
    }
};
