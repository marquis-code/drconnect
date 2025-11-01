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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const initiate_payment_dto_1 = require("./dto/initiate-payment.dto");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const admin_guard_1 = require("../auth/guards/admin.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async initiatePayment(initiatePaymentDto, user) {
        return this.paymentsService.initiatePayment(user.userId, initiatePaymentDto);
    }
    async paystackCallback(reference, trxref, res) {
        try {
            const transactionRef = reference || trxref;
            if (!transactionRef) {
                console.error('Paystack callback: No transaction reference provided');
                return res.redirect(`${process.env.FRONTEND_URL}/booking/payment-callback?status=error&message=${encodeURIComponent('No transaction reference')}`);
            }
            console.log('Paystack callback: Processing payment for reference:', transactionRef);
            const verificationResult = await this.paymentsService.verifyPayment(transactionRef, 'Paystack');
            console.log('Paystack callback: Verification result:', verificationResult.status);
            if (verificationResult.status === 'success') {
                return res.redirect(`${process.env.FRONTEND_URL}/booking/payment-callback?status=success&reference=${transactionRef}`);
            }
            else {
                return res.redirect(`${process.env.FRONTEND_URL}/booking/payment-callback?status=failed&reference=${transactionRef}&message=${encodeURIComponent(verificationResult.message || 'Payment verification failed')}`);
            }
        }
        catch (error) {
            console.error('Paystack callback error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Verification failed';
            return res.redirect(`${process.env.FRONTEND_URL}/booking/payment-callback?status=error&message=${encodeURIComponent(errorMessage)}`);
        }
    }
    async verifyPayment(reference, method) {
        return this.paymentsService.verifyPayment(reference, method);
    }
    async getTransactionHistory(user) {
        return this.paymentsService.getTransactionHistory(user.userId);
    }
    async getAllTransactions() {
        return this.paymentsService.getAllTransactions();
    }
    async getMonoTransactionHistory(page = 1, startDate, endDate) {
        return this.paymentsService.getMonoTransactionHistory(page, startDate, endDate);
    }
    async getTransactionById(id) {
        return this.paymentsService.getTransactionById(id);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)("initiate"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [initiate_payment_dto_1.InitiatePaymentDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "initiatePayment", null);
__decorate([
    (0, common_1.Get)("callback/paystack"),
    __param(0, (0, common_1.Query)("reference")),
    __param(1, (0, common_1.Query)("trxref")),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "paystackCallback", null);
__decorate([
    (0, common_1.Post)("verify"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)("reference")),
    __param(1, (0, common_1.Query)("method")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.Get)("history"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getTransactionHistory", null);
__decorate([
    (0, common_1.Get)("all"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getAllTransactions", null);
__decorate([
    (0, common_1.Get)("mono/history"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("startDate")),
    __param(2, (0, common_1.Query)("endDate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getMonoTransactionHistory", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getTransactionById", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)("payments"),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map