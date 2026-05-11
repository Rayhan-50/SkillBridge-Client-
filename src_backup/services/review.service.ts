import api from "@/lib/api";
import { Review } from "@/types"; // We will add Review type in types

export const reviewService = {
    createReview: async (data: { bookingId: string; tutorId: string; rating: number; comment: string }): Promise<Review> => {
        const response = await api.post<{ data: Review }>("/reviews", data);
        return response.data?.data || (response.data as unknown as Review);
    }
};
