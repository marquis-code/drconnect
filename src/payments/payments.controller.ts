import { Controller, Post, Get, Param, UseGuards, Query, Body, Req, Res } from "@nestjs/common"
import { Request, Response } from "express"
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

  // NEW: Paystack callback endpoint (no auth guard needed for callback)
  @Get("callback/paystack")
  async paystackCallback(
    @Query("reference") reference: string,
    @Query("trxref") trxref: string,
    @Res() res: Response
  ) {
    try {
      const transactionRef = reference || trxref
      
      if (!transactionRef) {
        // Redirect to frontend with error
        return res.redirect(`${process.env.FRONTEND_URL}/booking/payment-callback?status=error&message=No transaction reference`)
      }

      // Verify the payment
      const verificationResult = await this.paymentsService.verifyPayment(transactionRef, 'Paystack')
      
      if (verificationResult.status === 'success') {
        // Redirect to frontend success page
        return res.redirect(`${process.env.FRONTEND_URL}/booking/payment-callback?status=success&reference=${transactionRef}`)
      } else {
        // Redirect to frontend with failure
        return res.redirect(`${process.env.FRONTEND_URL}/booking/payment-callback?status=failed&reference=${transactionRef}`)
      }
    } catch (error) {
      console.error('Paystack callback error:', error)
      return res.redirect(`${process.env.FRONTEND_URL}/booking/payment-callback?status=error&message=Verification failed`)
    }
  }

  // Keep this for manual verification if needed
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