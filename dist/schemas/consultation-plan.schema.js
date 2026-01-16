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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultationPlanSchema = exports.ConsultationPlan = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_enums_1 = require("./shared-enums");
let ConsultationPlan = class ConsultationPlan extends mongoose_2.Document {
};
exports.ConsultationPlan = ConsultationPlan;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true }),
    __metadata("design:type", String)
], ConsultationPlan.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ConsultationPlan.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: Object.values(shared_enums_1.ConsultationType),
        required: true,
        index: true
    }),
    __metadata("design:type", String)
], ConsultationPlan.prototype, "consultationType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: Object.values(shared_enums_1.ConsultationCategory),
        required: true,
        default: shared_enums_1.ConsultationCategory.VIRTUAL
    }),
    __metadata("design:type", String)
], ConsultationPlan.prototype, "consultationCategory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], ConsultationPlan.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], ConsultationPlan.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Number], default: [] }),
    __metadata("design:type", Array)
], ConsultationPlan.prototype, "availableDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], ConsultationPlan.prototype, "availableTimeRange", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true, index: true }),
    __metadata("design:type", Boolean)
], ConsultationPlan.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
        enum: Object.values(shared_enums_1.ConsultationMode),
        default: [shared_enums_1.ConsultationMode.VIDEO]
    }),
    __metadata("design:type", Array)
], ConsultationPlan.prototype, "consultationModes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, index: true }),
    __metadata("design:type", Number)
], ConsultationPlan.prototype, "sortOrder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], ConsultationPlan.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ConsultationPlan.prototype, "requiresPreApproval", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], ConsultationPlan.prototype, "preparationInstructions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1, min: 0 }),
    __metadata("design:type", Number)
], ConsultationPlan.prototype, "minAdvanceBookingHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 720, min: 1 }),
    __metadata("design:type", Number)
], ConsultationPlan.prototype, "maxAdvanceBookingHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ConsultationPlan.prototype, "isNewPatientOnly", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ConsultationPlan.prototype, "isExistingPatientOnly", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], ConsultationPlan.prototype, "specialtyRequired", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(shared_enums_1.MentalHealthSubType),
        default: null
    }),
    __metadata("design:type", String)
], ConsultationPlan.prototype, "mentalHealthSubType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ConsultationPlan.prototype, "includesPrescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ConsultationPlan.prototype, "isPriority", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ConsultationPlan.prototype, "isCouplesTherapy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ConsultationPlan.prototype, "isGroupTherapy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], ConsultationPlan.prototype, "specialConditions", void 0);
exports.ConsultationPlan = ConsultationPlan = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ConsultationPlan);
exports.ConsultationPlanSchema = mongoose_1.SchemaFactory.createForClass(ConsultationPlan);
exports.ConsultationPlanSchema.index({ consultationType: 1, isActive: 1 });
exports.ConsultationPlanSchema.index({ sortOrder: 1 });
exports.ConsultationPlanSchema.index({ price: 1 });
exports.ConsultationPlanSchema.index({ name: 1 }, { unique: true });
exports.ConsultationPlanSchema.index({
    consultationType: 1,
    consultationCategory: 1,
    isActive: 1
});
exports.ConsultationPlanSchema.index({
    availableDays: 1,
    isActive: 1
});
exports.ConsultationPlanSchema.index({ isPriority: 1, isActive: 1 });
exports.ConsultationPlanSchema.index({
    consultationType: 1,
    mentalHealthSubType: 1,
    isActive: 1
});
exports.ConsultationPlanSchema.index({ includesPrescription: 1, isActive: 1 });
//# sourceMappingURL=consultation-plan.schema.js.map