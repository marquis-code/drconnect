import { Model } from 'mongoose';
import { Enquiry, EnquiryStatus } from '../schemas/enquiry.schema';
import { CreateEnquiryDto, UpdateEnquiryDto, QueryEnquiryDto } from './dto/create-enquiry.dto';
export declare class EnquiryService {
    private enquiryModel;
    constructor(enquiryModel: Model<Enquiry>);
    create(createEnquiryDto: CreateEnquiryDto): Promise<Enquiry>;
    findAll(queryDto: QueryEnquiryDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, Enquiry, {}, {}> & Enquiry & Required<{
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
    findOne(id: string): Promise<Enquiry>;
    update(id: string, updateEnquiryDto: UpdateEnquiryDto): Promise<Enquiry>;
    remove(id: string): Promise<void>;
    getStatistics(): Promise<{
        total: number;
        byStatus: any;
        byPriority: any;
        recentEnquiries: (import("mongoose").Document<unknown, {}, Enquiry, {}, {}> & Enquiry & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
    }>;
    bulkUpdateStatus(ids: string[], status: EnquiryStatus): Promise<number>;
    assignEnquiry(id: string, assignedTo: string): Promise<Enquiry>;
}
