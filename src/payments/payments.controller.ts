import { Controller, Post, Get, Param, UseGuards, Query, Body, Res } from "@nestjs/common"
import { Response } from "express"
import { PaymentsService } from "./payments.service"
import { InitiatePaymentDto } from "./dto/initiate-payment.dto"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { AdminGuard } from "src/auth/guards/admin.guard"
import { CurrentUser } from "src/auth/decorators/current-user.decorator"

@Controller("payments")
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post("initiate")
  @UseGuards(JwtAuthGuard)
  async initiatePayment(@Body() initiatePaymentDto: InitiatePaymentDto, @CurrentUser() user: any) {
    return this.paymentsService.initiatePayment(user.userId, initiatePaymentDto)
  }

  @Get("callback/paystack")
  async paystackCallback(
    @Query("reference") reference: string,
    @Query("trxref") trxref: string,
    @Res() res: Response
  ) {
    try {
      const transactionRef = reference || trxref
      
      if (!transactionRef) {
        console.error('Paystack callback: No transaction reference provided')
        return res.redirect(
          `${process.env.FRONTEND_URL}/booking/payment-callback?status=error&message=${encodeURIComponent('No transaction reference')}`
        )
      }

      console.log('Paystack callback: Processing payment for reference:', transactionRef)

      // Verify the payment - this also updates the booking status
      const verificationResult = await this.paymentsService.verifyPayment(transactionRef, 'Paystack')
      
      console.log('Paystack callback: Verification result:', verificationResult.status)

      if (verificationResult.status === 'success') {
        // Payment verified successfully and booking status updated to confirmed
        return res.redirect(
          `${process.env.FRONTEND_URL}/booking/payment-callback?status=success&reference=${transactionRef}`
        )
      } else {
        // Payment verification failed
        return res.redirect(
          `${process.env.FRONTEND_URL}/booking/payment-callback?status=failed&reference=${transactionRef}&message=${encodeURIComponent(verificationResult.message || 'Payment verification failed')}`
        )
      }
    } catch (error) {
      console.error('Paystack callback error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Verification failed'
      return res.redirect(
        `${process.env.FRONTEND_URL}/booking/payment-callback?status=error&message=${encodeURIComponent(errorMessage)}`
      )
    }
  }


  @Post("verify")
  @UseGuards(JwtAuthGuard)
  async verifyPayment(@Query("reference") reference: string, @Query("method") method: string) {
    return this.paymentsService.verifyPayment(reference, method)
  }

  @Get("history")
  @UseGuards(JwtAuthGuard)
  async getTransactionHistory(@CurrentUser() user: any) {
    return this.paymentsService.getTransactionHistory(user.userId)
  }

  @Get("all")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAllTransactions() {
    return this.paymentsService.getAllTransactions()
  }

  @Get("mono/history")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getMonoTransactionHistory(
    @Query("page") page: number = 1,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.paymentsService.getMonoTransactionHistory(page, startDate, endDate)
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async getTransactionById(@Param("id") id: string) {
    return this.paymentsService.getTransactionById(id)
  }
}