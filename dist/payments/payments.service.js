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
const config_1 = require("@nestjs/config");
const mongoose_2 = require("mongoose");
const transaction_schema_1 = require("../schemas/transaction.schema");
const appointment_schema_1 = require("../schemas/appointment.schema");
const user_schema_1 = require("../schemas/user.schema");
const paystack_service_1 = require("../integrations/paystack.service");
const mono_service_1 = require("../integrations/mono.service");
const appointments_service_1 = require("../appointments/appointments.service");
let PaymentsService = class PaymentsService {
    constructor(transactionModel, appointmentModel, userModel, paystackService, monoService, appointmentsService, configService) {
        this.transactionModel = transactionModel;
        this.appointmentModel = appointmentModel;
        this.userModel = userModel;
        this.paystackService = paystackService;
        this.monoService = monoService;
        this.appointmentsService = appointmentsService;
        this.configService = configService;
    }
    async initiatePayment(userId, initiatePaymentDto) {
        const { appointmentId, amount, paymentMethod, email, phone, address, customerName, bvn, redirectUrl, description } = initiatePaymentDto;
        const appointment = await this.appointmentModel.findById(appointmentId);
        if (!appointment) {
            throw new common_1.NotFoundException("Appointment not found");
        }
        if (appointment.userId.toString() !== userId) {
            throw new common_1.BadRequestException("Unauthorized to pay for this appointment");
        }
        if (appointment.paymentStatus === "successful") {
            throw new common_1.BadRequestException("This appointment has already been paid for");
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
            const apiUrl = this.configService.get("API_URL");
            paymentData = await this.paystackService.initializePayment({
                email,
                amount: amount * 100,
                reference: transactionRef,
                callback_url: `${apiUrl}/payments/callback/paystack`,
                metadata: {
                    appointmentId,
                    userId,
                    customerName,
                },
            });
        }
        else if (paymentMethod === "Mono") {
            const frontendUrl = this.configService.get("FRONTEND_URL");
            paymentData = await this.monoService.initializePayment({
                amount,
                type: "onetime-debit",
                method: "account",
                description: description || `Doctor Dey Consultation - ${transactionRef}`,
                reference: transactionRef,
                redirect_url: redirectUrl || `${frontendUrl}/booking/payment-callback`,
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
            paymentMethod,
            appointmentId }, paymentData);
    }
    async verifyPayment(transactionRef, paymentMethod) {
        const transaction = await this.transactionModel.findOne({ transactionRef });
        if (!transaction) {
            throw new common_1.NotFoundException("Transaction not found");
        }
        if (transaction.paymentStatus === "successful") {
            const appointment = await this.appointmentModel
                .findById(transaction.appointmentId)
                .populate("userId", "name email phone");
            return {
                status: "success",
                message: "Payment already verified",
                appointment,
                transaction,
                alreadyProcessed: true,
            };
        }
        let verificationResult;
        if (paymentMethod === "Paystack") {
            verificationResult = await this.paystackService.verifyPayment(transactionRef);
            if (verificationResult.status === "success") {
                transaction.paymentStatus = "successful";
                transaction.paystackReference = verificationResult.reference;
                await transaction.save();
                await this.appointmentModel.findByIdAndUpdate(transaction.appointmentId, {
                    paymentStatus: "successful",
                    transactionReference: transactionRef,
                    status: "booked",
                });
                let meetLink = null;
                const appointment = await this.appointmentModel.findById(transaction.appointmentId);
                if (appointment && appointment.consultationType === "virtual") {
                    try {
                        meetLink = await this.appointmentsService.generateMeetLinkAfterPayment(transaction.appointmentId.toString());
                    }
                    catch (error) {
                        console.error("Failed to generate Meet link:", error);
                    }
                }
                const updatedAppointment = await this.appointmentModel
                    .findById(transaction.appointmentId)
                    .populate("userId", "name email phone");
                return {
                    status: "success",
                    message: "Payment verified successfully",
                    appointment: updatedAppointment,
                    transaction,
                    meetLink,
                };
            }
            else {
                transaction.paymentStatus = "failed";
                await transaction.save();
                await this.appointmentModel.findByIdAndUpdate(transaction.appointmentId, {
                    paymentStatus: "failed",
                    status: "canceled",
                });
                return {
                    status: "failed",
                    message: verificationResult.message || "Payment verification failed",
                    transaction,
                };
            }
        }
        else if (paymentMethod === "Mono") {
            verificationResult = await this.monoService.verifyPayment(transactionRef);
            if (verificationResult.status === "success") {
                transaction.paymentStatus = "successful";
                transaction.monoReference = verificationResult.reference;
                await transaction.save();
                await this.appointmentModel.findByIdAndUpdate(transaction.appointmentId, {
                    paymentStatus: "successful",
                    transactionReference: transactionRef,
                    status: "booked",
                });
                let meetLink = null;
                const appointment = await this.appointmentModel.findById(transaction.appointmentId);
                if (appointment && appointment.consultationType === "virtual") {
                    try {
                        meetLink = await this.appointmentsService.generateMeetLinkAfterPayment(transaction.appointmentId.toString());
                    }
                    catch (error) {
                        console.error("Failed to generate Meet link:", error);
                    }
                }
                const updatedAppointment = await this.appointmentModel
                    .findById(transaction.appointmentId)
                    .populate("userId", "name email phone");
                return {
                    status: "success",
                    message: "Payment verified successfully",
                    appointment: updatedAppointment,
                    transaction,
                    meetLink,
                };
            }
            else {
                transaction.paymentStatus = "failed";
                await transaction.save();
                await this.appointmentModel.findByIdAndUpdate(transaction.appointmentId, {
                    paymentStatus: "failed",
                    status: "canceled",
                });
                return {
                    status: "failed",
                    message: verificationResult.message || "Payment verification failed",
                    transaction,
                };
            }
        }
        else {
            throw new common_1.BadRequestException("Invalid payment method");
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
        const transaction = await this.transactionModel
            .findById(transactionId)
            .populate("userId", "name email phone")
            .populate("appointmentId");
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
        appointments_service_1.AppointmentsService,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map