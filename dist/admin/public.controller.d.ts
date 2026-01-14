import { AdminService } from "./admin.service";
import { ConsultationCategory } from "src/schemas/availability.schema";
export declare class PublicController {
    private adminService;
    constructor(adminService: AdminService);
    getAvailabilityByDate(date?: string, time?: string, consultationCategory?: string, doctorId?: string): Promise<{
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
    getSettings(): Promise<import("mongoose").Document<unknown, {}, import("../schemas/settings.schema").Settings, {}, {}> & import("../schemas/settings.schema").Settings & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
