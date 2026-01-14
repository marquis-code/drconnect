import { ConsultationType, ConsultationMode, ConsultationCategory } from "../../schemas/consultation-plan.schema";
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
}
