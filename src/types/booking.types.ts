import { User } from "./user.types";
import { TutorProfile } from "./tutor.types";

export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "REJECTED";

export interface Booking {
    id: string;
    studentId: string;
    tutorId: string;
    student: User;
    tutor: TutorProfile;
    category?: { name: string; iconUrl?: string | null } | null;
    categoryId?: string | null;
    date: Date | string;
    startTime: string; // e.g., "10:00"
    endTime: string;   // e.g., "11:00"
    status: BookingStatus;
    meetingLink?: string | null;
    notes?: string | null;
    price: number;
    review?: { id: string; rating: number; comment?: string } | null;
    createdAt: Date;
    updatedAt: Date;
}
