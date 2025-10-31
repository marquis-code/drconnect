import { Model } from "mongoose";
import { User } from "src/schemas/user.schema";
import { Appointment } from "src/schemas/appointment.schema";
import { Transaction } from "src/schemas/transaction.schema";
import { Availability } from "src/schemas/availability.schema";
import { Settings } from "src/schemas/settings.schema";
export declare class AdminService {
    private userModel;
    private appointmentModel;
    private transactionModel;
    private availabilityModel;
    private settingsModel;
    constructor(userModel: Model<User>, appointmentModel: Model<Appointment>, transactionModel: Model<Transaction>, availabilityModel: Model<Availability>, settingsModel: Model<Settings>);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalAppointments: number;
        completedAppointments: number;
        totalRevenue: any;
    }>;
    getAllUsers(filter?: any): Promise<(import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAllAppointments(filter?: any): Promise<(import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAppointmentsByStatus(status: string): Promise<(import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
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
    getAvailability(): Promise<(import("mongoose").Document<unknown, {}, Availability, {}, {}> & Availability & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
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
