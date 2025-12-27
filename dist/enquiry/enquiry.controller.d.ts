import { EnquiryService } from './enquiry.service';
import { CreateEnquiryDto, UpdateEnquiryDto, QueryEnquiryDto } from './dto/create-enquiry.dto';
import { EnquiryStatus } from '../schemas/enquiry.schema';
export declare class EnquiryController {
    private readonly enquiryService;
    constructor(enquiryService: EnquiryService);
    create(createEnquiryDto: CreateEnquiryDto, req: any): Promise<import("../schemas/enquiry.schema").Enquiry>;
    findAll(queryDto: QueryEnquiryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../schemas/enquiry.schema").Enquiry, {}, {}> & import("../schemas/enquiry.schema").Enquiry & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getStatistics(): Promise<{
        total: number;
        byStatus: any;
        byPriority: any;
        recentEnquiries: (import("mongoose").Document<unknown, {}, import("../schemas/enquiry.schema").Enquiry, {}, {}> & import("../schemas/enquiry.schema").Enquiry & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
    }>;
    findOne(id: string): Promise<import("../schemas/enquiry.schema").Enquiry>;
    update(id: string, updateEnquiryDto: UpdateEnquiryDto): Promise<import("../schemas/enquiry.schema").Enquiry>;
    remove(id: string): Promise<void>;
    assignEnquiry(id: string, assignedTo: string): Promise<import("../schemas/enquiry.schema").Enquiry>;
    bulkUpdateStatus(ids: string[], status: EnquiryStatus): Promise<{
        message: string;
        count: number;
    }>;
}
