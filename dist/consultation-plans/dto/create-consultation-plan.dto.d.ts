import { ConsultationType, ConsultationMode, ConsultationCategory, MentalHealthSubType } from "src/schemas/shared-enums";
export declare class CreateConsultationPlanDto {
    name: string;
    description: string;
    consultationType: ConsultationType;
    consultationCategory: ConsultationCategory;
    duration: number;
    price: number;
    availableDays?: number[];
    availableTimeRange?: string;
    isActive?: boolean;
    consultationModes: ConsultationMode[];
    sortOrder?: number;
    tags?: string[];
    requiresPreApproval?: boolean;
    preparationInstructions?: string;
    minAdvanceBookingHours?: number;
    maxAdvanceBookingHours?: number;
    isNewPatientOnly?: boolean;
    isExistingPatientOnly?: boolean;
    specialtyRequired?: string;
    mentalHealthSubType?: MentalHealthSubType;
    includesPrescription?: boolean;
    isPriority?: boolean;
    isCouplesTherapy?: boolean;
    isGroupTherapy?: boolean;
    specialConditions?: string;
}
export declare class BatchCreateConsultationPlansDto {
    plans: CreateConsultationPlanDto[];
}
