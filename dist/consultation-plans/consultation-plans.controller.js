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
exports.ConsultationPlansController = void 0;
const common_1 = require("@nestjs/common");
const consultation_plans_service_1 = require("./consultation-plans.service");
const create_consultation_plan_dto_1 = require("./dto/create-consultation-plan.dto");
const update_consultation_plan_dto_1 = require("./dto/update-consultation-plan.dto");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const admin_guard_1 = require("../auth/guards/admin.guard");
const consultation_plan_schema_1 = require("../schemas/consultation-plan.schema");
let ConsultationPlansController = class ConsultationPlansController {
    constructor(consultationPlansService) {
        this.consultationPlansService = consultationPlansService;
    }
    async batchCreatePlans(batchDto) {
        return this.consultationPlansService.batchCreatePlans(batchDto.plans);
    }
    async batchCreatePlansTransaction(batchDto) {
        return this.consultationPlansService.batchCreatePlansTransaction(batchDto.plans);
    }
    async createPlan(createPlanDto) {
        return this.consultationPlansService.createPlan(createPlanDto);
    }
    async getAllPlans(includeInactive, consultationType, consultationCategory, minPriceParam, maxPriceParam) {
        const minPrice = minPriceParam ? parseFloat(minPriceParam) : undefined;
        const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined;
        const validMinPrice = minPrice !== undefined && !isNaN(minPrice) ? minPrice : undefined;
        const validMaxPrice = maxPrice !== undefined && !isNaN(maxPrice) ? maxPrice : undefined;
        return this.consultationPlansService.getAllPlans({
            includeInactive: includeInactive || false,
            consultationType,
            consultationCategory,
            minPrice: validMinPrice,
            maxPrice: validMaxPrice
        });
    }
    async getAvailablePlansForDate(date, consultationType, consultationCategory) {
        return this.consultationPlansService.getAvailablePlansForDate(new Date(date), consultationType, consultationCategory);
    }
    async getPlansByType(consultationType) {
        return this.consultationPlansService.getPlansByType(consultationType);
    }
    async getPlansByCategory(consultationCategory) {
        return this.consultationPlansService.getPlansByCategory(consultationCategory);
    }
    async getPlansForNewPatients() {
        return this.consultationPlansService.getPlansForNewPatients();
    }
    async getPlansForExistingPatients() {
        return this.consultationPlansService.getPlansForExistingPatients();
    }
    async getPlanById(id) {
        return this.consultationPlansService.getPlanById(id);
    }
    async updatePlan(id, updatePlanDto) {
        return this.consultationPlansService.updatePlan(id, updatePlanDto);
    }
    async togglePlanStatus(id) {
        return this.consultationPlansService.togglePlanStatus(id);
    }
    async reorderPlans(orderData) {
        return this.consultationPlansService.reorderPlans(orderData);
    }
    async deletePlan(id) {
        await this.consultationPlansService.deletePlan(id);
    }
};
exports.ConsultationPlansController = ConsultationPlansController;
__decorate([
    (0, common_1.Post)('batch'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_consultation_plan_dto_1.BatchCreateConsultationPlansDto]),
    __metadata("design:returntype", Promise)
], ConsultationPlansController.prototype, "batchCreatePlans", null);
__decorate([
    (0, common_1.Post)('batch/transaction'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_consultation_plan_dto_1.BatchCreateConsultationPlansDto]),
    __metadata("design:returntype", Promise)
], ConsultationPlansController.prototype, "batchCreatePlansTransaction", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_consultation_plan_dto_1.CreateConsultationPlanDto]),
    __metadata("design:returntype", Promise)
], ConsultationPlansController.prototype, "createPlan", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("includeInactive", new common_1.ParseBoolPipe({ optional: true }))),
    __param(1, (0, common_1.Query)("consultationType")),
    __param(2, (0, common_1.Query)("consultationCategory")),
    __param(3, (0, common_1.Query)("minPrice")),
    __param(4, (0, common_1.Query)("maxPrice")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ConsultationPlansController.prototype, "getAllPlans", null);
__decorate([
    (0, common_1.Get)("available/:date"),
    __param(0, (0, common_1.Param)("date")),
    __param(1, (0, common_1.Query)("consultationType")),
    __param(2, (0, common_1.Query)("consultationCategory")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ConsultationPlansController.prototype, "getAvailablePlansForDate", null);
__decorate([
    (0, common_1.Get)("type/:consultationType"),
    __param(0, (0, common_1.Param)("consultationType")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsultationPlansController.prototype, "getPlansByType", null);
__decorate([
    (0, common_1.Get)("category/:consultationCategory"),
    __param(0, (0, common_1.Param)("consultationCategory")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsultationPlansController.prototype, "getPlansByCategory", null);
__decorate([
    (0, common_1.Get)("new-patients"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConsultationPlansController.prototype, "getPlansForNewPatients", null);
__decorate([
    (0, common_1.Get)("existing-patients"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConsultationPlansController.prototype, "getPlansForExistingPatients", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsultationPlansController.prototype, "getPlanById", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_consultation_plan_dto_1.UpdateConsultationPlanDto]),
    __metadata("design:returntype", Promise)
], ConsultationPlansController.prototype, "updatePlan", null);
__decorate([
    (0, common_1.Put)(":id/toggle-status"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsultationPlansController.prototype, "togglePlanStatus", null);
__decorate([
    (0, common_1.Put)("bulk/reorder"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ConsultationPlansController.prototype, "reorderPlans", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsultationPlansController.prototype, "deletePlan", null);
exports.ConsultationPlansController = ConsultationPlansController = __decorate([
    (0, common_1.Controller)("consultation-plans"),
    __metadata("design:paramtypes", [consultation_plans_service_1.ConsultationPlansService])
], ConsultationPlansController);
//# sourceMappingURL=consultation-plans.controller.js.map