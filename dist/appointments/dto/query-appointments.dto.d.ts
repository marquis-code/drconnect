import { ConsultationType, AppointmentStatus, PaymentStatus } from "src/schemas/shared-enums";
export declare class QueryAppointmentsDto {
    userId?: string;
    doctorId?: string;
    status?: AppointmentStatus;
    consultationType?: ConsultationType;
    paymentStatus?: PaymentStatus;
    dateFrom?: string;
    dateTo?: string;
    searchTerm?: string;
}
