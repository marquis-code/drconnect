import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { RescheduleAppointmentDto } from "./dto/reschedule-appointment.dto";
import { Request } from "express";
export declare class AppointmentsController {
    private appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    createAppointment(createAppointmentDto: CreateAppointmentDto, req: Request): Promise<import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAppointments(req: Request): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAppointmentById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    cancelAppointment(id: string, body: {
        reason: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    rescheduleAppointment(id: string, rescheduleDto: RescheduleAppointmentDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    completeAppointment(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
