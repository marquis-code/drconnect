export declare class CreateConsultationPlanDto {
    name: string;
    description: string;
    consultationType: string;
    duration: number;
    price: number;
    availableDays: number[];
    availableTimeRange?: string;
    isActive?: boolean;
    consultationModes?: string[];
    sortOrder?: number;
}
