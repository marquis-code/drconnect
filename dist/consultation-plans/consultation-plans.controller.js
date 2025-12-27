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
let ConsultationPlansController = class ConsultationPlansController {
    constructor(consultationPlansService) {
        this.consultationPlansService = consultationPlansService;
    }
    async createPlan(createPlanDto) {
        return this.consultationPlansService.createPlan(createPlanDto);
    }
    async getAllPlans(includeInactive) {
        return this.consultationPlansService.getAllPlans(includeInactive || false);
    }
    async getAvailablePlansForDate(date) {
        return this.consultationPlansService.getAvailablePlansForDate(new Date(date));
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
    async deletePlan(id) {
        await this.consultationPlansService.deletePlan(id);
        return { message: "Consultation plan deleted successfully" };
    }
};
exports.ConsultationPlansController = ConsultationPlansController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_consultation_plan_dto_1.CreateConsultationPlanDto]),
    __metadata("design:returntype", Promise)
], ConsultationPlansController.prototype, "createPlan", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("includeInactive", new common_1.ParseBoolPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], ConsultationPlansController.prototype, "getAllPlans", null);
__decorate([
    (0, common_1.Get)("available/:date"),
    __param(0, (0, common_1.Param)("date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConsultationPlansController.prototype, "getAvailablePlansForDate", null);
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
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
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