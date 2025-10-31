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
        const totalUsers = await this.userModel.countDocuments({ role: "user" });
        const totalAppointments = await this.appointmentModel.countDocuments();
        const completedAppointments = await this.appointmentModel.countDocuments({ status: "completed" });
        const totalRevenue = await this.transactionModel.aggregate([
            { $match: { paymentStatus: "successful" } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        return {
            totalUsers,
            totalAppointments,
            completedAppointments,
            totalRevenue: ((_a = totalRevenue[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
        };
    }
    async getAllUsers(filter) {
        const query = filter || { role: "user" };
        return this.userModel.find(query).select("-password -resetToken");
    }
    async getAllAppointments(filter) {
        const query = filter || {};
        return this.appointmentModel.find(query).populate("userId", "name email phone");
    }
    async getAppointmentsByStatus(status) {
        return this.appointmentModel.find({ status }).populate("userId", "name email phone");
    }
    async getAllTransactions() {
        return this.transactionModel.find().populate("userId", "name email").populate("appointmentId");
    }
    async setAvailability(availabilityData) {
        const { dayOfWeek, timeSlots, consultationType } = availabilityData;
        const existingAvailability = await this.availabilityModel.findOne({
            dayOfWeek,
            consultationType,
        });
        if (existingAvailability) {
            existingAvailability.timeSlots = timeSlots;
            await existingAvailability.save();
            return existingAvailability;
        }
        const availability = new this.availabilityModel({
            dayOfWeek,
            timeSlots,
            consultationType,
            isAvailable: true,
        });
        await availability.save();
        return availability;
    }
    async getAvailability() {
        return this.availabilityModel.find();
    }
    async getAvailabilityByDate(dateString, timeString, consultationType) {
        const targetDate = dateString ? new Date(dateString) : new Date();
        const dayOfWeek = targetDate.getDay();
        const availabilityQuery = {
            dayOfWeek,
            isAvailable: true,
        };
        if (consultationType) {
            if (!['physical', 'virtual'].includes(consultationType)) {
                throw new common_1.BadRequestException('Invalid consultation type. Must be "physical" or "virtual"');
            }
            availabilityQuery.consultationType = consultationType;
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
            status: { $ne: "canceled" },
        };
        if (timeString) {
            appointmentQuery.timeSlot = timeString;
        }
        const bookedAppointments = await this.appointmentModel.find(appointmentQuery);
        const bookedSlots = bookedAppointments.map(apt => ({
            timeSlot: apt.timeSlot,
            consultationType: apt.consultationType,
        }));
        if (timeString) {
            const timeAvailability = availability.map(avail => {
                const timeSlot = avail.timeSlots.find(slot => slot.startTime === timeString);
                if (!timeSlot) {
                    return {
                        consultationType: avail.consultationType,
                        isAvailable: false,
                        reason: 'Time slot not in schedule',
                    };
                }
                const isBooked = bookedSlots.some(booked => booked.timeSlot === timeString &&
                    booked.consultationType === avail.consultationType);
                return {
                    consultationType: avail.consultationType,
                    time: timeString,
                    timeSlot,
                    isAvailable: !isBooked,
                    reason: isBooked ? 'Already booked' : null,
                };
            });
            return {
                date: targetDate.toISOString().split('T')[0],
                dayOfWeek,
                time: timeString,
                availability: timeAvailability,
            };
        }
        const availableSlots = availability.map(avail => {
            const availableTimeSlots = avail.timeSlots.map(slot => {
                const isBooked = bookedSlots.some(booked => booked.timeSlot === slot.startTime &&
                    booked.consultationType === avail.consultationType);
                return {
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    isAvailable: !isBooked,
                };
            });
            return {
                _id: avail._id,
                dayOfWeek: avail.dayOfWeek,
                consultationType: avail.consultationType,
                isAvailable: avail.isAvailable,
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
                contactEmail: "contact@drconnect.com",
                contactPhone: "+234800000000",
            });
            await settings.save();
        }
        return settings;
    }
    async exportTransactions() {
        return this.transactionModel.find().lean();
    }
    async exportAppointments() {
        return this.appointmentModel.find().lean();
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