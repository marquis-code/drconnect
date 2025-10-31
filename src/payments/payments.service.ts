import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { type Model, Types } from "mongoose"
import { Transaction } from "src/schemas/transaction.schema"
import { Appointment } from "src/schemas/appointment.schema"
import { User } from "src/schemas/user.schema"
import { InitiatePaymentDto } from "./dto/initiate-payment.dto"
import { PaystackService } from "src/integrations/paystack.service"
import { MonoService } from "src/integrations/mono.service"
import { NotificationService } from "src/notifications/notification.service"

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(User.name) private userModel: Model<User>,
    private paystackService: PaystackService,
    private monoService: MonoService,
    private notificationService: NotificationService,
  ) {}

  async initiatePayment(userId: string, initiatePaymentDto: InitiatePaymentDto) {
    const { appointmentId, amount, paymentMethod, email, phone, address, customerName, bvn, redirectUrl, description } =
      initiatePaymentDto

    const appointment = await this.appointmentModel.findById(appointmentId)
    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }

    const transactionRef = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const transaction = new this.transactionModel({
      userId: new Types.ObjectId(userId),
      appointmentId: new Types.ObjectId(appointmentId),
      amount,
      paymentMethod,
      transactionRef,
      paymentStatus: "pending",
    })

    await transaction.save()

    let paymentData: any

    if (paymentMethod === "Paystack") {
      paymentData = await this.paystackService.initializePayment({
        email,
        amount: amount * 100,
        reference: transactionRef,
        metadata: {
          appointmentId,
          userId,
        },
      })
    } else if (paymentMethod === "Mono") {
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
      })
    } else {
      throw new BadRequestException("Invalid payment method")
    }

    return {
      transactionId: transaction._id,
      transactionRef,
      paymentMethod,
      ...paymentData,
    }
  }

  async verifyPayment(transactionRef: string, paymentMethod: string) {
    const transaction = await this.transactionModel.findOne({ transactionRef })

    if (!transaction) {
      throw new NotFoundException("Transaction not found")
    }

    let verificationResult: any

    if (paymentMethod === "Paystack") {
      verificationResult = await this.paystackService.verifyPayment(transactionRef)
    } else if (paymentMethod === "Mono") {
      verificationResult = await this.monoService.verifyPayment(transactionRef)
    } else {
      throw new BadRequestException("Invalid payment method")
    }

    if (verificationResult.status === "success") {
      transaction.paymentStatus = "successful"
      if (paymentMethod === "Mono") {
        transaction.monoReference = verificationResult.reference
      } else {
        transaction.paystackReference = verificationResult.reference
      }
      await transaction.save()

      // Update appointment payment status
      const appointment = await this.appointmentModel.findByIdAndUpdate(
        transaction.appointmentId,
        { paymentStatus: "successful", transactionId: transaction._id },
        { new: true },
      )

      // Send payment confirmation
      const user = await this.userModel.findById(transaction.userId)
      if (user) {
        await this.notificationService.sendPaymentConfirmation(user.email, transaction)
      }

      return {
        status: "success",
        message: "Payment verified successfully",
        appointment,
        transaction,
      }
    } else {
      transaction.paymentStatus = "failed"
      await transaction.save()

      return {
        status: "failed",
        message: "Payment verification failed",
        transaction,
      }
    }
  }

  async getTransactionHistory(userId: string) {
    const transactions = await this.transactionModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate("appointmentId")
      .sort({ createdAt: -1 })

    return transactions
  }

  async getAllTransactions() {
    const transactions = await this.transactionModel
      .find()
      .populate("userId", "name email")
      .populate("appointmentId")
      .sort({ createdAt: -1 })

    return transactions
  }

  async getTransactionById(transactionId: string) {
    const transaction = await this.transactionModel.findById(transactionId).populate("userId").populate("appointmentId")

    if (!transaction) {
      throw new NotFoundException("Transaction not found")
    }

    return transaction
  }

  async getMonoTransactionHistory(page = 1, startDate?: string, endDate?: string) {
    try {
      const monoHistory = await this.monoService.getTransactionHistory(page, startDate, endDate, "successful")
      return monoHistory
    } catch (error) {
      throw new BadRequestException("Failed to retrieve Mono transaction history")
    }
  }
}