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
exports.PaystackService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let PaystackService = class PaystackService {
    constructor() {
        this.baseUrl = "https://api.paystack.co";
        this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    }
    async initializePayment(data) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/transaction/initialize`, data, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data.data;
        }
        catch (error) {
            throw new Error(`Paystack initialization failed: ${error.message}`);
        }
    }
    async verifyPayment(reference) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                },
            });
            return response.data.data;
        }
        catch (error) {
            throw new Error(`Paystack verification failed: ${error.message}`);
        }
    }
    async getPaymentDetails(reference) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/transaction/${reference}`, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                },
            });
            return response.data.data;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            throw new Error(`Error fetching payment details: ${errorMessage}`);
        }
    }
};
exports.PaystackService = PaystackService;
exports.PaystackService = PaystackService = __decorate([
    (0, common_1.Injectable)()
], PaystackService);
//# sourceMappingURL=paystack.service.js.map