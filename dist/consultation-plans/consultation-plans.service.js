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
        if (createPlanDto.isNewPatientOnly && createPlanDto.isExistingPatientOnly) {
            throw new common_1.BadRequestException("Plan cannot be for both new and existing patients only");
        }
        if (createPlanDto.availableTimeRange) {
            this.validateTimeRange(createPlanDto.availableTimeRange);
        }
        const existingPlan = await this.consultationPlanModel.findOne({
            name: createPlanDto.name
        });
        if (existingPlan) {
            throw new common_1.ConflictException("A consultation plan with this name already exists");
        }
        const plan = new this.consultationPlanModel(createPlanDto);
        return plan.save();
    }
    async getAllPlans(options = {}) {
        const { includeInactive = false, consultationType, consultationCategory, minPrice, maxPrice } = options;
        const query = {};
        if (!includeInactive) {
            query.isActive = true;
        }
        if (consultationType) {
            query.consultationType = consultationType;
        }
        if (consultationCategory) {
            query.consultationCategory = consultationCategory;
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined) {
                query.price.$gte = minPrice;
            }
            if (maxPrice !== undefined) {
                query.price.$lte = maxPrice;
            }
        }
        return this.consultationPlanModel
            .find(query)
            .sort({ sortOrder: 1, createdAt: 1 })
            .exec();
    }
    async getPlanById(planId) {
        const plan = await this.consultationPlanModel.findById(planId);
        if (!plan) {
            throw new common_1.NotFoundException("Consultation plan not found");
        }
        return plan;
    }
    async getPlansByType(consultationType) {
        return this.consultationPlanModel
            .find({ consultationType, isActive: true })
            .sort({ sortOrder: 1, price: 1 })
            .exec();
    }
    async getPlansByCategory(consultationCategory) {
        return this.consultationPlanModel
            .find({ consultationCategory, isActive: true })
            .sort({ sortOrder: 1, price: 1 })
            .exec();
    }
    async getPlansForNewPatients() {
        return this.consultationPlanModel
            .find({
            isActive: true,
            $or: [
                { isNewPatientOnly: true },
                { isNewPatientOnly: false, isExistingPatientOnly: false }
            ]
        })
            .sort({ sortOrder: 1 })
            .exec();
    }
    async getPlansForExistingPatients() {
        return this.consultationPlanModel
            .find({
            isActive: true,
            $or: [
                { isExistingPatientOnly: true },
                { isNewPatientOnly: false, isExistingPatientOnly: false }
            ]
        })
            .sort({ sortOrder: 1 })
            .exec();
    }
    async updatePlan(planId, updatePlanDto) {
        if (updatePlanDto.isNewPatientOnly && updatePlanDto.isExistingPatientOnly) {
            throw new common_1.BadRequestException("Plan cannot be for both new and existing patients only");
        }
        if (updatePlanDto.availableTimeRange) {
            this.validateTimeRange(updatePlanDto.availableTimeRange);
        }
        if (updatePlanDto.name) {
            const existingPlan = await this.consultationPlanModel.findOne({
                name: updatePlanDto.name,
                _id: { $ne: planId }
            });
            if (existingPlan) {
                throw new common_1.ConflictException("A consultation plan with this name already exists");
            }
        }
        const plan = await this.consultationPlanModel.findByIdAndUpdate(planId, updatePlanDto, { new: true, runValidators: true });
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
    async reorderPlans(orderData) {
        const bulkOps = orderData.map(item => ({
            updateOne: {
                filter: { _id: item.planId },
                update: { sortOrder: item.sortOrder }
            }
        }));
        await this.consultationPlanModel.bulkWrite(bulkOps);
    }
    async isPlanAvailableForDateTime(planId, date, timeSlot) {
        const plan = await this.getPlanById(planId);
        if (!plan.isActive) {
            return false;
        }
        const dayOfWeek = date.getUTCDay();
        if (plan.availableDays && plan.availableDays.length > 0) {
            if (!plan.availableDays.includes(dayOfWeek)) {
                return false;
            }
        }
        if (plan.availableTimeRange) {
            const [startTime, endTime] = plan.availableTimeRange.split("-");
            const slotStartTime = timeSlot.split("-")[0];
            const slotEndTime = timeSlot.split("-")[1];
            if (slotStartTime < startTime || slotEndTime > endTime) {
                return false;
            }
        }
        const now = new Date();
        const hoursDifference = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (plan.minAdvanceBookingHours && hoursDifference < plan.minAdvanceBookingHours) {
            return false;
        }
        if (plan.maxAdvanceBookingHours && hoursDifference > plan.maxAdvanceBookingHours) {
            return false;
        }
        return true;
    }
    async getAvailablePlansForDate(date, consultationType, consultationCategory) {
        const dayOfWeek = date.getUTCDay();
        const query = {
            isActive: true,
            $or: [
                { availableDays: dayOfWeek },
                { availableDays: { $size: 0 } }
            ]
        };
        if (consultationType) {
            query.consultationType = consultationType;
        }
        if (consultationCategory) {
            query.consultationCategory = consultationCategory;
        }
        const plans = await this.consultationPlanModel
            .find(query)
            .sort({ sortOrder: 1 })
            .exec();
        const now = new Date();
        return plans.filter(plan => {
            const hoursDifference = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
            if (plan.minAdvanceBookingHours && hoursDifference < plan.minAdvanceBookingHours) {
                return false;
            }
            if (plan.maxAdvanceBookingHours && hoursDifference > plan.maxAdvanceBookingHours) {
                return false;
            }
            return true;
        });
    }
    validateTimeRange(timeRange) {
        const timeRangeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRangeRegex.test(timeRange)) {
            throw new common_1.BadRequestException("Invalid time range format. Use HH:MM-HH:MM format");
        }
        const [startTime, endTime] = timeRange.split("-");
        if (startTime >= endTime) {
            throw new common_1.BadRequestException("Start time must be before end time");
        }
    }
    async isPatientEligibleForPlan(planId, isNewPatient) {
        const plan = await this.getPlanById(planId);
        if (plan.isNewPatientOnly && !isNewPatient) {
            return false;
        }
        if (plan.isExistingPatientOnly && isNewPatient) {
            return false;
        }
        return true;
    }
};
exports.ConsultationPlansService = ConsultationPlansService;
exports.ConsultationPlansService = ConsultationPlansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(consultation_plan_schema_1.ConsultationPlan.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ConsultationPlansService);
//# sourceMappingURL=consultation-plans.service.js.map