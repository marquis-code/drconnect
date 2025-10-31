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
const notification_service_1 = require("../notifications/notification.service");
const google_meet_service_1 = require("../integrations/google-meet.service");
let AppointmentsService = class AppointmentsService {
    constructor(appointmentModel, notificationService, googleMeetService) {
        this.appointmentModel = appointmentModel;
        this.notificationService = notificationService;
        this.googleMeetService = googleMeetService;
    }
    async createAppointment(userId, createAppointmentDto) {
        const { consultationType, consultationMode, date, timeSlot, location, price } = createAppointmentDto;
        const appointment = new this.appointmentModel({
            userId: new mongoose_2.Types.ObjectId(userId),
            consultationType,
            consultationMode: consultationMode || "video",
            date: new Date(date),
            timeSlot,
            location,
            price,
            paymentStatus: "pending",
            status: "booked",
        });
        if (appointment.consultationType === "virtual") {
            try {
                const meetLink = await this.googleMeetService.generateMeetLink(date, timeSlot);
                appointment.googleMeetLink = meetLink;
            }
            catch (error) {
                console.error("Failed to generate Google Meet link:", error);
            }
        }
        await appointment.save();
        return appointment;
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
        appointment.date = new Date(newDate);
        appointment.timeSlot = newTimeSlot;
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
    __metadata("design:paramtypes", [Function, notification_service_1.NotificationService,
        google_meet_service_1.GoogleMeetService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map