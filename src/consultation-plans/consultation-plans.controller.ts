// src/consultation-plans/consultation-plans.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Query, 
  ParseBoolPipe,
  HttpCode,
  HttpStatus
} from "@nestjs/common"
import { ConsultationPlansService } from "./consultation-plans.service"
import { CreateConsultationPlanDto } from "./dto/create-consultation-plan.dto"
import { UpdateConsultationPlanDto } from "./dto/update-consultation-plan.dto"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { AdminGuard } from "src/auth/guards/admin.guard"
import { ConsultationType, ConsultationCategory } from "src/schemas/consultation-plan.schema"

@Controller("consultation-plans")
export class ConsultationPlansController {
  constructor(private consultationPlansService: ConsultationPlansService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  async createPlan(@Body() createPlanDto: CreateConsultationPlanDto) {
    return this.consultationPlansService.createPlan(createPlanDto)
  }

  @Get()
  async getAllPlans(
    @Query("includeInactive", new ParseBoolPipe({ optional: true })) includeInactive?: boolean,
    @Query("consultationType") consultationType?: ConsultationType,
    @Query("consultationCategory") consultationCategory?: ConsultationCategory,
    @Query("minPrice") minPriceParam?: string,
    @Query("maxPrice") maxPriceParam?: string
  ) {
    // Convert string query params to numbers, only if they are valid
    const minPrice = minPriceParam ? parseFloat(minPriceParam) : undefined
    const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined

    // Validate that the parsed values are valid numbers
    const validMinPrice = minPrice !== undefined && !isNaN(minPrice) ? minPrice : undefined
    const validMaxPrice = maxPrice !== undefined && !isNaN(maxPrice) ? maxPrice : undefined

    return this.consultationPlansService.getAllPlans({
      includeInactive: includeInactive || false,
      consultationType,
      consultationCategory,
      minPrice: validMinPrice,
      maxPrice: validMaxPrice
    })
  }

  @Get("available/:date")
  async getAvailablePlansForDate(
    @Param("date") date: string,
    @Query("consultationType") consultationType?: ConsultationType,
    @Query("consultationCategory") consultationCategory?: ConsultationCategory
  ) {
    return this.consultationPlansService.getAvailablePlansForDate(
      new Date(date),
      consultationType,
      consultationCategory
    )
  }

  @Get("type/:consultationType")
  async getPlansByType(@Param("consultationType") consultationType: ConsultationType) {
    return this.consultationPlansService.getPlansByType(consultationType)
  }

  @Get("category/:consultationCategory")
  async getPlansByCategory(@Param("consultationCategory") consultationCategory: ConsultationCategory) {
    return this.consultationPlansService.getPlansByCategory(consultationCategory)
  }

  @Get("new-patients")
  async getPlansForNewPatients() {
    return this.consultationPlansService.getPlansForNewPatients()
  }

  @Get("existing-patients")
  async getPlansForExistingPatients() {
    return this.consultationPlansService.getPlansForExistingPatients()
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

  @Put("bulk/reorder")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async reorderPlans(@Body() orderData: { planId: string; sortOrder: number }[]) {
    return this.consultationPlansService.reorderPlans(orderData)
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePlan(@Param("id") id: string) {
    await this.consultationPlansService.deletePlan(id)
  }
}