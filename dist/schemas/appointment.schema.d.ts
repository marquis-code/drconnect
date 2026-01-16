import { Document, Types } from "mongoose";
import { ConsultationType, ConsultationMode, ConsultationCategory, AppointmentStatus, PaymentStatus } from "./shared-enums";
export declare class Appointment extends Document {
    userId: Types.ObjectId;
    doctorId: Types.ObjectId;
    planId: Types.ObjectId;
    consultationType: ConsultationType;
    consultationCategory: ConsultationCategory;
    consultationMode: ConsultationMode;
    date: Date;
    timeSlot: string;
    duration: number;
    location: string;
    price: number;
    paymentStatus: PaymentStatus;
    transactionReference: string;
    paymentMethod: string;
    status: AppointmentStatus;
    cancellationReason: string;
    canceledBy: string;
    canceledAt: Date;
    googleMeetLink: string;
    meetingRoomId: string;
    meetingPassword: string;
    patientNotes: string;
    chiefComplaint: string;
    symptoms: string[];
    doctorNotes: string;
    diagnosis: string;
    prescription: string;
    attachments: string[];
    followUpRequired: boolean;
    followUpDate: Date;
    previousAppointmentId: Types.ObjectId;
    nextAppointmentId: Types.ObjectId;
    scheduledStartTime: Date;
    actualStartTime: Date;
    actualEndTime: Date;
    checkedInAt: Date;
    reminderSent: boolean;
    reminderSentAt: Date;
    patientRating: number;
    patientFeedback: string;
    doctorRating: number;
    doctorFeedback: string;
    metadata: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
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
