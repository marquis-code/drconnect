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
exports.ConsultationPlanSchema = exports.ConsultationPlan = exports.ConsultationCategory = exports.ConsultationMode = exports.ConsultationType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ConsultationType;
(function (ConsultationType) {
    ConsultationType["FIRST_CONTACT"] = "first_contact";
    ConsultationType["FOLLOW_UP"] = "follow_up";
    ConsultationType["MEDICAL_REVIEW"] = "medical_review";
    ConsultationType["EMERGENCY"] = "emergency";
    ConsultationType["ROUTINE_CHECKUP"] = "routine_checkup";
    ConsultationType["PRESCRIPTION_REFILL"] = "prescription_refill";
    ConsultationType["LAB_RESULT_REVIEW"] = "lab_result_review";
    ConsultationType["SECOND_OPINION"] = "second_opinion";
    ConsultationType["MENTAL_HEALTH"] = "mental_health";
    ConsultationType["CHRONIC_DISEASE_MANAGEMENT"] = "chronic_disease_management";
    ConsultationType["PRENATAL_POSTNATAL"] = "prenatal_postnatal";
    ConsultationType["PEDIATRIC"] = "pediatric";
    ConsultationType["GERIATRIC"] = "geriatric";
    ConsultationType["NUTRITION_COUNSELING"] = "nutrition_counseling";
    ConsultationType["PRE_OPERATIVE"] = "pre_operative";
    ConsultationType["POST_OPERATIVE"] = "post_operative";
    ConsultationType["PROCEDURE_CONSULTATION"] = "procedure_consultation";
    ConsultationType["HEALTH_SCREENING"] = "health_screening";
    ConsultationType["WELLNESS_CONSULTATION"] = "wellness_consultation";
    ConsultationType["VACCINATION"] = "vaccination";
    ConsultationType["SICK_NOTE"] = "sick_note";
    ConsultationType["REFERRAL"] = "referral";
})(ConsultationType || (exports.ConsultationType = ConsultationType = {}));
var ConsultationMode;
(function (ConsultationMode) {
    ConsultationMode["VIDEO"] = "video";
    ConsultationMode["VOICE"] = "voice";
    ConsultationMode["CHAT"] = "chat";
    ConsultationMode["IN_PERSON"] = "in_person";
})(ConsultationMode || (exports.ConsultationMode = ConsultationMode = {}));
var ConsultationCategory;
(function (ConsultationCategory) {
    ConsultationCategory["PHYSICAL"] = "physical";
    ConsultationCategory["VIRTUAL"] = "virtual";
    ConsultationCategory["HYBRID"] = "hybrid";
})(ConsultationCategory || (exports.ConsultationCategory = ConsultationCategory = {}));
let ConsultationPlan = class ConsultationPlan extends mongoose_2.Document {
};
exports.ConsultationPlan = ConsultationPlan;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ConsultationPlan.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ConsultationPlan.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: Object.values(ConsultationType),
        required: true
    }),
    __metadata("design:type", String)
], ConsultationPlan.prototype, "consultationType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: Object.values(ConsultationCategory),
        required: true,
        default: ConsultationCategory.VIRTUAL
    }),
    __metadata("design:type", String)
], ConsultationPlan.prototype, "consultationCategory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ConsultationPlan.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
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
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ConsultationPlan.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
        enum: Object.values(ConsultationMode),
        default: [ConsultationMode.VIDEO]
    }),
    __metadata("design:type", Array)
], ConsultationPlan.prototype, "consultationModes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
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
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], ConsultationPlan.prototype, "minAdvanceBookingHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 720 }),
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
exports.ConsultationPlan = ConsultationPlan = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ConsultationPlan);
exports.ConsultationPlanSchema = mongoose_1.SchemaFactory.createForClass(ConsultationPlan);
exports.ConsultationPlanSchema.index({ consultationType: 1, isActive: 1 });
exports.ConsultationPlanSchema.index({ sortOrder: 1 });
exports.ConsultationPlanSchema.index({ price: 1 });
//# sourceMappingURL=consultation-plan.schema.js.map