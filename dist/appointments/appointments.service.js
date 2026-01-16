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
const shared_enums_1 = require("../schemas/shared-enums");
const consultation_plans_service_1 = require("../consultation-plans/consultation-plans.service");
const google_meet_service_1 = require("../integrations/google-meet.service");
let AppointmentsService = class AppointmentsService {
    constructor(appointmentModel, googleMeetService, consultationPlansService) {
        this.appointmentModel = appointmentModel;
        this.googleMeetService = googleMeetService;
        this.consultationPlansService = consultationPlansService;
    }
    async createAppointment(userId, createAppointmentDto) {
        const { planId, doctorId, consultationType, consultationCategory, consultationMode, date, timeSlot, location, price, duration, patientNotes, chiefComplaint, symptoms, previousAppointmentId } = createAppointmentDto;
        const plan = await this.consultationPlansService.getPlanById(planId);
        const appointmentDate = new Date(date + 'T00:00:00Z');
        const scheduledStartTime = this.calculateScheduledStartTime(date, timeSlot);
        console.log('Creating appointment:', {
            userId,
            planId,
            date,
            timeSlot,
            appointmentDate: appointmentDate.toISOString(),
            scheduledStartTime: scheduledStartTime.toISOString()
        });
        const isAvailable = await this.consultationPlansService.isPlanAvailableForDateTime(planId, appointmentDate, timeSlot);
        if (!isAvailable) {
            throw new common_1.BadRequestException("This consultation plan is not available for the selected date and time");
        }
        if (plan.consultationType !== consultationType) {
            throw new common_1.BadRequestException(`Consultation type must be ${plan.consultationType} for this plan`);
        }
        if (plan.consultationCategory !== consultationCategory) {
            throw new common_1.BadRequestException(`Consultation category must be ${plan.consultationCategory} for this plan`);
        }
        if (!plan.consultationModes.includes(consultationMode)) {
            throw new common_1.BadRequestException(`Consultation mode ${consultationMode} is not available for this plan`);
        }
        if (plan.isNewPatientOnly) {
            const existingAppointments = await this.appointmentModel.countDocuments({
                userId: new mongoose_2.Types.ObjectId(userId),
                status: { $in: [shared_enums_1.AppointmentStatus.COMPLETED] }
            });
            if (existingAppointments > 0) {
                throw new common_1.BadRequestException("This plan is only available for new patients");
            }
        }
        if (plan.isExistingPatientOnly) {
            const existingAppointments = await this.appointmentModel.countDocuments({
                userId: new mongoose_2.Types.ObjectId(userId),
                status: { $in: [shared_enums_1.AppointmentStatus.COMPLETED] }
            });
            if (existingAppointments === 0) {
                throw new common_1.BadRequestException({
                    message: "This plan is only available for existing patients",
                    hint: "Complete your first appointment to access this plan",
                    planName: plan.name
                });
            }
        }
        const now = new Date();
        const hoursDifference = (scheduledStartTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        console.log('Advance booking check:', {
            hoursDifference,
            minRequired: plan.minAdvanceBookingHours,
            maxAllowed: plan.maxAdvanceBookingHours
        });
        if (hoursDifference < plan.minAdvanceBookingHours) {
            throw new common_1.BadRequestException(`This appointment must be booked at least ${plan.minAdvanceBookingHours} hours in advance. Current difference: ${hoursDifference.toFixed(2)} hours`);
        }
        if (hoursDifference > plan.maxAdvanceBookingHours) {
            throw new common_1.BadRequestException(`This appointment cannot be booked more than ${plan.maxAdvanceBookingHours} hours in advance. Current difference: ${hoursDifference.toFixed(2)} hours`);
        }
        const isSlotAvailable = await this.checkSlotAvailability(date, timeSlot, consultationType, doctorId);
        if (!isSlotAvailable) {
            throw new common_1.BadRequestException(`This time slot is no longer available. Please choose another time.`);
        }
        const appointment = new this.appointmentModel({
            userId: new mongoose_2.Types.ObjectId(userId),
            doctorId: doctorId ? new mongoose_2.Types.ObjectId(doctorId) : undefined,
            planId: new mongoose_2.Types.ObjectId(planId),
            consultationType,
            consultationCategory,
            consultationMode,
            date: appointmentDate,
            timeSlot,
            duration,
            location,
            price,
            patientNotes,
            chiefComplaint,
            symptoms,
            previousAppointmentId: previousAppointmentId ? new mongoose_2.Types.ObjectId(previousAppointmentId) : undefined,
            paymentStatus: shared_enums_1.PaymentStatus.PENDING,
            status: shared_enums_1.AppointmentStatus.BOOKED,
            scheduledStartTime
        });
        await appointment.save();
        if (previousAppointmentId) {
            await this.appointmentModel.findByIdAndUpdate(previousAppointmentId, { nextAppointmentId: appointment._id });
        }
        console.log('Appointment created successfully:', appointment._id);
        return appointment;
    }
    calculateScheduledStartTime(date, timeSlot) {
        const [startTime] = timeSlot.split('-');
        const [hours, minutes] = startTime.split(':').map(Number);
        const scheduledDate = new Date(date + 'T00:00:00Z');
        scheduledDate.setUTCHours(hours, minutes, 0, 0);
        return scheduledDate;
    }
    async checkSlotAvailability(date, timeSlot, consultationType, doctorId) {
        const targetDate = new Date(date + 'T00:00:00Z');
        const startOfDay = new Date(targetDate);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setUTCHours(23, 59, 59, 999);
        const query = {
            date: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
            timeSlot,
            consultationType,
            status: {
                $nin: [shared_enums_1.AppointmentStatus.CANCELED, shared_enums_1.AppointmentStatus.NO_SHOW]
            },
        };
        if (doctorId) {
            query.doctorId = new mongoose_2.Types.ObjectId(doctorId);
        }
        const existingAppointment = await this.appointmentModel.findOne(query);
        return !existingAppointment;
    }
    async generateMeetLinkAfterPayment(appointmentId) {
        const appointment = await this.appointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        if (appointment.paymentStatus !== shared_enums_1.PaymentStatus.SUCCESSFUL) {
            throw new common_1.BadRequestException("Payment must be successful before generating Meet link");
        }
        if (appointment.consultationCategory !== "virtual") {
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
    async getPatientStatus(userId) {
        const completedAppointments = await this.appointmentModel.countDocuments({
            userId: new mongoose_2.Types.ObjectId(userId),
            status: { $in: [shared_enums_1.AppointmentStatus.COMPLETED] }
        });
        return {
            isNewPatient: completedAppointments === 0,
            isExistingPatient: completedAppointments > 0,
            completedAppointments
        };
    }
    async getAppointments(userId, role, queryDto) {
        const query = {};
        if (role === "user" || role === "patient") {
            query.userId = new mongoose_2.Types.ObjectId(userId);
        }
        else if (role === "doctor") {
            query.doctorId = new mongoose_2.Types.ObjectId(userId);
        }
        if (queryDto.status) {
            query.status = queryDto.status;
        }
        if (queryDto.consultationType) {
            query.consultationType = queryDto.consultationType;
        }
        if (queryDto.paymentStatus) {
            query.paymentStatus = queryDto.paymentStatus;
        }
        if (queryDto.dateFrom || queryDto.dateTo) {
            query.date = {};
            if (queryDto.dateFrom) {
                query.date.$gte = new Date(queryDto.dateFrom);
            }
            if (queryDto.dateTo) {
                query.date.$lte = new Date(queryDto.dateTo);
            }
        }
        if (queryDto.searchTerm) {
            query.$or = [
                { patientNotes: { $regex: queryDto.searchTerm, $options: 'i' } },
                { chiefComplaint: { $regex: queryDto.searchTerm, $options: 'i' } },
                { diagnosis: { $regex: queryDto.searchTerm, $options: 'i' } }
            ];
        }
        const appointments = await this.appointmentModel
            .find(query)
            .populate("userId", "name email phone")
            .populate("doctorId", "name email specialization")
            .populate("planId", "name consultationType duration price")
            .sort({ date: -1, scheduledStartTime: -1 });
        return appointments;
    }
    async getUserUpcomingAppointments(userId) {
        const now = new Date();
        return this.appointmentModel
            .find({
            userId: new mongoose_2.Types.ObjectId(userId),
            date: { $gte: now },
            status: {
                $in: [shared_enums_1.AppointmentStatus.BOOKED, shared_enums_1.AppointmentStatus.CONFIRMED]
            }
        })
            .populate("doctorId", "name email specialization")
            .populate("planId", "name consultationType duration")
            .sort({ date: 1, scheduledStartTime: 1 });
    }
    async getUserPastAppointments(userId) {
        const now = new Date();
        return this.appointmentModel
            .find({
            userId: new mongoose_2.Types.ObjectId(userId),
            $or: [
                { date: { $lt: now } },
                { status: { $in: [shared_enums_1.AppointmentStatus.COMPLETED, shared_enums_1.AppointmentStatus.CANCELED] } }
            ]
        })
            .populate("doctorId", "name email specialization")
            .populate("planId", "name consultationType duration")
            .sort({ date: -1, scheduledStartTime: -1 });
    }
    async getAppointmentById(appointmentId, userId, role) {
        const appointment = await this.appointmentModel
            .findById(appointmentId)
            .populate("userId", "name email phone")
            .populate("doctorId", "name email specialization")
            .populate("planId")
            .populate("previousAppointmentId")
            .populate("nextAppointmentId");
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        if (role === "user" || role === "patient") {
            if (appointment.userId._id.toString() !== userId) {
                throw new common_1.ForbiddenException("You can only view your own appointments");
            }
        }
        else if (role === "doctor") {
            if (appointment.doctorId && appointment.doctorId._id.toString() !== userId) {
                throw new common_1.ForbiddenException("You can only view your assigned appointments");
            }
        }
        return appointment;
    }
    async updateAppointment(appointmentId, updateDto, userId, role) {
        const appointment = await this.appointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        if (role === "doctor") {
            if (!appointment.doctorId || appointment.doctorId.toString() !== userId) {
                throw new common_1.ForbiddenException("You can only update your assigned appointments");
            }
        }
        Object.assign(appointment, updateDto);
        await appointment.save();
        return appointment;
    }
    async cancelAppointment(appointmentId, cancellationReason, canceledBy, userId, role) {
        const appointment = await this.appointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        if (appointment.status === shared_enums_1.AppointmentStatus.CANCELED) {
            throw new common_1.BadRequestException("Appointment is already canceled");
        }
        if (appointment.status === shared_enums_1.AppointmentStatus.COMPLETED) {
            throw new common_1.BadRequestException("Cannot cancel a completed appointment");
        }
        if (role === "user" || role === "patient") {
            if (appointment.userId.toString() !== userId) {
                throw new common_1.ForbiddenException("You can only cancel your own appointments");
            }
        }
        appointment.status = shared_enums_1.AppointmentStatus.CANCELED;
        appointment.cancellationReason = cancellationReason;
        appointment.canceledBy = canceledBy;
        appointment.canceledAt = new Date();
        await appointment.save();
        return appointment;
    }
    async rescheduleAppointment(appointmentId, rescheduleDto, userId, role) {
        var _a;
        const { newDate, newTimeSlot } = rescheduleDto;
        const appointment = await this.appointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        if (appointment.status === shared_enums_1.AppointmentStatus.CANCELED) {
            throw new common_1.BadRequestException("Cannot reschedule a canceled appointment");
        }
        if (appointment.status === shared_enums_1.AppointmentStatus.COMPLETED) {
            throw new common_1.BadRequestException("Cannot reschedule a completed appointment");
        }
        if (role === "user" || role === "patient") {
            if (appointment.userId.toString() !== userId) {
                throw new common_1.ForbiddenException("You can only reschedule your own appointments");
            }
        }
        const isNewSlotAvailable = await this.checkSlotAvailability(newDate, newTimeSlot, appointment.consultationType, (_a = appointment.doctorId) === null || _a === void 0 ? void 0 : _a.toString());
        if (!isNewSlotAvailable) {
            throw new common_1.BadRequestException("The new time slot is not available. Please choose another time.");
        }
        const newAppointmentDate = new Date(newDate + 'T00:00:00Z');
        appointment.date = newAppointmentDate;
        appointment.timeSlot = newTimeSlot;
        appointment.scheduledStartTime = this.calculateScheduledStartTime(newDate, newTimeSlot);
        appointment.status = shared_enums_1.AppointmentStatus.RESCHEDULED;
        if (appointment.consultationCategory === "virtual" && appointment.googleMeetLink) {
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
    async completeAppointment(appointmentId, completeDto, doctorId) {
        const appointment = await this.appointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        if (!appointment.doctorId || appointment.doctorId.toString() !== doctorId) {
            throw new common_1.ForbiddenException("You can only complete your assigned appointments");
        }
        appointment.status = shared_enums_1.AppointmentStatus.COMPLETED;
        appointment.doctorNotes = completeDto.doctorNotes;
        appointment.diagnosis = completeDto.diagnosis;
        appointment.prescription = completeDto.prescription;
        appointment.attachments = completeDto.attachments || [];
        appointment.followUpRequired = completeDto.followUpRequired;
        appointment.followUpDate = completeDto.followUpDate ? new Date(completeDto.followUpDate) : undefined;
        appointment.actualEndTime = new Date();
        await appointment.save();
        return appointment;
    }
    async checkInAppointment(appointmentId, userId) {
        const appointment = await this.appointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        if (appointment.userId.toString() !== userId) {
            throw new common_1.ForbiddenException("You can only check in to your own appointments");
        }
        appointment.checkedInAt = new Date();
        await appointment.save();
        return appointment;
    }
    async startAppointment(appointmentId, doctorId) {
        const appointment = await this.appointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        if (!appointment.doctorId || appointment.doctorId.toString() !== doctorId) {
            throw new common_1.ForbiddenException("You can only start your assigned appointments");
        }
        appointment.status = shared_enums_1.AppointmentStatus.IN_PROGRESS;
        appointment.actualStartTime = new Date();
        await appointment.save();
        return appointment;
    }
    async confirmAppointment(appointmentId) {
        const appointment = await this.appointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        appointment.status = shared_enums_1.AppointmentStatus.CONFIRMED;
        await appointment.save();
        return appointment;
    }
    async rateAppointment(appointmentId, rating, feedback, userId, role) {
        const appointment = await this.appointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        if (appointment.status !== shared_enums_1.AppointmentStatus.COMPLETED) {
            throw new common_1.BadRequestException("Can only rate completed appointments");
        }
        if (role === "user" || role === "patient") {
            if (appointment.userId.toString() !== userId) {
                throw new common_1.ForbiddenException("You can only rate your own appointments");
            }
            appointment.patientRating = rating;
            appointment.patientFeedback = feedback;
        }
        else if (role === "doctor") {
            if (!appointment.doctorId || appointment.doctorId.toString() !== userId) {
                throw new common_1.ForbiddenException("You can only rate your assigned appointments");
            }
            appointment.doctorRating = rating;
            appointment.doctorFeedback = feedback;
        }
        await appointment.save();
        return appointment;
    }
    async getMeetLink(appointmentId, userId, role) {
        const appointment = await this.appointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        if (role === "user" || role === "patient") {
            if (appointment.userId.toString() !== userId) {
                throw new common_1.ForbiddenException("Access denied");
            }
        }
        else if (role === "doctor") {
            if (!appointment.doctorId || appointment.doctorId.toString() !== userId) {
                throw new common_1.ForbiddenException("Access denied");
            }
        }
        if (!appointment.googleMeetLink) {
            throw new common_1.NotFoundException("Meet link not generated yet");
        }
        return { meetLink: appointment.googleMeetLink };
    }
    async getAppointmentStatistics(userId, role) {
        const query = {};
        if (role === "user" || role === "patient") {
            query.userId = new mongoose_2.Types.ObjectId(userId);
        }
        else if (role === "doctor") {
            query.doctorId = new mongoose_2.Types.ObjectId(userId);
        }
        const [total, completed, canceled, upcoming] = await Promise.all([
            this.appointmentModel.countDocuments(query),
            this.appointmentModel.countDocuments(Object.assign(Object.assign({}, query), { status: shared_enums_1.AppointmentStatus.COMPLETED })),
            this.appointmentModel.countDocuments(Object.assign(Object.assign({}, query), { status: shared_enums_1.AppointmentStatus.CANCELED })),
            this.appointmentModel.countDocuments(Object.assign(Object.assign({}, query), { date: { $gte: new Date() }, status: { $in: [shared_enums_1.AppointmentStatus.BOOKED, shared_enums_1.AppointmentStatus.CONFIRMED] } }))
        ]);
        return {
            total,
            completed,
            canceled,
            upcoming,
            completionRate: total > 0 ? ((completed / total) * 100).toFixed(2) : 0
        };
    }
    async getUpcomingAppointments() {
        const now = new Date();
        return this.appointmentModel.find({
            date: { $gte: now },
            status: { $in: [shared_enums_1.AppointmentStatus.BOOKED, shared_enums_1.AppointmentStatus.CONFIRMED] },
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