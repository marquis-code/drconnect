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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const shared_enums_1 = require("../schemas/shared-enums");
const availability_schema_1 = require("../schemas/availability.schema");
const user_schema_1 = require("../schemas/user.schema");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getDashboardStats() {
        return this.adminService.getDashboardStats();
    }
    async getAllUsers(role) {
        if (role) {
            return this.adminService.getUsersByRole(role);
        }
        return this.adminService.getAllUsers();
    }
    async getAllDoctors() {
        return this.adminService.getAllDoctors();
    }
    async verifyDoctor(doctorId, user) {
        return this.adminService.verifyDoctor(doctorId, user.userId);
    }
    async getAllAppointments(status) {
        if (status) {
            return this.adminService.getAppointmentsByStatus(status);
        }
        return this.adminService.getAllAppointments();
    }
    async getAllTransactions() {
        return this.adminService.getAllTransactions();
    }
    async setAvailability(availabilityData) {
        return this.adminService.setAvailability(availabilityData);
    }
    async getAvailability(doctorId) {
        return this.adminService.getAvailability(doctorId);
    }
    async getAvailabilityByDate(date, time, consultationCategory, doctorId) {
        return this.adminService.getAvailabilityByDate(date, time, consultationCategory, doctorId);
    }
    async updateSettings(settingsData) {
        return this.adminService.updateSettings(settingsData);
    }
    async getSettings() {
        return this.adminService.getSettings();
    }
    async exportTransactions() {
        return this.adminService.exportTransactions();
    }
    async exportAppointments() {
        return this.adminService.exportAppointments();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)("dashboard"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)("users"),
    __param(0, (0, common_1.Query)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)("doctors"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllDoctors", null);
__decorate([
    (0, common_1.Put)("doctors/:id/verify"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "verifyDoctor", null);
__decorate([
    (0, common_1.Get)("appointments"),
    __param(0, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllAppointments", null);
__decorate([
    (0, common_1.Get)("transactions"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllTransactions", null);
__decorate([
    (0, common_1.Post)("availability"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "setAvailability", null);
__decorate([
    (0, common_1.Get)("availability"),
    __param(0, (0, common_1.Query)("doctorId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAvailability", null);
__decorate([
    (0, common_1.Get)("availability/by-date"),
    __param(0, (0, common_1.Query)("date")),
    __param(1, (0, common_1.Query)("time")),
    __param(2, (0, common_1.Query)("consultationCategory")),
    __param(3, (0, common_1.Query)("doctorId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAvailabilityByDate", null);
__decorate([
    (0, common_1.Post)("settings"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Get)("settings"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Get)("export/transactions"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "exportTransactions", null);
__decorate([
    (0, common_1.Get)("export/appointments"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "exportAppointments", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)("admin"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("admin"),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map