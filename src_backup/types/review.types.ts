import { User } from "./user.types";
import { TutorProfile } from "./tutor.types";
import { Booking } from "./booking.types";

export interface Review {
    id: string;
    rating: number;
    comment: string;
    studentId: string;
    tutorId: string;
    bookingId: string;
    student: User;
    tutor: TutorProfile;
    booking: Booking;
    createdAt: Date;
    updatedAt: Date;
}
