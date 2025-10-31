import { AdminService } from "./admin.service";
export declare class PublicController {
    private adminService;
    constructor(adminService: AdminService);
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
    getSettings(): Promise<import("mongoose").Document<unknown, {}, import("../schemas/settings.schema").Settings, {}, {}> & import("../schemas/settings.schema").Settings & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
