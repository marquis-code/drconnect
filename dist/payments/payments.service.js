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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transaction_schema_1 = require("../schemas/transaction.schema");
const appointment_schema_1 = require("../schemas/appointment.schema");
const user_schema_1 = require("../schemas/user.schema");
const paystack_service_1 = require("../integrations/paystack.service");
const mono_service_1 = require("../integrations/mono.service");
const notification_service_1 = require("../notifications/notification.service");
let PaymentsService = class PaymentsService {
    constructor(transactionModel, appointmentModel, userModel, paystackService, monoService, notificationService) {
        this.transactionModel = transactionModel;
        this.appointmentModel = appointmentModel;
        this.userModel = userModel;
        this.paystackService = paystackService;
        this.monoService = monoService;
        this.notificationService = notificationService;
    }
    async initiatePayment(userId, initiatePaymentDto) {
        const { appointmentId, amount, paymentMethod, email, phone, address, customerName, bvn, redirectUrl, description } = initiatePaymentDto;
        const appointment = await this.appointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        const transactionRef = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const transaction = new this.transactionModel({
            userId: new mongoose_2.Types.ObjectId(userId),
            appointmentId: new mongoose_2.Types.ObjectId(appointmentId),
            amount,
            paymentMethod,
            transactionRef,
            paymentStatus: "pending",
        });
        await transaction.save();
        let paymentData;
        if (paymentMethod === "Paystack") {
            paymentData = await this.paystackService.initializePayment({
                email,
                amount: amount * 100,
                reference: transactionRef,
                metadata: {
                    appointmentId,
                    userId,
                },
            });
        }
        else if (paymentMethod === "Mono") {
            paymentData = await this.monoService.initializePayment({
                amount,
                type: "onetime-debit",
                method: "account",
                description: description || `Appointment consultation - ${transactionRef}`,
                reference: transactionRef,
                redirect_url: redirectUrl || `${process.env.APP_URL}/payments/callback`,
                customer: {
                    email,
                    phone,
                    address,
                    name: customerName,
                    identity: {
                        type: "bvn",
                        number: bvn || "",
                    },
                },
                meta: {
                    appointmentId,
                    userId,
                },
            });
        }
        else {
            throw new common_1.BadRequestException("Invalid payment method");
        }
        return Object.assign({ transactionId: transaction._id, transactionRef,
            paymentMethod }, paymentData);
    }
    async verifyPayment(transactionRef, paymentMethod) {
        const transaction = await this.transactionModel.findOne({ transactionRef });
        if (!transaction) {
            throw new common_1.NotFoundException("Transaction not found");
        }
        let verificationResult;
        if (paymentMethod === "Paystack") {
            verificationResult = await this.paystackService.verifyPayment(transactionRef);
        }
        else if (paymentMethod === "Mono") {
            verificationResult = await this.monoService.verifyPayment(transactionRef);
        }
        else {
            throw new common_1.BadRequestException("Invalid payment method");
        }
        if (verificationResult.status === "success") {
            transaction.paymentStatus = "successful";
            if (paymentMethod === "Mono") {
                transaction.monoReference = verificationResult.reference;
            }
            else {
                transaction.paystackReference = verificationResult.reference;
            }
            await transaction.save();
            const appointment = await this.appointmentModel.findByIdAndUpdate(transaction.appointmentId, { paymentStatus: "successful", transactionId: transaction._id }, { new: true });
            const user = await this.userModel.findById(transaction.userId);
            if (user) {
                await this.notificationService.sendPaymentConfirmation(user.email, transaction);
            }
            return {
                status: "success",
                message: "Payment verified successfully",
                appointment,
                transaction,
            };
        }
        else {
            transaction.paymentStatus = "failed";
            await transaction.save();
            return {
                status: "failed",
                message: "Payment verification failed",
                transaction,
            };
        }
    }
    async getTransactionHistory(userId) {
        const transactions = await this.transactionModel
            .find({ userId: new mongoose_2.Types.ObjectId(userId) })
            .populate("appointmentId")
            .sort({ createdAt: -1 });
        return transactions;
    }
    async getAllTransactions() {
        const transactions = await this.transactionModel
            .find()
            .populate("userId", "name email")
            .populate("appointmentId")
            .sort({ createdAt: -1 });
        return transactions;
    }
    async getTransactionById(transactionId) {
        const transaction = await this.transactionModel.findById(transactionId).populate("userId").populate("appointmentId");
        if (!transaction) {
            throw new common_1.NotFoundException("Transaction not found");
        }
        return transaction;
    }
    async getMonoTransactionHistory(page = 1, startDate, endDate) {
        try {
            const monoHistory = await this.monoService.getTransactionHistory(page, startDate, endDate, "successful");
            return monoHistory;
        }
        catch (error) {
            throw new common_1.BadRequestException("Failed to retrieve Mono transaction history");
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __param(1, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [Function, Function, Function, paystack_service_1.PaystackService,
        mono_service_1.MonoService,
        notification_service_1.NotificationService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map