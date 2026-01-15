import { type Model } from "mongoose";
import { Appointment } from "src/schemas/appointment.schema";
import { ConsultationPlansService } from "../consultation-plans/consultation-plans.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { RescheduleAppointmentDto } from "./dto/reschedule-appointment.dto";
import { CompleteAppointmentDto } from "./dto/complete-appointment.dto";
import { QueryAppointmentsDto } from "./dto/query-appointments.dto";
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
    private calculateScheduledStartTime;
    checkSlotAvailability(date: string, timeSlot: string, consultationType: string, doctorId?: string): Promise<boolean>;
    generateMeetLinkAfterPayment(appointmentId: string): Promise<string>;
    getPatientStatus(userId: string): Promise<{
        isNewPatient: boolean;
        isExistingPatient: boolean;
        completedAppointments: number;
    }>;
    getAppointments(userId: string, role: string, queryDto: QueryAppointmentsDto): Promise<(import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getUserUpcomingAppointments(userId: string): Promise<(import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getUserPastAppointments(userId: string): Promise<(import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAppointmentById(appointmentId: string, userId: string, role: string): Promise<import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateAppointment(appointmentId: string, updateDto: UpdateAppointmentDto, userId: string, role: string): Promise<import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    cancelAppointment(appointmentId: string, cancellationReason: string, canceledBy: string, userId: string, role: string): Promise<import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    rescheduleAppointment(appointmentId: string, rescheduleDto: RescheduleAppointmentDto, userId: string, role: string): Promise<import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    completeAppointment(appointmentId: string, completeDto: CompleteAppointmentDto, doctorId: string): Promise<import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    checkInAppointment(appointmentId: string, userId: string): Promise<import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    startAppointment(appointmentId: string, doctorId: string): Promise<import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    confirmAppointment(appointmentId: string): Promise<import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    rateAppointment(appointmentId: string, rating: number, feedback: string | undefined, userId: string, role: string): Promise<import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getMeetLink(appointmentId: string, userId: string, role: string): Promise<{
        meetLink: string;
    }>;
    getAppointmentStatistics(userId: string, role: string): Promise<{
        total: number;
        completed: number;
        canceled: number;
        upcoming: number;
        completionRate: string | number;
    }>;
    getUpcomingAppointments(): Promise<(import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
