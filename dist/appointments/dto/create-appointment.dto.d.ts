import { ConsultationType, ConsultationMode, ConsultationCategory } from "src/schemas/shared-enums";
export declare class CreateAppointmentDto {
    planId: string;
    doctorId?: string;
    consultationType: ConsultationType;
    consultationCategory: ConsultationCategory;
    consultationMode: ConsultationMode;
    date: string;
    timeSlot: string;
    duration: number;
    location?: string;
    price: number;
    patientNotes?: string;
    chiefComplaint?: string;
    symptoms?: string[];
    previousAppointmentId?: string;
}
