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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const appointment_schema_1 = require("../schemas/appointment.schema");
const consultation_plans_service_1 = require("../consultation-plans/consultation-plans.service");
const google_meet_service_1 = require("../integrations/google-meet.service");
let AppointmentsService = class AppointmentsService {
    constructor(appointmentModel, googleMeetService, consultationPlansService) {
        this.appointmentModel = appointmentModel;
        this.googleMeetService = googleMeetService;
        this.consultationPlansService = consultationPlansService;
    }
    async createAppointment(userId, createAppointmentDto) {
        const { planId, consultationType, consultationMode, date, timeSlot, location, price, duration } = createAppointmentDto;
        if (planId) {
            const plan = await this.consultationPlansService.getPlanById(planId);
            const isAvailable = await this.consultationPlansService.isPlanAvailableForDateTime(planId, new Date(date), timeSlot);
            if (!isAvailable) {
                throw new common_1.BadRequestException("This consultation plan is not available for the selected date and time");
            }
            if (plan.consultationType !== consultationType) {
                throw new common_1.BadRequestException(`Consultation type must be ${plan.consultationType} for this plan`);
            }
            if (consultationMode && !plan.consultationModes.includes(consultationMode)) {
                throw new common_1.BadRequestException(`Consultation mode ${consultationMode} is not available for this plan`);
            }
        }
        const isSlotAvailable = await this.checkSlotAvailability(date, timeSlot, consultationType);
        if (!isSlotAvailable) {
            throw new common_1.BadRequestException(`This time slot is no longer available for ${consultationType} consultation. Please choose another time.`);
        }
        const appointment = new this.appointmentModel({
            userId: new mongoose_2.Types.ObjectId(userId),
            planId: planId ? new mongoose_2.Types.ObjectId(planId) : undefined,
            consultationType,
            consultationMode: consultationMode || "video",
            date: new Date(date),
            timeSlot,
            location,
            price,
            duration: duration || 30,
            paymentStatus: "pending",
            status: "booked",
        });
        await appointment.save();
        return appointment;
    }
    async checkSlotAvailability(date, timeSlot, consultationType) {
        const targetDate = new Date(date);
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        const existingAppointment = await this.appointmentModel.findOne({
            date: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
            timeSlot,
            consultationType,
            status: { $nin: ["canceled", "completed"] },
        });
        return !existingAppointment;
    }
    async generateMeetLinkAfterPayment(appointmentId) {
        const appointment = await this.appointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        if (appointment.paymentStatus !== "successful") {
            throw new common_1.BadRequestException("Payment must be successful before generating Meet link");
        }
        if (appointment.consultationType !== "virtual") {
            throw new common_1.BadRequestException("Google Meet link is only for virtual consultations");
        }
        try {
            const dateString = appointment.date.toISOString().split('T')[0];
            const meetLink = await this.googleMeetService.generateMeetLink(dateString, appointment.timeSlot);
            appointment.googleMeetLink = meetLink;
            await appointment.save();
            return meetLink;
        }
        catch (error) {
            console.error("Failed to generate Google Meet link:", error);
            throw new common_1.BadRequestException("Failed to generate Google Meet link");
        }
    }
    async getAppointments(userId, role) {
        const query = {};
        if (role === "user") {
            query.userId = new mongoose_2.Types.ObjectId(userId);
        }
        const appointments = await this.appointmentModel.find(query).populate("userId", "name email phone");
        return appointments;
    }
    async getAppointmentById(appointmentId) {
        const appointment = await this.appointmentModel.findById(appointmentId).populate("userId", "name email phone");
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        return appointment;
    }
    async cancelAppointment(appointmentId, cancellationReason) {
        const appointment = await this.appointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        if (appointment.status === "canceled") {
            throw new common_1.BadRequestException("Appointment is already canceled");
        }
        appointment.status = "canceled";
        appointment.cancellationReason = cancellationReason;
        await appointment.save();
        return appointment;
    }
    async rescheduleAppointment(appointmentId, rescheduleDto) {
        const { newDate, newTimeSlot } = rescheduleDto;
        const appointment = await this.appointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        if (appointment.status === "canceled") {
            throw new common_1.BadRequestException("Cannot reschedule a canceled appointment");
        }
        const isNewSlotAvailable = await this.checkSlotAvailability(newDate, newTimeSlot, appointment.consultationType);
        if (!isNewSlotAvailable) {
            throw new common_1.BadRequestException("The new time slot is not available. Please choose another time.");
        }
        appointment.date = new Date(newDate);
        appointment.timeSlot = newTimeSlot;
        if (appointment.consultationType === "virtual" && appointment.googleMeetLink) {
            try {
                const meetLink = await this.googleMeetService.generateMeetLink(newDate, newTimeSlot);
                appointment.googleMeetLink = meetLink;
            }
            catch (error) {
                console.error("Failed to regenerate Google Meet link:", error);
            }
        }
        await appointment.save();
        return appointment;
    }
    async completeAppointment(appointmentId) {
        const appointment = await this.appointmentModel.findByIdAndUpdate(appointmentId, { status: "completed" }, { new: true });
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        return appointment;
    }
    async getUpcomingAppointments() {
        const now = new Date();
        return this.appointmentModel.find({
            date: { $gte: now },
            status: "booked",
        });
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    __metadata("design:paramtypes", [Function, google_meet_service_1.GoogleMeetService,
        consultation_plans_service_1.ConsultationPlansService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map