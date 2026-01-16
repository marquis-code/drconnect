import { Model } from "mongoose";
import { User, UserRole } from "src/schemas/user.schema";
import { Appointment } from "src/schemas/appointment.schema";
import { Transaction } from "src/schemas/transaction.schema";
import { Availability } from "src/schemas/availability.schema";
import { Settings } from "src/schemas/settings.schema";
import { ConsultationCategory, AppointmentStatus } from "src/schemas/shared-enums";
export declare class AdminService {
    private userModel;
    private appointmentModel;
    private transactionModel;
    private availabilityModel;
    private settingsModel;
    constructor(userModel: Model<User>, appointmentModel: Model<Appointment>, transactionModel: Model<Transaction>, availabilityModel: Model<Availability>, settingsModel: Model<Settings>);
    getDashboardStats(): Promise<{
        totalPatients: number;
        totalDoctors: number;
        totalAppointments: number;
        completedAppointments: number;
        pendingAppointments: number;
        totalRevenue: any;
    }>;
    getAllUsers(filter?: any): Promise<(import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getUsersByRole(role: UserRole): Promise<(import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAllDoctors(): Promise<(import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    verifyDoctor(doctorId: string, adminId: string): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAllAppointments(filter?: any): Promise<(import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAppointmentsByStatus(status: AppointmentStatus): Promise<(import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAllTransactions(): Promise<(import("mongoose").Document<unknown, {}, Transaction, {}, {}> & Transaction & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    setAvailability(availabilityData: any): Promise<import("mongoose").Document<unknown, {}, Availability, {}, {}> & Availability & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAvailability(doctorId?: string): Promise<(import("mongoose").Document<unknown, {}, Availability, {}, {}> & Availability & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAvailabilityByDate(dateString?: string, timeString?: string, consultationCategory?: ConsultationCategory, doctorId?: string): Promise<{
        date: string;
        dayOfWeek: number;
        time: string;
        availability: ({
            consultationCategory: import("src/schemas/availability.schema").ConsultationCategory;
            doctorId: import("mongoose").Types.ObjectId;
            isAvailable: boolean;
            reason: string;
            time?: undefined;
            timeSlot?: undefined;
        } | {
            consultationCategory: import("src/schemas/availability.schema").ConsultationCategory;
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
            consultationCategory: import("src/schemas/availability.schema").ConsultationCategory;
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
    updateSettings(settingsData: any): Promise<import("mongoose").Document<unknown, {}, Settings, {}, {}> & Settings & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getSettings(): Promise<import("mongoose").Document<unknown, {}, Settings, {}, {}> & Settings & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    exportTransactions(): Promise<(import("mongoose").FlattenMaps<Transaction> & Required<{
        _id: import("mongoose").FlattenMaps<unknown>;
    }> & {
        __v: number;
    })[]>;
    exportAppointments(): Promise<(import("mongoose").FlattenMaps<Appointment> & Required<{
        _id: import("mongoose").FlattenMaps<unknown>;
    }> & {
        __v: number;
    })[]>;
}
