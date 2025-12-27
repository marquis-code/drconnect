import { type Model } from "mongoose";
import { Appointment } from "src/schemas/appointment.schema";
import { ConsultationPlansService } from "../consultation-plans/consultation-plans.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { RescheduleAppointmentDto } from "./dto/reschedule-appointment.dto";
import { GoogleMeetService } from "src/integrations/google-meet.service";
export declare class AppointmentsService {
    private appointmentModel;
    private googleMeetService;
    private consultationPlansService;
    constructor(appointmentModel: Model<Appointment>, googleMeetService: GoogleMeetService, consultationPlansService: ConsultationPlansService);
    createAppointment(userId: string, createAppointmentDto: CreateAppointmentDto): Promise<import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    checkSlotAvailability(date: string, timeSlot: string, consultationType: string): Promise<boolean>;
    generateMeetLinkAfterPayment(appointmentId: string): Promise<string>;
    getAppointments(userId: string, role: string): Promise<(import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAppointmentById(appointmentId: string): Promise<import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    cancelAppointment(appointmentId: string, cancellationReason: string): Promise<import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    rescheduleAppointment(appointmentId: string, rescheduleDto: RescheduleAppointmentDto): Promise<import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    completeAppointment(appointmentId: string): Promise<import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getUpcomingAppointments(): Promise<(import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
