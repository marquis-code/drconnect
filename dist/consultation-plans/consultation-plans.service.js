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
exports.ConsultationPlansService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const consultation_plan_schema_1 = require("../schemas/consultation-plan.schema");
let ConsultationPlansService = class ConsultationPlansService {
    constructor(consultationPlanModel) {
        this.consultationPlanModel = consultationPlanModel;
    }
    async createPlan(createPlanDto) {
        const plan = new this.consultationPlanModel(createPlanDto);
        return plan.save();
    }
    async getAllPlans(includeInactive = false) {
        const query = includeInactive ? {} : { isActive: true };
        return this.consultationPlanModel.find(query).sort({ sortOrder: 1, createdAt: 1 });
    }
    async getPlanById(planId) {
        const plan = await this.consultationPlanModel.findById(planId);
        if (!plan) {
            throw new common_1.NotFoundException("Consultation plan not found");
        }
        return plan;
    }
    async updatePlan(planId, updatePlanDto) {
        const plan = await this.consultationPlanModel.findByIdAndUpdate(planId, updatePlanDto, { new: true });
        if (!plan) {
            throw new common_1.NotFoundException("Consultation plan not found");
        }
        return plan;
    }
    async deletePlan(planId) {
        const result = await this.consultationPlanModel.findByIdAndDelete(planId);
        if (!result) {
            throw new common_1.NotFoundException("Consultation plan not found");
        }
    }
    async togglePlanStatus(planId) {
        const plan = await this.consultationPlanModel.findById(planId);
        if (!plan) {
            throw new common_1.NotFoundException("Consultation plan not found");
        }
        plan.isActive = !plan.isActive;
        return plan.save();
    }
    async isPlanAvailableForDateTime(planId, date, timeSlot) {
        const plan = await this.getPlanById(planId);
        if (!plan.isActive) {
            return false;
        }
        const dayOfWeek = date.getDay();
        if (!plan.availableDays.includes(dayOfWeek)) {
            return false;
        }
        if (plan.availableTimeRange) {
            const [startTime, endTime] = plan.availableTimeRange.split("-");
            const slotTime = timeSlot.split("-")[0];
            if (slotTime < startTime || slotTime > endTime) {
                return false;
            }
        }
        return true;
    }
    async getAvailablePlansForDate(date) {
        const dayOfWeek = date.getDay();
        return this.consultationPlanModel.find({
            isActive: true,
            availableDays: dayOfWeek
        }).sort({ sortOrder: 1 });
    }
};
exports.ConsultationPlansService = ConsultationPlansService;
exports.ConsultationPlansService = ConsultationPlansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(consultation_plan_schema_1.ConsultationPlan.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ConsultationPlansService);
//# sourceMappingURL=consultation-plans.service.js.map