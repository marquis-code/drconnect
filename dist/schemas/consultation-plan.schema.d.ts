import { Document } from "mongoose";
import { ConsultationType, ConsultationMode, ConsultationCategory, MentalHealthSubType } from "./shared-enums";
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
    mentalHealthSubType: MentalHealthSubType | null;
    includesPrescription: boolean;
    isPriority: boolean;
    isCouplesTherapy: boolean;
    isGroupTherapy: boolean;
    specialConditions: string | null;
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
