import { Document } from "mongoose";
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
export declare class ConsultationPlan extends Document {
    name: string;
    description: string;
    consultationType: ConsultationType;
    consultationCategory: ConsultationCategory;
    duration: number;
    price: number;
    availableDays: number[];
    availableTimeRange: string | null;
    isActive: boolean;
    consultationModes: ConsultationMode[];
    sortOrder: number;
    tags: string[];
    requiresPreApproval: boolean;
    preparationInstructions: string | null;
    minAdvanceBookingHours: number;
    maxAdvanceBookingHours: number;
    isNewPatientOnly: boolean;
    isExistingPatientOnly: boolean;
    specialtyRequired: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const ConsultationPlanSchema: import("mongoose").Schema<ConsultationPlan, import("mongoose").Model<ConsultationPlan, any, any, any, Document<unknown, any, ConsultationPlan, any, {}> & ConsultationPlan & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ConsultationPlan, Document<unknown, {}, import("mongoose").FlatRecord<ConsultationPlan>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ConsultationPlan> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
