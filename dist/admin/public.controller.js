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
exports.PublicController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
let PublicController = class PublicController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getAvailabilityByDate(date, time, consultationType) {
        return this.adminService.getAvailabilityByDate(date, time, consultationType);
    }
    async getSettings() {
        return this.adminService.getSettings();
    }
};
exports.PublicController = PublicController;
__decorate([
    (0, common_1.Get)("availability/by-date"),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('time')),
    __param(2, (0, common_1.Query)('consultationType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getAvailabilityByDate", null);
__decorate([
    (0, common_1.Get)("settings"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicController.prototype, "getSettings", null);
exports.PublicController = PublicController = __decorate([
    (0, common_1.Controller)("public"),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], PublicController);
//# sourceMappingURL=public.controller.js.map