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
exports.AppointmentSchema = exports.Appointment = exports.ConsultationCategory = exports.ConsultationMode = exports.ConsultationType = exports.PaymentStatus = exports.AppointmentStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var AppointmentStatus;
(function (AppointmentStatus) {
    AppointmentStatus["BOOKED"] = "booked";
    AppointmentStatus["CONFIRMED"] = "confirmed";
    AppointmentStatus["IN_PROGRESS"] = "in_progress";
    AppointmentStatus["COMPLETED"] = "completed";
    AppointmentStatus["CANCELED"] = "canceled";
    AppointmentStatus["NO_SHOW"] = "no_show";
    AppointmentStatus["RESCHEDULED"] = "rescheduled";
})(AppointmentStatus || (exports.AppointmentStatus = AppointmentStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["SUCCESSFUL"] = "successful";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
    PaymentStatus["PARTIALLY_REFUNDED"] = "partially_refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
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
let Appointment = class Appointment extends mongoose_2.Document {
};
exports.Appointment = Appointment;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Appointment.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User", required: false }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Appointment.prototype, "doctorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "ConsultationPlan", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Appointment.prototype, "planId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: Object.values(ConsultationType),
        required: true
    }),
    __metadata("design:type", String)
], Appointment.prototype, "consultationType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: Object.values(ConsultationCategory),
        required: true,
        default: ConsultationCategory.VIRTUAL
    }),
    __metadata("design:type", String)
], Appointment.prototype, "consultationCategory", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: Object.values(ConsultationMode),
        default: ConsultationMode.VIDEO
    }),
    __metadata("design:type", String)
], Appointment.prototype, "consultationMode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Appointment.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Appointment.prototype, "timeSlot", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Appointment.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Appointment.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING
    }),
    __metadata("design:type", String)
], Appointment.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "transactionReference", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: Object.values(AppointmentStatus),
        default: AppointmentStatus.BOOKED
    }),
    __metadata("design:type", String)
], Appointment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "cancellationReason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "canceledBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Appointment.prototype, "canceledAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "googleMeetLink", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "meetingRoomId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "meetingPassword", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "patientNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "chiefComplaint", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Appointment.prototype, "symptoms", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "doctorNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "diagnosis", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "prescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Appointment.prototype, "attachments", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], Appointment.prototype, "followUpRequired", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Appointment.prototype, "followUpDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Appointment" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Appointment.prototype, "previousAppointmentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Appointment" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Appointment.prototype, "nextAppointmentId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Appointment.prototype, "scheduledStartTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Appointment.prototype, "actualStartTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Appointment.prototype, "actualEndTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Appointment.prototype, "checkedInAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Appointment.prototype, "reminderSent", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Appointment.prototype, "reminderSentAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 1, max: 5 }),
    __metadata("design:type", Number)
], Appointment.prototype, "patientRating", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "patientFeedback", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Appointment.prototype, "doctorRating", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "doctorFeedback", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Appointment.prototype, "metadata", void 0);
exports.Appointment = Appointment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Appointment);
exports.AppointmentSchema = mongoose_1.SchemaFactory.createForClass(Appointment);
exports.AppointmentSchema.index({ userId: 1, date: -1 });
exports.AppointmentSchema.index({ doctorId: 1, date: -1 });
exports.AppointmentSchema.index({ status: 1, date: 1 });
exports.AppointmentSchema.index({ consultationType: 1, date: -1 });
exports.AppointmentSchema.index({ transactionReference: 1 });
exports.AppointmentSchema.index({ date: 1, timeSlot: 1 });
//# sourceMappingURL=appointment.schema.js.map