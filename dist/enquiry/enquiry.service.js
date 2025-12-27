"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnquiryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const enquiry_schema_1 = require("../schemas/enquiry.schema");
let EnquiryService = class EnquiryService {
    constructor(enquiryModel) {
        this.enquiryModel = enquiryModel;
    }
    async create(createEnquiryDto) {
        try {
            const enquiry = new this.enquiryModel(createEnquiryDto);
            return await enquiry.save();
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create enquiry');
        }
    }
    async findAll(queryDto) {
        const { status, priority, assignedTo, search, page, limit, sortBy, sortOrder } = queryDto;
        const query = {};
        if (status)
            query.status = status;
        if (priority)
            query.priority = priority;
        if (assignedTo)
            query.assignedTo = assignedTo;
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } },
            ];
        }
        const skip = (page - 1) * limit;
        const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const [data, total] = await Promise.all([
            this.enquiryModel
                .find(query)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.enquiryModel.countDocuments(query),
        ]);
        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const enquiry = await this.enquiryModel.findById(id).exec();
        if (!enquiry) {
            throw new common_1.NotFoundException(`Enquiry with ID ${id} not found`);
        }
        return enquiry;
    }
    async update(id, updateEnquiryDto) {
        const enquiry = await this.enquiryModel
            .findByIdAndUpdate(id, updateEnquiryDto, { new: true })
            .exec();
        if (!enquiry) {
            throw new common_1.NotFoundException(`Enquiry with ID ${id} not found`);
        }
        if (updateEnquiryDto.status === enquiry_schema_1.EnquiryStatus.RESOLVED && !enquiry.resolvedAt) {
            enquiry.resolvedAt = new Date();
            await enquiry.save();
        }
        return enquiry;
    }
    async remove(id) {
        const result = await this.enquiryModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Enquiry with ID ${id} not found`);
        }
    }
    async getStatistics() {
        const total = await this.enquiryModel.countDocuments();
        const byStatus = await this.enquiryModel.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);
        const byPriority = await this.enquiryModel.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 },
                },
            },
        ]);
        const recentEnquiries = await this.enquiryModel
            .find()
            .sort({ createdAt: -1 })
            .limit(5)
            .exec();
        return {
            total,
            byStatus: byStatus.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {}),
            byPriority: byPriority.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {}),
            recentEnquiries,
        };
    }
    async bulkUpdateStatus(ids, status) {
        const result = await this.enquiryModel.updateMany({ _id: { $in: ids } }, { status });
        return result.modifiedCount;
    }
    async assignEnquiry(id, assignedTo) {
        return this.update(id, { assignedTo });
    }
};
exports.EnquiryService = EnquiryService;
exports.EnquiryService = EnquiryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(enquiry_schema_1.Enquiry.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], EnquiryService);
//# sourceMappingURL=enquiry.service.js.map