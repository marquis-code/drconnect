// import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
// import { InjectModel } from "@nestjs/mongoose"
// import { type Model, Types } from "mongoose"
// import { Transaction } from "src/schemas/transaction.schema"
// import { Appointment } from "src/schemas/appointment.schema"
// import { User } from "src/schemas/user.schema"
// import { InitiatePaymentDto } from "./dto/initiate-payment.dto"
// import { PaystackService } from "src/integrations/paystack.service"
// import { MonoService } from "src/integrations/mono.service"
// import { NotificationService } from "src/notifications/notification.service"

// @Injectable()
// export class PaymentsService {
//   constructor(
//     @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
//     @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
//     @InjectModel(User.name) private userModel: Model<User>,
//     private paystackService: PaystackService,
//     private monoService: MonoService,
//     private notificationService: NotificationService,
//   ) {}

//   async initiatePayment(userId: string, initiatePaymentDto: InitiatePaymentDto) {
//     const { appointmentId, amount, paymentMethod, email, phone, address, customerName, bvn, redirectUrl, description } =
//       initiatePaymentDto

//     const appointment = await this.appointmentModel.findById(appointmentId)
//     if (!appointment) {
//       throw new NotFoundException("Appointment not found")
//     }

//     const transactionRef = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

//     const transaction = new this.transactionModel({
//       userId: new Types.ObjectId(userId),
//       appointmentId: new Types.ObjectId(appointmentId),
//       amount,
//       paymentMethod,
//       transactionRef,
//       paymentStatus: "pending",
//     })

//     await transaction.save()

//     let paymentData: any

//     if (paymentMethod === "Paystack") {
//       paymentData = await this.paystackService.initializePayment({
//         email,
//         amount: amount * 100, // Paystack expects amount in kobo (smallest currency unit)
//         reference: transactionRef,
//         callback_url: `${process.env.API_URL}/payments/callback/paystack`, // Critical: This tells Paystack where to redirect
//         metadata: {
//           appointmentId,
//           userId,
//         },
//       })
//     } else if (paymentMethod === "Mono") {
//       paymentData = await this.monoService.initializePayment({
//         amount,
//         type: "onetime-debit",
//         method: "account",
//         description: description || `Appointment consultation - ${transactionRef}`,
//         reference: transactionRef,
//         redirect_url: redirectUrl || `${process.env.APP_URL}/payments/callback`,
//         customer: {
//           email,
//           phone,
//           address,
//           name: customerName,
//           identity: {
//             type: "bvn",
//             number: bvn || "",
//           },
//         },
//         meta: {
//           appointmentId,
//           userId,
//         },
//       })
//     } else {
//       throw new BadRequestException("Invalid payment method")
//     }

//     return {
//       transactionId: transaction._id,
//       transactionRef,
//       paymentMethod,
//       ...paymentData,
//     }
//   }

//   async verifyPayment(transactionRef: string, paymentMethod: string) {
//     const transaction = await this.transactionModel.findOne({ transactionRef })

//     if (!transaction) {
//       throw new NotFoundException("Transaction not found")
//     }

//     // Prevent duplicate verification - if already successful, return early
//     if (transaction.paymentStatus === "successful") {
//       const appointment = await this.appointmentModel.findById(transaction.appointmentId)
//       return {
//         status: "success",
//         message: "Payment already verified",
//         appointment,
//         transaction,
//       }
//     }

//     let verificationResult: any

//     if (paymentMethod === "Paystack") {
//       verificationResult = await this.paystackService.verifyPayment(transactionRef)
      
//       // Paystack returns status as "success" in the response
//       if (verificationResult.status === "success") {
//         transaction.paymentStatus = "successful"
//         transaction.paystackReference = verificationResult.reference
//         await transaction.save()

//         // Update appointment payment status AND booking status
//         const appointment = await this.appointmentModel.findByIdAndUpdate(
//           transaction.appointmentId,
//           { 
//             paymentStatus: "successful", 
//             transactionId: transaction._id,
//             status: "confirmed" // Update booking status to confirmed
//           },
//           { new: true },
//         )

//         // Send payment confirmation
//         const user = await this.userModel.findById(transaction.userId)
//         if (user) {
//           await this.notificationService.sendPaymentConfirmation(user.email, transaction)
//         }

//         return {
//           status: "success",
//           message: "Payment verified successfully",
//           appointment,
//           transaction,
//         }
//       } else {
//         // Payment failed or pending
//         transaction.paymentStatus = "failed"
//         await transaction.save()

//         // Update appointment to failed/cancelled
//         await this.appointmentModel.findByIdAndUpdate(
//           transaction.appointmentId,
//           { 
//             paymentStatus: "failed",
//             status: "cancelled"
//           }
//         )

//         return {
//           status: "failed",
//           message: "Payment verification failed",
//           transaction,
//         }
//       }
//     } else if (paymentMethod === "Mono") {
//       verificationResult = await this.monoService.verifyPayment(transactionRef)
      
//       if (verificationResult.status === "success") {
//         transaction.paymentStatus = "successful"
//         transaction.monoReference = verificationResult.reference
//         await transaction.save()

//         // Update appointment payment status
//         const appointment = await this.appointmentModel.findByIdAndUpdate(
//           transaction.appointmentId,
//           { 
//             paymentStatus: "successful", 
//             transactionId: transaction._id,
//             status: "confirmed"
//           },
//           { new: true },
//         )

//         // Send payment confirmation
//         const user = await this.userModel.findById(transaction.userId)
//         if (user) {
//           await this.notificationService.sendPaymentConfirmation(user.email, transaction)
//         }

//         return {
//           status: "success",
//           message: "Payment verified successfully",
//           appointment,
//           transaction,
//         }
//       } else {
//         transaction.paymentStatus = "failed"
//         await transaction.save()

//         await this.appointmentModel.findByIdAndUpdate(
//           transaction.appointmentId,
//           { 
//             paymentStatus: "failed",
//             status: "cancelled"
//           }
//         )

//         return {
//           status: "failed",
//           message: "Payment verification failed",
//           transaction,
//         }
//       }
//     } else {
//       throw new BadRequestException("Invalid payment method")
//     }
//   }

//   async getTransactionHistory(userId: string) {
//     const transactions = await this.transactionModel
//       .find({ userId: new Types.ObjectId(userId) })
//       .populate("appointmentId")
//       .sort({ createdAt: -1 })

//     return transactions
//   }

//   async getAllTransactions() {
//     const transactions = await this.transactionModel
//       .find()
//       .populate("userId", "name email")
//       .populate("appointmentId")
//       .sort({ createdAt: -1 })

//     return transactions
//   }

//   async getTransactionById(transactionId: string) {
//     const transaction = await this.transactionModel.findById(transactionId).populate("userId").populate("appointmentId")

//     if (!transaction) {
//       throw new NotFoundException("Transaction not found")
//     }

//     return transaction
//   }

//   async getMonoTransactionHistory(page = 1, startDate?: string, endDate?: string) {
//     try {
//       const monoHistory = await this.monoService.getTransactionHistory(page, startDate, endDate, "successful")
//       return monoHistory
//     } catch (error) {
//       throw new BadRequestException("Failed to retrieve Mono transaction history")
//     }
//   }
// }

import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { type Model, Types } from "mongoose"
import { Transaction } from "src/schemas/transaction.schema"
import { Appointment } from "src/schemas/appointment.schema"
import { User } from "src/schemas/user.schema"
import { InitiatePaymentDto } from "./dto/initiate-payment.dto"
import { PaystackService } from "src/integrations/paystack.service"
import { MonoService } from "src/integrations/mono.service"
import { AppointmentsService } from "src/appointments/appointments.service" // ✅ ADD THIS

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(User.name) private userModel: Model<User>,
    private paystackService: PaystackService,
    private monoService: MonoService,
    private appointmentsService: AppointmentsService, // ✅ ADD THIS
  ) {}

  async initiatePayment(userId: string, initiatePaymentDto: InitiatePaymentDto) {
    const { appointmentId, amount, paymentMethod, email, phone, address, customerName, bvn, redirectUrl, description } =
      initiatePaymentDto

    const appointment = await this.appointmentModel.findById(appointmentId)
    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }

    // ✅ Verify appointment belongs to the user
    if (appointment.userId.toString() !== userId) {
      throw new BadRequestException("Unauthorized to pay for this appointment")
    }

    // ✅ Check if payment already successful
    if (appointment.paymentStatus === "successful") {
      throw new BadRequestException("This appointment has already been paid for")
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
        amount: amount * 100, // Paystack expects amount in kobo
        reference: transactionRef,
        callback_url: `${process.env.API_URL}/payments/callback/paystack`,
        metadata: {
          appointmentId,
          userId,
          customerName,
        },
      })
    } else if (paymentMethod === "Mono") {
      paymentData = await this.monoService.initializePayment({
        amount,
        type: "onetime-debit",
        method: "account",
        description: description || `Doctor Dey Consultation - ${transactionRef}`,
        reference: transactionRef,
        redirect_url: redirectUrl || `${process.env.FRONTEND_URL}/booking/payment-callback`,
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
      appointmentId,
      ...paymentData,
    }
  }

  async verifyPayment(transactionRef: string, paymentMethod: string) {
    const transaction = await this.transactionModel.findOne({ transactionRef })

    if (!transaction) {
      throw new NotFoundException("Transaction not found")
    }

    // ✅ Prevent duplicate verification
    if (transaction.paymentStatus === "successful") {
      const appointment = await this.appointmentModel
        .findById(transaction.appointmentId)
        .populate("userId", "name email phone")

      return {
        status: "success",
        message: "Payment already verified",
        appointment,
        transaction,
        alreadyProcessed: true,
      }
    }

    let verificationResult: any

    if (paymentMethod === "Paystack") {
      verificationResult = await this.paystackService.verifyPayment(transactionRef)
      
      if (verificationResult.status === "success") {
        // ✅ Update transaction
        transaction.paymentStatus = "successful"
        transaction.paystackReference = verificationResult.reference
        await transaction.save()

        // ✅ Update appointment payment status
        await this.appointmentModel.findByIdAndUpdate(
          transaction.appointmentId,
          { 
            paymentStatus: "successful", 
            transactionReference: transactionRef,
            status: "booked", // Keep as "booked" (confirmed by payment)
          },
        )

        // ✅ Generate Google Meet link for virtual consultations
        let meetLink = null
        const appointment = await this.appointmentModel.findById(transaction.appointmentId)
        
        if (appointment && appointment.consultationType === "virtual") {
          try {
            meetLink = await this.appointmentsService.generateMeetLinkAfterPayment(
              transaction.appointmentId.toString()
            )
          } catch (error) {
            console.error("Failed to generate Meet link:", error)
            // Don't throw error - payment is successful, Meet link can be regenerated later
          }
        }

        // ✅ Get updated appointment with populated user
        const updatedAppointment = await this.appointmentModel
          .findById(transaction.appointmentId)
          .populate("userId", "name email phone")

        return {
          status: "success",
          message: "Payment verified successfully",
          appointment: updatedAppointment,
          transaction,
          meetLink,
        }
      } else {
        // Payment failed
        transaction.paymentStatus = "failed"
        await transaction.save()

        await this.appointmentModel.findByIdAndUpdate(
          transaction.appointmentId,
          { 
            paymentStatus: "failed",
            status: "canceled",
          }
        )

        return {
          status: "failed",
          message: verificationResult.message || "Payment verification failed",
          transaction,
        }
      }
    } else if (paymentMethod === "Mono") {
      verificationResult = await this.monoService.verifyPayment(transactionRef)
      
      if (verificationResult.status === "success") {
        transaction.paymentStatus = "successful"
        transaction.monoReference = verificationResult.reference
        await transaction.save()

        await this.appointmentModel.findByIdAndUpdate(
          transaction.appointmentId,
          { 
            paymentStatus: "successful", 
            transactionReference: transactionRef,
            status: "booked",
          },
        )

        // Generate Google Meet link
        let meetLink = null
        const appointment = await this.appointmentModel.findById(transaction.appointmentId)
        
        if (appointment && appointment.consultationType === "virtual") {
          try {
            meetLink = await this.appointmentsService.generateMeetLinkAfterPayment(
              transaction.appointmentId.toString()
            )
          } catch (error) {
            console.error("Failed to generate Meet link:", error)
          }
        }

        const updatedAppointment = await this.appointmentModel
          .findById(transaction.appointmentId)
          .populate("userId", "name email phone")

        return {
          status: "success",
          message: "Payment verified successfully",
          appointment: updatedAppointment,
          transaction,
          meetLink,
        }
      } else {
        transaction.paymentStatus = "failed"
        await transaction.save()

        await this.appointmentModel.findByIdAndUpdate(
          transaction.appointmentId,
          { 
            paymentStatus: "failed",
            status: "canceled",
          }
        )

        return {
          status: "failed",
          message: verificationResult.message || "Payment verification failed",
          transaction,
        }
      }
    } else {
      throw new BadRequestException("Invalid payment method")
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
    const transaction = await this.transactionModel
      .findById(transactionId)
      .populate("userId", "name email phone")
      .populate("appointmentId")

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