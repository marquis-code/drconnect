import { Document, Schema as MongooseSchema } from "mongoose";
export declare class Settings extends Document {
    physicalConsultationFee: number;
    virtualConsultationFee: number;
    clinicLocation: string;
    clinicLatitude: number;
    clinicLongitude: number;
    contactEmail: string;
    contactPhone: string;
    businessHours: Record<string, any> | null;
    bankDetails: Record<string, any> | null;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const SettingsSchema: MongooseSchema<Settings, import("mongoose").Model<Settings, any, any, any, Document<unknown, any, Settings, any, {}> & Settings & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Settings, Document<unknown, {}, import("mongoose").FlatRecord<Settings>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Settings> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
