"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentalHealthSubType = exports.PaymentStatus = exports.AppointmentStatus = exports.ConsultationCategory = exports.ConsultationMode = exports.ConsultationType = void 0;
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
    ConsultationType["PEDIATRIC"] = "pediatric";
    ConsultationType["GERIATRIC"] = "geriatric";
    ConsultationType["NUTRITION_COUNSELING"] = "nutrition_counseling";
    ConsultationType["CHRONIC_DISEASE_MANAGEMENT"] = "chronic_disease_management";
    ConsultationType["PRENATAL_POSTNATAL"] = "prenatal_postnatal";
    ConsultationType["PRE_OPERATIVE"] = "pre_operative";
    ConsultationType["POST_OPERATIVE"] = "post_operative";
    ConsultationType["PROCEDURE_CONSULTATION"] = "procedure_consultation";
    ConsultationType["HEALTH_SCREENING"] = "health_screening";
    ConsultationType["VACCINATION"] = "vaccination";
    ConsultationType["WELLNESS_CONSULTATION"] = "wellness_consultation";
    ConsultationType["SPIRITUALITY_COUNSELING"] = "spirituality_counseling";
    ConsultationType["PREMARITAL_COUNSELING"] = "premarital_counseling";
    ConsultationType["MARRIAGE_RELATIONSHIP_COUNSELING"] = "marriage_relationship_counseling";
    ConsultationType["SICK_NOTE"] = "sick_note";
    ConsultationType["REFERRAL"] = "referral";
    ConsultationType["ONSITE_THERAPY"] = "onsite_therapy";
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
var MentalHealthSubType;
(function (MentalHealthSubType) {
    MentalHealthSubType["GENERAL"] = "general";
    MentalHealthSubType["PSYCHOTHERAPY"] = "psychotherapy";
    MentalHealthSubType["CBT"] = "cbt";
    MentalHealthSubType["DEPRESSION_TREATMENT"] = "depression_treatment";
    MentalHealthSubType["ANXIETY_TREATMENT"] = "anxiety_treatment";
    MentalHealthSubType["FAMILY_GROUP_THERAPY"] = "family_group_therapy";
})(MentalHealthSubType || (exports.MentalHealthSubType = MentalHealthSubType = {}));
//# sourceMappingURL=shared-enums.js.map