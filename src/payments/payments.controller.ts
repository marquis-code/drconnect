import { Controller, Post, Get, Param, UseGuards, Query } from "@nestjs/common"
import { PaymentsService } from "./payments.service"
import { InitiatePaymentDto } from "./dto/initiate-payment.dto"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { AdminGuard } from "src/auth/guards/admin.guard"
import { CurrentUser } from "src/auth/decorators/current-user.decorator"

@Controller("payments")
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post("initiate")
  async initiatePayment(initiatePaymentDto: InitiatePaymentDto, @CurrentUser() user: any) {
    return this.paymentsService.initiatePayment(user.userId, initiatePaymentDto)
  }

  @Post("verify")
  async verifyPayment(@Query("reference") reference: string, @Query("method") method: string) {
    return this.paymentsService.verifyPayment(reference, method)
  }

  @Get("history")
  async getTransactionHistory(@CurrentUser() user: any) {
    return this.paymentsService.getTransactionHistory(user.userId)
  }

  @Get("all")
  @UseGuards(AdminGuard)
  async getAllTransactions() {
    return this.paymentsService.getAllTransactions()
  }

  @Get("mono/history")
  @UseGuards(AdminGuard)
  async getMonoTransactionHistory(
    @Query("page") page: number = 1,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    return this.paymentsService.getMonoTransactionHistory(page, startDate, endDate)
  }

  @Get(":id")
  async getTransactionById(@Param("id") id: string) {
    return this.paymentsService.getTransactionById(id)
  }
}
