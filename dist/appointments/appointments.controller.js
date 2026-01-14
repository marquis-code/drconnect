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
exports.AppointmentsController = void 0;
const common_1 = require("@nestjs/common");
const appointments_service_1 = require("./appointments.service");
const create_appointment_dto_1 = require("./dto/create-appointment.dto");
const update_appointment_dto_1 = require("./dto/update-appointment.dto");
const reschedule_appointment_dto_1 = require("./dto/reschedule-appointment.dto");
const cancel_appointment_dto_1 = require("./dto/cancel-appointment.dto");
const complete_appointment_dto_1 = require("./dto/complete-appointment.dto");
const rate_appointment_dto_1 = require("./dto/rate-appointment.dto");
const query_appointments_dto_1 = require("./dto/query-appointments.dto");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let AppointmentsController = class AppointmentsController {
    constructor(appointmentsService) {
        this.appointmentsService = appointmentsService;
    }
    async createAppointment(createAppointmentDto, req) {
        return this.appointmentsService.createAppointment(req.user.userId, createAppointmentDto);
    }
    async getAppointments(queryDto, req) {
        return this.appointmentsService.getAppointments(req.user.userId, req.user.role, queryDto);
    }
    async getUpcomingAppointments(req) {
        return this.appointmentsService.getUserUpcomingAppointments(req.user.userId);
    }
    async getPastAppointments(req) {
        return this.appointmentsService.getUserPastAppointments(req.user.userId);
    }
    async getAppointmentStatistics(req) {
        return this.appointmentsService.getAppointmentStatistics(req.user.userId, req.user.role);
    }
    async getAppointmentById(id, req) {
        return this.appointmentsService.getAppointmentById(id, req.user.userId, req.user.role);
    }
    async updateAppointment(id, updateDto, req) {
        return this.appointmentsService.updateAppointment(id, updateDto, req.user.userId, req.user.role);
    }
    async cancelAppointment(id, cancelDto, req) {
        return this.appointmentsService.cancelAppointment(id, cancelDto.cancellationReason, cancelDto.canceledBy || "patient", req.user.userId, req.user.role);
    }
    async rescheduleAppointment(id, rescheduleDto, req) {
        return this.appointmentsService.rescheduleAppointment(id, rescheduleDto, req.user.userId, req.user.role);
    }
    async completeAppointment(id, completeDto, req) {
        return this.appointmentsService.completeAppointment(id, completeDto, req.user.userId);
    }
    async checkInAppointment(id, req) {
        return this.appointmentsService.checkInAppointment(id, req.user.userId);
    }
    async rateAppointment(id, rateDto, req) {
        return this.appointmentsService.rateAppointment(id, rateDto.rating, rateDto.feedback, req.user.userId, req.user.role);
    }
    async confirmAppointment(id) {
        return this.appointmentsService.confirmAppointment(id);
    }
    async startAppointment(id, req) {
        return this.appointmentsService.startAppointment(id, req.user.userId);
    }
    async getMeetLink(id, req) {
        return this.appointmentsService.getMeetLink(id, req.user.userId, req.user.role);
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_appointment_dto_1.CreateAppointmentDto, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "createAppointment", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_appointments_dto_1.QueryAppointmentsDto, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAppointments", null);
__decorate([
    (0, common_1.Get)("upcoming"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getUpcomingAppointments", null);
__decorate([
    (0, common_1.Get)("past"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getPastAppointments", null);
__decorate([
    (0, common_1.Get)("statistics"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAppointmentStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAppointmentById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_appointment_dto_1.UpdateAppointmentDto, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "updateAppointment", null);
__decorate([
    (0, common_1.Put)(":id/cancel"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cancel_appointment_dto_1.CancelAppointmentDto, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "cancelAppointment", null);
__decorate([
    (0, common_1.Put)(":id/reschedule"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reschedule_appointment_dto_1.RescheduleAppointmentDto, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "rescheduleAppointment", null);
__decorate([
    (0, common_1.Put)(":id/complete"),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("doctor", "admin"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, complete_appointment_dto_1.CompleteAppointmentDto, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "completeAppointment", null);
__decorate([
    (0, common_1.Put)(":id/check-in"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "checkInAppointment", null);
__decorate([
    (0, common_1.Post)(":id/rate"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, rate_appointment_dto_1.RateAppointmentDto, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "rateAppointment", null);
__decorate([
    (0, common_1.Put)(":id/confirm"),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("doctor", "admin"),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "confirmAppointment", null);
__decorate([
    (0, common_1.Put)(":id/start"),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("doctor", "admin"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "startAppointment", null);
__decorate([
    (0, common_1.Get)(":id/meet-link"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getMeetLink", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, common_1.Controller)("appointments"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [appointments_service_1.AppointmentsService])
], AppointmentsController);
//# sourceMappingURL=appointments.controller.js.map