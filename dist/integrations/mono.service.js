"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonoService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let MonoService = class MonoService {
    constructor() {
        this.baseUrl = "https://api.withmono.com/v2";
        this.secretKey = process.env.MONO_SECRET_KEY;
    }
    async initializePayment(data) {
        var _a, _b, _c;
        try {
            if (!this.secretKey) {
                throw new common_1.BadRequestException("Mono API key not configured");
            }
            const response = await axios_1.default.post(`${this.baseUrl}/payments/initiate`, data, {
                headers: {
                    "mono-sec-key": this.secretKey,
                    "Content-Type": "application/json",
                    accept: "application/json",
                },
            });
            return {
                status: "success",
                data: response.data,
            };
        }
        catch (error) {
            console.error("[v0] Mono initialization error:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new common_1.BadRequestException(`Mono payment initialization failed: ${((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message}`);
        }
    }
    async verifyPayment(reference) {
        var _a, _b, _c;
        try {
            if (!this.secretKey) {
                throw new common_1.BadRequestException("Mono API key not configured");
            }
            const response = await axios_1.default.get(`${this.baseUrl}/payments/verify/${reference}`, {
                headers: {
                    "mono-sec-key": this.secretKey,
                    accept: "application/json",
                },
            });
            return {
                status: response.data.status === "successful" ? "success" : "failed",
                reference: response.data.reference,
                amount: response.data.amount,
                data: response.data,
            };
        }
        catch (error) {
            console.error("[v0] Mono verification error:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new common_1.BadRequestException(`Mono payment verification failed: ${((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message}`);
        }
    }
    async getTransactionHistory(page = 1, startDate, endDate, status) {
        var _a, _b, _c;
        try {
            if (!this.secretKey) {
                throw new common_1.BadRequestException("Mono API key not configured");
            }
            const params = new URLSearchParams();
            params.append("page", page.toString());
            if (startDate)
                params.append("start", startDate);
            if (endDate)
                params.append("end", endDate);
            if (status)
                params.append("status", status);
            const response = await axios_1.default.get(`${this.baseUrl}/payments/transactions?${params.toString()}`, {
                headers: {
                    "mono-sec-key": this.secretKey,
                    accept: "application/json",
                },
            });
            return {
                status: "success",
                data: response.data,
            };
        }
        catch (error) {
            console.error("[v0] Mono transaction history error:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new common_1.BadRequestException(`Failed to retrieve transaction history: ${((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message}`);
        }
    }
    async getPaymentStatus(reference) {
        var _a, _b, _c;
        try {
            if (!this.secretKey) {
                throw new common_1.BadRequestException("Mono API key not configured");
            }
            const response = await axios_1.default.get(`${this.baseUrl}/payments/verify/${reference}`, {
                headers: {
                    "mono-sec-key": this.secretKey,
                    accept: "application/json",
                },
            });
            return {
                status: response.data.status,
                reference: response.data.reference,
                amount: response.data.amount,
                data: response.data,
            };
        }
        catch (error) {
            console.error("[v0] Mono status check error:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new common_1.BadRequestException(`Failed to get payment status: ${((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message}`);
        }
    }
};
exports.MonoService = MonoService;
exports.MonoService = MonoService = __decorate([
    (0, common_1.Injectable)()
], MonoService);
//# sourceMappingURL=mono.service.js.map