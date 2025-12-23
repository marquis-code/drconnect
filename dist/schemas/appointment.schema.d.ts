import { Document, Types } from "mongoose";
export declare class Appointment extends Document {
    userId: Types.ObjectId;
    consultationType: string;
    consultationMode: string;
    date: Date;
    timeSlot: string;
    location: string;
    price: number;
    paymentStatus: string;
    transactionReference: string;
    status: string;
    cancellationReason: string;
    googleMeetLink: string;
}
export declare const AppointmentSchema: import("mongoose").Schema<Appointment, import("mongoose").Model<Appointment, any, any, any, Document<unknown, any, Appointment, any, {}> & Appointment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Appointment, Document<unknown, {}, import("mongoose").FlatRecord<Appointment>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Appointment> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
