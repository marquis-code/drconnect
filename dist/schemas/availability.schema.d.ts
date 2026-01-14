import { Document, Types } from "mongoose";
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
export declare enum ConsultationCategory {
    PHYSICAL = "physical",
    VIRTUAL = "virtual",
    HYBRID = "hybrid"
}
export declare enum ConsultationMode {
    VIDEO = "video",
    VOICE = "voice",
    CHAT = "chat",
    IN_PERSON = "in_person"
}
export declare class Availability extends Document {
    doctorId: Types.ObjectId;
    dayOfWeek: number;
    timeSlots: Array<{
        startTime: string;
        endTime: string;
    }>;
    consultationCategory: ConsultationCategory;
    allowedConsultationTypes: ConsultationType[];
    allowedConsultationModes: ConsultationMode[];
    isAvailable: boolean;
    location: string;
    maxConcurrentAppointments: number;
    slotDuration: number;
    bufferTime: number;
    overrideDate: Date;
    overrideReason: string;
    isRecurring: boolean;
    effectiveFrom: Date;
    effectiveTo: Date;
    metadata: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const AvailabilitySchema: import("mongoose").Schema<Availability, import("mongoose").Model<Availability, any, any, any, Document<unknown, any, Availability, any, {}> & Availability & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Availability, Document<unknown, {}, import("mongoose").FlatRecord<Availability>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Availability> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
