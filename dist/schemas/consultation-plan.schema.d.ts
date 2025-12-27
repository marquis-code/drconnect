import { Document } from "mongoose";
export declare class ConsultationPlan extends Document {
    name: string;
    description: string;
    consultationType: string;
    duration: number;
    price: number;
    availableDays: number[];
    availableTimeRange: string | null;
    isActive: boolean;
    consultationModes: string[];
    sortOrder: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const ConsultationPlanSchema: import("mongoose").Schema<ConsultationPlan, import("mongoose").Model<ConsultationPlan, any, any, any, Document<unknown, any, ConsultationPlan, any, {}> & ConsultationPlan & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ConsultationPlan, Document<unknown, {}, import("mongoose").FlatRecord<ConsultationPlan>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ConsultationPlan> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
