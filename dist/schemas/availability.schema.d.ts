import { Document } from "mongoose";
export declare class Availability extends Document {
    dayOfWeek: number;
    timeSlots: Array<{
        startTime: string;
        endTime: string;
    }>;
    consultationType: string;
    isAvailable: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const AvailabilitySchema: import("mongoose").Schema<Availability, import("mongoose").Model<Availability, any, any, any, Document<unknown, any, Availability, any, {}> & Availability & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Availability, Document<unknown, {}, import("mongoose").FlatRecord<Availability>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Availability> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
