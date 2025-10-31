import { AdminService } from "./admin.service";
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalAppointments: number;
        completedAppointments: number;
        totalRevenue: any;
    }>;
    getAllUsers(): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/user.schema").User, {}, {}> & import("../schemas/user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAllAppointments(status?: string): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAllTransactions(): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/transaction.schema").Transaction, {}, {}> & import("../schemas/transaction.schema").Transaction & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    setAvailability(availabilityData: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/availability.schema").Availability, {}, {}> & import("../schemas/availability.schema").Availability & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAvailability(): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/availability.schema").Availability, {}, {}> & import("../schemas/availability.schema").Availability & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAvailabilityByDate(date?: string, time?: string, consultationType?: string): Promise<{
        date: string;
        dayOfWeek: number;
        time: string;
        availability: ({
            consultationType: string;
            isAvailable: boolean;
            reason: string;
            time?: undefined;
            timeSlot?: undefined;
        } | {
            consultationType: string;
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
            consultationType: string;
            isAvailable: boolean;
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
