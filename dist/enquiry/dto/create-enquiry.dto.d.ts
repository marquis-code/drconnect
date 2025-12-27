import { EnquiryStatus, EnquiryPriority } from '../../schemas/enquiry.schema';
export declare class CreateEnquiryDto {
    fullName: string;
    email: string;
    phone: string;
    message: string;
    ipAddress?: string;
    userAgent?: string;
}
export declare class UpdateEnquiryDto {
    fullName?: string;
    email?: string;
    phone?: string;
    message?: string;
    status?: EnquiryStatus;
    priority?: EnquiryPriority;
    assignedTo?: string;
    tags?: string[];
    notes?: string;
}
export declare class QueryEnquiryDto {
    status?: EnquiryStatus;
    priority?: EnquiryPriority;
    assignedTo?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class EnquiryResponseDto {
    id: string;
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
    createdAt: Date;
    updatedAt: Date;
}
