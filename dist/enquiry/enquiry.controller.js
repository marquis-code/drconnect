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
exports.EnquiryController = void 0;
const common_1 = require("@nestjs/common");
const enquiry_service_1 = require("./enquiry.service");
const create_enquiry_dto_1 = require("./dto/create-enquiry.dto");
const enquiry_schema_1 = require("../schemas/enquiry.schema");
let EnquiryController = class EnquiryController {
    constructor(enquiryService) {
        this.enquiryService = enquiryService;
    }
    async create(createEnquiryDto, req) {
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];
        return this.enquiryService.create(Object.assign(Object.assign({}, createEnquiryDto), { ipAddress,
            userAgent }));
    }
    async findAll(queryDto) {
        return this.enquiryService.findAll(queryDto);
    }
    async getStatistics() {
        return this.enquiryService.getStatistics();
    }
    async findOne(id) {
        return this.enquiryService.findOne(id);
    }
    async update(id, updateEnquiryDto) {
        return this.enquiryService.update(id, updateEnquiryDto);
    }
    async remove(id) {
        return this.enquiryService.remove(id);
    }
    async assignEnquiry(id, assignedTo) {
        return this.enquiryService.assignEnquiry(id, assignedTo);
    }
    async bulkUpdateStatus(ids, status) {
        const count = await this.enquiryService.bulkUpdateStatus(ids, status);
        return {
            message: `Successfully updated ${count} enquiries`,
            count,
        };
    }
};
exports.EnquiryController = EnquiryController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_enquiry_dto_1.CreateEnquiryDto, Object]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_enquiry_dto_1.QueryEnquiryDto]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_enquiry_dto_1.UpdateEnquiryDto]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/assign'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('assignedTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "assignEnquiry", null);
__decorate([
    (0, common_1.Patch)('bulk/status'),
    __param(0, (0, common_1.Body)('ids')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String]),
    __metadata("design:returntype", Promise)
], EnquiryController.prototype, "bulkUpdateStatus", null);
exports.EnquiryController = EnquiryController = __decorate([
    (0, common_1.Controller)('enquiries'),
    __metadata("design:paramtypes", [enquiry_service_1.EnquiryService])
], EnquiryController);
//# sourceMappingURL=enquiry.controller.js.map