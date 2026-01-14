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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
const appointment_schema_1 = require("../schemas/appointment.schema");
const transaction_schema_1 = require("../schemas/transaction.schema");
const availability_schema_1 = require("../schemas/availability.schema");
const settings_schema_1 = require("../schemas/settings.schema");
let AdminService = class AdminService {
    constructor(userModel, appointmentModel, transactionModel, availabilityModel, settingsModel) {
        this.userModel = userModel;
        this.appointmentModel = appointmentModel;
        this.transactionModel = transactionModel;
        this.availabilityModel = availabilityModel;
        this.settingsModel = settingsModel;
    }
    async getDashboardStats() {
        var _a;
        const totalPatients = await this.userModel.countDocuments({ role: user_schema_1.UserRole.PATIENT });
        const totalDoctors = await this.userModel.countDocuments({ role: user_schema_1.UserRole.DOCTOR });
        const totalAppointments = await this.appointmentModel.countDocuments();
        const completedAppointments = await this.appointmentModel.countDocuments({
            status: appointment_schema_1.AppointmentStatus.COMPLETED
        });
        const pendingAppointments = await this.appointmentModel.countDocuments({
            status: appointment_schema_1.AppointmentStatus.BOOKED
        });
        const totalRevenue = await this.transactionModel.aggregate([
            { $match: { paymentStatus: "successful" } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        return {
            totalPatients,
            totalDoctors,
            totalAppointments,
            completedAppointments,
            pendingAppointments,
            totalRevenue: ((_a = totalRevenue[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
        };
    }
    async getAllUsers(filter) {
        const query = filter || {};
        return this.userModel.find(query).select("-password -resetToken -verificationToken -resetTokenExpiry");
    }
    async getUsersByRole(role) {
        return this.userModel
            .find({ role })
            .select("-password -resetToken -verificationToken -resetTokenExpiry")
            .sort({ createdAt: -1 });
    }
    async getAllDoctors() {
        return this.userModel
            .find({ role: user_schema_1.UserRole.DOCTOR })
            .select("-password -resetToken -verificationToken -resetTokenExpiry")
            .sort({ averageRating: -1 });
    }
    async verifyDoctor(doctorId, adminId) {
        const doctor = await this.userModel.findById(doctorId);
        if (!doctor) {
            throw new common_1.BadRequestException("Doctor not found");
        }
        if (doctor.role !== user_schema_1.UserRole.DOCTOR) {
            throw new common_1.BadRequestException("User is not a doctor");
        }
        doctor.isVerified = true;
        doctor.verifiedAt = new Date();
        doctor.verifiedBy = adminId;
        await doctor.save();
        return doctor;
    }
    async getAllAppointments(filter) {
        const query = filter || {};
        return this.appointmentModel
            .find(query)
            .populate("userId", "name email phone")
            .populate("doctorId", "name email specialization")
            .populate("planId", "name consultationType duration price")
            .sort({ date: -1 });
    }
    async getAppointmentsByStatus(status) {
        return this.appointmentModel
            .find({ status })
            .populate("userId", "name email phone")
            .populate("doctorId", "name email specialization")
            .populate("planId", "name consultationType duration price")
            .sort({ date: -1 });
    }
    async getAllTransactions() {
        return this.transactionModel
            .find()
            .populate("userId", "name email")
            .populate("appointmentId")
            .sort({ createdAt: -1 });
    }
    async setAvailability(availabilityData) {
        const { dayOfWeek, timeSlots, consultationCategory, doctorId, allowedConsultationTypes, allowedConsultationModes, location, maxConcurrentAppointments, slotDuration, bufferTime } = availabilityData;
        const query = {
            dayOfWeek,
            consultationCategory,
        };
        if (doctorId) {
            query.doctorId = doctorId;
        }
        const existingAvailability = await this.availabilityModel.findOne(query);
        if (existingAvailability) {
            existingAvailability.timeSlots = timeSlots;
            if (allowedConsultationTypes) {
                existingAvailability.allowedConsultationTypes = allowedConsultationTypes;
            }
            if (allowedConsultationModes) {
                existingAvailability.allowedConsultationModes = allowedConsultationModes;
            }
            if (location)
                existingAvailability.location = location;
            if (maxConcurrentAppointments) {
                existingAvailability.maxConcurrentAppointments = maxConcurrentAppointments;
            }
            if (slotDuration)
                existingAvailability.slotDuration = slotDuration;
            if (bufferTime !== undefined)
                existingAvailability.bufferTime = bufferTime;
            await existingAvailability.save();
            return existingAvailability;
        }
        const availability = new this.availabilityModel({
            dayOfWeek,
            timeSlots,
            consultationCategory,
            doctorId: doctorId || undefined,
            allowedConsultationTypes: allowedConsultationTypes || [],
            allowedConsultationModes: allowedConsultationModes || [],
            location,
            maxConcurrentAppointments: maxConcurrentAppointments || 1,
            slotDuration: slotDuration || 30,
            bufferTime: bufferTime || 0,
            isAvailable: true,
            isRecurring: true,
        });
        await availability.save();
        return availability;
    }
    async getAvailability(doctorId) {
        const query = {};
        if (doctorId) {
            query.doctorId = doctorId;
        }
        return this.availabilityModel.find(query).populate("doctorId", "name specialization");
    }
    async getAvailabilityByDate(dateString, timeString, consultationCategory, doctorId) {
        const now = new Date();
        const targetDate = dateString ? new Date(dateString) : now;
        const dayOfWeek = targetDate.getDay();
        const currentTimeString = timeString ||
            `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const availabilityQuery = {
            dayOfWeek,
            isAvailable: true,
        };
        if (consultationCategory) {
            if (!Object.values(availability_schema_1.ConsultationCategory).includes(consultationCategory)) {
                throw new common_1.BadRequestException(`Invalid consultation category. Must be one of: ${Object.values(availability_schema_1.ConsultationCategory).join(", ")}`);
            }
            availabilityQuery.consultationCategory = consultationCategory;
        }
        if (doctorId) {
            availabilityQuery.doctorId = doctorId;
        }
        const availability = await this.availabilityModel.find(availabilityQuery);
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);
        const appointmentQuery = {
            date: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
            status: {
                $nin: [appointment_schema_1.AppointmentStatus.CANCELED, appointment_schema_1.AppointmentStatus.NO_SHOW]
            },
        };
        if (consultationCategory) {
            appointmentQuery.consultationCategory = consultationCategory;
        }
        if (doctorId) {
            appointmentQuery.doctorId = doctorId;
        }
        const bookedAppointments = await this.appointmentModel.find(appointmentQuery);
        const bookedSlots = bookedAppointments.map(apt => {
            var _a;
            return ({
                timeSlot: apt.timeSlot,
                consultationCategory: apt.consultationCategory,
                doctorId: (_a = apt.doctorId) === null || _a === void 0 ? void 0 : _a.toString(),
            });
        });
        if (timeString || !dateString) {
            const checkTimeString = timeString || currentTimeString;
            const timeAvailability = availability.map(avail => {
                const timeSlot = avail.timeSlots.find(slot => slot.startTime === checkTimeString);
                if (!timeSlot) {
                    return {
                        consultationCategory: avail.consultationCategory,
                        doctorId: avail.doctorId,
                        isAvailable: false,
                        reason: 'Time slot not in schedule',
                    };
                }
                const isBooked = bookedSlots.some(booked => {
                    var _a;
                    return booked.timeSlot === checkTimeString &&
                        booked.consultationCategory === avail.consultationCategory &&
                        (!avail.doctorId || booked.doctorId === ((_a = avail.doctorId) === null || _a === void 0 ? void 0 : _a.toString()));
                });
                return {
                    consultationCategory: avail.consultationCategory,
                    doctorId: avail.doctorId,
                    time: checkTimeString,
                    timeSlot,
                    isAvailable: !isBooked,
                    reason: isBooked ? 'Already booked' : null,
                };
            });
            return {
                date: targetDate.toISOString().split('T')[0],
                dayOfWeek,
                time: checkTimeString,
                availability: timeAvailability,
            };
        }
        const availableSlots = availability.map(avail => {
            const availableTimeSlots = avail.timeSlots.map(slot => {
                const isBooked = bookedSlots.some(booked => {
                    var _a;
                    return booked.timeSlot === slot.startTime &&
                        booked.consultationCategory === avail.consultationCategory &&
                        (!avail.doctorId || booked.doctorId === ((_a = avail.doctorId) === null || _a === void 0 ? void 0 : _a.toString()));
                });
                return {
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    isAvailable: !isBooked,
                };
            });
            return {
                _id: avail._id,
                dayOfWeek: avail.dayOfWeek,
                consultationCategory: avail.consultationCategory,
                doctorId: avail.doctorId,
                isAvailable: avail.isAvailable,
                allowedConsultationTypes: avail.allowedConsultationTypes,
                allowedConsultationModes: avail.allowedConsultationModes,
                location: avail.location,
                maxConcurrentAppointments: avail.maxConcurrentAppointments,
                slotDuration: avail.slotDuration,
                bufferTime: avail.bufferTime,
                timeSlots: availableTimeSlots,
            };
        });
        return {
            date: targetDate.toISOString().split('T')[0],
            dayOfWeek,
            availability: availableSlots,
        };
    }
    async updateSettings(settingsData) {
        let settings = await this.settingsModel.findOne();
        if (!settings) {
            settings = new this.settingsModel(settingsData);
        }
        else {
            Object.assign(settings, settingsData);
        }
        await settings.save();
        return settings;
    }
    async getSettings() {
        let settings = await this.settingsModel.findOne();
        if (!settings) {
            settings = new this.settingsModel({
                physicalConsultationFee: 5000,
                virtualConsultationFee: 3000,
                clinicLocation: "Lagos, Nigeria",
                clinicLatitude: 6.5244,
                clinicLongitude: 3.3792,
                contactEmail: "info.doctordey@gmail.com",
                contactPhone: "+2348034080064",
            });
            await settings.save();
        }
        return settings;
    }
    async exportTransactions() {
        return this.transactionModel.find().lean();
    }
    async exportAppointments() {
        return this.appointmentModel
            .find()
            .populate("userId", "name email phone")
            .populate("doctorId", "name email specialization")
            .populate("planId", "name consultationType duration price")
            .lean();
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    __param(2, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __param(3, (0, mongoose_1.InjectModel)(availability_schema_1.Availability.name)),
    __param(4, (0, mongoose_1.InjectModel)(settings_schema_1.Settings.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AdminService);
//# sourceMappingURL=admin.service.js.map