import { AppointmentStatus, ConsultationType, PaymentStatus } from "../../schemas/appointment.schema";
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
