import { User } from "./user.types";

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    iconUrl?: string;
    _count?: {
        bookings: number;
    };
}

export interface TutorProfile {
    id: string;
    userId: string;
    user: User;
    bio: string;
    hourlyRate: number;
    rating: number;
    totalReviews: number;
    categories: Category[];
    subjects?: string[];
    languages?: string[];
    location?: string;
    headline?: string;
    experienceYears?: number;
    availability: JsonAvailability; // Basic availability rules
    createdAt: Date;
    updatedAt: Date;
}

export type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export interface TimeSlot {
    start: string; // e.g., "09:00"
    end: string;   // e.g., "17:00"
}

export type JsonAvailability = Partial<Record<DayOfWeek, TimeSlot[]>>;
