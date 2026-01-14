import { ConsultationType, ConsultationMode, ConsultationCategory } from "../../schemas/availability.schema";
declare class TimeSlotDto {
    startTime: string;
    endTime: string;
}
export declare class CreateAvailabilityDto {
    doctorId?: string;
    dayOfWeek: number;
    timeSlots: TimeSlotDto[];
    consultationCategory: ConsultationCategory;
    allowedConsultationTypes?: ConsultationType[];
    allowedConsultationModes?: ConsultationMode[];
    isAvailable?: boolean;
    location?: string;
    maxConcurrentAppointments?: number;
    slotDuration?: number;
    bufferTime?: number;
    overrideDate?: string;
    overrideReason?: string;
    isRecurring?: boolean;
    effectiveFrom?: string;
    effectiveTo?: string;
}
export {};
