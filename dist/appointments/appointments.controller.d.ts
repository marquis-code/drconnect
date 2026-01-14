import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { RescheduleAppointmentDto } from "./dto/reschedule-appointment.dto";
import { CancelAppointmentDto } from "./dto/cancel-appointment.dto";
import { CompleteAppointmentDto } from "./dto/complete-appointment.dto";
import { RateAppointmentDto } from "./dto/rate-appointment.dto";
import { QueryAppointmentsDto } from "./dto/query-appointments.dto";
import { Request } from "express";
export declare class AppointmentsController {
    private appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    createAppointment(createAppointmentDto: CreateAppointmentDto, req: Request): Promise<import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAppointments(queryDto: QueryAppointmentsDto, req: Request): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getUpcomingAppointments(req: Request): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getPastAppointments(req: Request): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAppointmentStatistics(req: Request): Promise<{
        total: number;
        completed: number;
        canceled: number;
        upcoming: number;
        completionRate: string | number;
    }>;
    getAppointmentById(id: string, req: Request): Promise<import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateAppointment(id: string, updateDto: UpdateAppointmentDto, req: Request): Promise<import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    cancelAppointment(id: string, cancelDto: CancelAppointmentDto, req: Request): Promise<import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    rescheduleAppointment(id: string, rescheduleDto: RescheduleAppointmentDto, req: Request): Promise<import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    completeAppointment(id: string, completeDto: CompleteAppointmentDto, req: Request): Promise<import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    checkInAppointment(id: string, req: Request): Promise<import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    rateAppointment(id: string, rateDto: RateAppointmentDto, req: Request): Promise<import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    confirmAppointment(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    startAppointment(id: string, req: Request): Promise<import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getMeetLink(id: string, req: Request): Promise<{
        meetLink: string;
    }>;
}
