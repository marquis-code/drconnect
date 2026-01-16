import { AdminService } from "./admin.service";
import { AppointmentStatus } from "src/schemas/shared-enums";
import { ConsultationCategory } from "src/schemas/availability.schema";
import { UserRole } from "src/schemas/user.schema";
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getDashboardStats(): Promise<{
        totalPatients: number;
        totalDoctors: number;
        totalAppointments: number;
        completedAppointments: number;
        pendingAppointments: number;
        totalRevenue: any;
    }>;
    getAllUsers(role?: UserRole): Promise<(import("mongoose").Document<unknown, {}, import("src/schemas/user.schema").User, {}, {}> & import("src/schemas/user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAllDoctors(): Promise<(import("mongoose").Document<unknown, {}, import("src/schemas/user.schema").User, {}, {}> & import("src/schemas/user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    verifyDoctor(doctorId: string, user: any): Promise<import("mongoose").Document<unknown, {}, import("src/schemas/user.schema").User, {}, {}> & import("src/schemas/user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAllAppointments(status?: AppointmentStatus): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAllTransactions(): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/transaction.schema").Transaction, {}, {}> & import("../schemas/transaction.schema").Transaction & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    setAvailability(availabilityData: any): Promise<import("mongoose").Document<unknown, {}, import("src/schemas/availability.schema").Availability, {}, {}> & import("src/schemas/availability.schema").Availability & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAvailability(doctorId?: string): Promise<(import("mongoose").Document<unknown, {}, import("src/schemas/availability.schema").Availability, {}, {}> & import("src/schemas/availability.schema").Availability & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAvailabilityByDate(date?: string, time?: string, consultationCategory?: ConsultationCategory, doctorId?: string): Promise<{
        date: string;
        dayOfWeek: number;
        time: string;
        availability: ({
            consultationCategory: ConsultationCategory;
            doctorId: import("mongoose").Types.ObjectId;
            isAvailable: boolean;
            reason: string;
            time?: undefined;
            timeSlot?: undefined;
        } | {
            consultationCategory: ConsultationCategory;
            doctorId: import("mongoose").Types.ObjectId;
            time: string;
            timeSlot: {
                startTime: string;
                endTime: string;
            };
            isAvailable: boolean;
            reason: string;
        })[];
    } | {
        date: string;
        dayOfWeek: number;
        availability: {
            _id: unknown;
            dayOfWeek: number;
            consultationCategory: ConsultationCategory;
            doctorId: import("mongoose").Types.ObjectId;
            isAvailable: boolean;
            allowedConsultationTypes: import("src/schemas/availability.schema").ConsultationType[];
            allowedConsultationModes: import("src/schemas/availability.schema").ConsultationMode[];
            location: string;
            maxConcurrentAppointments: number;
            slotDuration: number;
            bufferTime: number;
            timeSlots: {
                startTime: string;
                endTime: string;
                isAvailable: boolean;
            }[];
        }[];
        time?: undefined;
    }>;
    updateSettings(settingsData: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/settings.schema").Settings, {}, {}> & import("../schemas/settings.schema").Settings & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getSettings(): Promise<import("mongoose").Document<unknown, {}, import("../schemas/settings.schema").Settings, {}, {}> & import("../schemas/settings.schema").Settings & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    exportTransactions(): Promise<(import("mongoose").FlattenMaps<import("../schemas/transaction.schema").Transaction> & Required<{
        _id: import("mongoose").FlattenMaps<unknown>;
    }> & {
        __v: number;
    })[]>;
    exportAppointments(): Promise<(import("mongoose").FlattenMaps<import("../schemas/appointment.schema").Appointment> & Required<{
        _id: import("mongoose").FlattenMaps<unknown>;
    }> & {
        __v: number;
    })[]>;
}
