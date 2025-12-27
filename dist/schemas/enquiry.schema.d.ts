import { Document } from 'mongoose';
export declare enum EnquiryStatus {
    NEW = "new",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
    CLOSED = "closed"
}
export declare enum EnquiryPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare class Enquiry extends Document {
    fullName: string;
    email: string;
    phone: string;
    message: string;
    status: EnquiryStatus;
    priority: EnquiryPriority;
    assignedTo?: string;
    tags: string[];
    notes?: string;
    resolvedAt?: Date;
    ipAddress?: string;
    userAgent?: string;
}
export declare const EnquirySchema: import("mongoose").Schema<Enquiry, import("mongoose").Model<Enquiry, any, any, any, Document<unknown, any, Enquiry, any, {}> & Enquiry & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Enquiry, Document<unknown, {}, import("mongoose").FlatRecord<Enquiry>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Enquiry> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
