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
exports.AvailabilitySchema = exports.Availability = exports.ConsultationMode = exports.ConsultationCategory = exports.ConsultationType = void 0;
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
var ConsultationCategory;
(function (ConsultationCategory) {
    ConsultationCategory["PHYSICAL"] = "physical";
    ConsultationCategory["VIRTUAL"] = "virtual";
    ConsultationCategory["HYBRID"] = "hybrid";
})(ConsultationCategory || (exports.ConsultationCategory = ConsultationCategory = {}));
var ConsultationMode;
(function (ConsultationMode) {
    ConsultationMode["VIDEO"] = "video";
    ConsultationMode["VOICE"] = "voice";
    ConsultationMode["CHAT"] = "chat";
    ConsultationMode["IN_PERSON"] = "in_person";
})(ConsultationMode || (exports.ConsultationMode = ConsultationMode = {}));
let Availability = class Availability extends mongoose_2.Document {
};
exports.Availability = Availability;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User", required: false }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Availability.prototype, "doctorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: [0, 1, 2, 3, 4, 5, 6], required: true }),
    __metadata("design:type", Number)
], Availability.prototype, "dayOfWeek", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ startTime: String, endTime: String }], required: true }),
    __metadata("design:type", Array)
], Availability.prototype, "timeSlots", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: Object.values(ConsultationCategory),
        required: true
    }),
    __metadata("design:type", String)
], Availability.prototype, "consultationCategory", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
        enum: Object.values(ConsultationType),
        default: []
    }),
    __metadata("design:type", Array)
], Availability.prototype, "allowedConsultationTypes", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [String],
        enum: Object.values(ConsultationMode),
        default: [ConsultationMode.VIDEO, ConsultationMode.VOICE]
    }),
    __metadata("design:type", Array)
], Availability.prototype, "allowedConsultationModes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Availability.prototype, "isAvailable", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Availability.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], Availability.prototype, "maxConcurrentAppointments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 30 }),
    __metadata("design:type", Number)
], Availability.prototype, "slotDuration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Availability.prototype, "bufferTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Availability.prototype, "overrideDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Availability.prototype, "overrideReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Availability.prototype, "isRecurring", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Availability.prototype, "effectiveFrom", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Availability.prototype, "effectiveTo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Availability.prototype, "metadata", void 0);
exports.Availability = Availability = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Availability);
exports.AvailabilitySchema = mongoose_1.SchemaFactory.createForClass(Availability);
exports.AvailabilitySchema.index({ doctorId: 1, dayOfWeek: 1, isAvailable: 1 });
exports.AvailabilitySchema.index({ consultationCategory: 1, isAvailable: 1 });
exports.AvailabilitySchema.index({ overrideDate: 1 });
exports.AvailabilitySchema.index({ effectiveFrom: 1, effectiveTo: 1 });
exports.AvailabilitySchema.index({ dayOfWeek: 1, isRecurring: 1 });
//# sourceMappingURL=availability.schema.js.map