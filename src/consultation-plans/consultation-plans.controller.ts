// src/consultation-plans/consultation-plans.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, ParseBoolPipe } from "@nestjs/common"
import { ConsultationPlansService } from "./consultation-plans.service"
import { CreateConsultationPlanDto } from "./dto/create-consultation-plan.dto"
import { UpdateConsultationPlanDto } from "./dto/update-consultation-plan.dto"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { AdminGuard } from "src/auth/guards/admin.guard"

@Controller("consultation-plans")
export class ConsultationPlansController {
  constructor(private consultationPlansService: ConsultationPlansService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createPlan(@Body() createPlanDto: CreateConsultationPlanDto) {
    return this.consultationPlansService.createPlan(createPlanDto)
  }

  @Get()
  async getAllPlans(@Query("includeInactive", new ParseBoolPipe({ optional: true })) includeInactive?: boolean) {
    return this.consultationPlansService.getAllPlans(includeInactive || false)
  }

  @Get("available/:date")
  async getAvailablePlansForDate(@Param("date") date: string) {
    return this.consultationPlansService.getAvailablePlansForDate(new Date(date))
  }

  @Get(":id")
  async getPlanById(@Param("id") id: string) {
    return this.consultationPlansService.getPlanById(id)
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updatePlan(@Param("id") id: string, @Body() updatePlanDto: UpdateConsultationPlanDto) {
    return this.consultationPlansService.updatePlan(id, updatePlanDto)
  }

  @Put(":id/toggle-status")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async togglePlanStatus(@Param("id") id: string) {
    return this.consultationPlansService.togglePlanStatus(id)
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deletePlan(@Param("id") id: string) {
    await this.consultationPlansService.deletePlan(id)
    return { message: "Consultation plan deleted successfully" }
  }
}