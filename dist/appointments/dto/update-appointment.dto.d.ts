import { CreateAppointmentDto } from "./create-appointment.dto";
import { AppointmentStatus, PaymentStatus } from "../../schemas/appointment.schema";
declare const UpdateAppointmentDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateAppointmentDto>>;
export declare class UpdateAppointmentDto extends UpdateAppointmentDto_base {
    status?: AppointmentStatus;
    paymentStatus?: PaymentStatus;
    transactionReference?: string;
    paymentMethod?: string;
    googleMeetLink?: string;
    meetingRoomId?: string;
    doctorNotes?: string;
    diagnosis?: string;
    prescription?: string;
    followUpRequired?: boolean;
    followUpDate?: string;
}
export {};
