import { Document, Types } from "mongoose";
export declare enum AppointmentStatus {
    BOOKED = "booked",
    CONFIRMED = "confirmed",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELED = "canceled",
    NO_SHOW = "no_show",
    RESCHEDULED = "rescheduled"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    SUCCESSFUL = "successful",
    FAILED = "failed",
    REFUNDED = "refunded",
    PARTIALLY_REFUNDED = "partially_refunded"
}
export declare enum ConsultationType {
    FIRST_CONTACT = "first_contact",
    FOLLOW_UP = "follow_up",
    MEDICAL_REVIEW = "medical_review",
    EMERGENCY = "emergency",
    ROUTINE_CHECKUP = "routine_checkup",
    PRESCRIPTION_REFILL = "prescription_refill",
    LAB_RESULT_REVIEW = "lab_result_review",
    SECOND_OPINION = "second_opinion",
    MENTAL_HEALTH = "mental_health",
    CHRONIC_DISEASE_MANAGEMENT = "chronic_disease_management",
    PRENATAL_POSTNATAL = "prenatal_postnatal",
    PEDIATRIC = "pediatric",
    GERIATRIC = "geriatric",
    NUTRITION_COUNSELING = "nutrition_counseling",
    PRE_OPERATIVE = "pre_operative",
    POST_OPERATIVE = "post_operative",
    PROCEDURE_CONSULTATION = "procedure_consultation",
    HEALTH_SCREENING = "health_screening",
    WELLNESS_CONSULTATION = "wellness_consultation",
    VACCINATION = "vaccination",
    SICK_NOTE = "sick_note",
    REFERRAL = "referral"
}
export declare enum ConsultationMode {
    VIDEO = "video",
    VOICE = "voice",
    CHAT = "chat",
    IN_PERSON = "in_person"
}
export declare enum ConsultationCategory {
    PHYSICAL = "physical",
    VIRTUAL = "virtual",
    HYBRID = "hybrid"
}
export declare class Appointment extends Document {
    userId: Types.ObjectId;
    doctorId: Types.ObjectId;
    planId: Types.ObjectId;
    consultationType: ConsultationType;
    consultationCategory: ConsultationCategory;
    consultationMode: ConsultationMode;
    date: Date;
    timeSlot: string;
    duration: number;
    location: string;
    price: number;
    paymentStatus: PaymentStatus;
    transactionReference: string;
    paymentMethod: string;
    status: AppointmentStatus;
    cancellationReason: string;
    canceledBy: string;
    canceledAt: Date;
    googleMeetLink: string;
    meetingRoomId: string;
    meetingPassword: string;
    patientNotes: string;
    chiefComplaint: string;
    symptoms: string[];
    doctorNotes: string;
    diagnosis: string;
    prescription: string;
    attachments: string[];
    followUpRequired: boolean;
    followUpDate: Date;
    previousAppointmentId: Types.ObjectId;
    nextAppointmentId: Types.ObjectId;
    scheduledStartTime: Date;
    actualStartTime: Date;
    actualEndTime: Date;
    checkedInAt: Date;
    reminderSent: boolean;
    reminderSentAt: Date;
    patientRating: number;
    patientFeedback: string;
    doctorRating: number;
    doctorFeedback: string;
    metadata: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const AppointmentSchema: import("mongoose").Schema<Appointment, import("mongoose").Model<Appointment, any, any, any, Document<unknown, any, Appointment, any, {}> & Appointment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Appointment, Document<unknown, {}, import("mongoose").FlatRecord<Appointment>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Appointment> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
