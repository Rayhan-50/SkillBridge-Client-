import api from "@/lib/api";
import { Booking } from "@/types";

export interface CreateBookingDto {
    tutorId: string;
    date: string;
    startTime: string;
    endTime: string;
    price: number;
    status?: "PENDING";
}

export const bookingService = {
    getMyBookings: async (): Promise<Booking[]> => {
        const response = await api.get<{ data: Booking[] }>("/bookings/my-bookings");
        return response.data?.data || (response.data as unknown as Booking[]);
    },

    createBooking: async (data: CreateBookingDto): Promise<Booking> => {
        const response = await api.post<{ data: Booking }>("/bookings", data);
        return response.data?.data || (response.data as unknown as Booking);
    },

    updateBookingStatus: async (id: string, status: string): Promise<Booking> => {
        const response = await api.patch<{ data: Booking }>(`/bookings/${id}`, { status });
        return response.data?.data || (response.data as unknown as Booking);
    },
};
