// src/consultation-plans/consultation-plans.service.ts
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { ConsultationPlan } from "src/schemas/consultation-plan.schema"
import { CreateConsultationPlanDto } from "./dto/create-consultation-plan.dto"
import { UpdateConsultationPlanDto } from "./dto/update-consultation-plan.dto"

@Injectable()
export class ConsultationPlansService {
  constructor(
    @InjectModel(ConsultationPlan.name) private consultationPlanModel: Model<ConsultationPlan>,
  ) {}

  async createPlan(createPlanDto: CreateConsultationPlanDto): Promise<ConsultationPlan> {
    const plan = new this.consultationPlanModel(createPlanDto)
    return plan.save()
  }

  async getAllPlans(includeInactive = false): Promise<ConsultationPlan[]> {
    const query = includeInactive ? {} : { isActive: true }
    return this.consultationPlanModel.find(query).sort({ sortOrder: 1, createdAt: 1 })
  }

  async getPlanById(planId: string): Promise<ConsultationPlan> {
    const plan = await this.consultationPlanModel.findById(planId)
    if (!plan) {
      throw new NotFoundException("Consultation plan not found")
    }
    return plan
  }

  async updatePlan(planId: string, updatePlanDto: UpdateConsultationPlanDto): Promise<ConsultationPlan> {
    const plan = await this.consultationPlanModel.findByIdAndUpdate(
      planId,
      updatePlanDto,
      { new: true }
    )

    if (!plan) {
      throw new NotFoundException("Consultation plan not found")
    }

    return plan
  }

  async deletePlan(planId: string): Promise<void> {
    const result = await this.consultationPlanModel.findByIdAndDelete(planId)
    if (!result) {
      throw new NotFoundException("Consultation plan not found")
    }
  }

  async togglePlanStatus(planId: string): Promise<ConsultationPlan> {
    const plan = await this.consultationPlanModel.findById(planId)
    if (!plan) {
      throw new NotFoundException("Consultation plan not found")
    }

    plan.isActive = !plan.isActive
    return plan.save()
  }

  // Check if a plan is available for a specific date/time
  async isPlanAvailableForDateTime(planId: string, date: Date, timeSlot: string): Promise<boolean> {
    const plan = await this.getPlanById(planId)

    if (!plan.isActive) {
      return false
    }

    const dayOfWeek = date.getDay()
    
    // Check if the day is available
    if (!plan.availableDays.includes(dayOfWeek)) {
      return false
    }

    // Check time range if specified
    if (plan.availableTimeRange) {
      const [startTime, endTime] = plan.availableTimeRange.split("-")
      const slotTime = timeSlot.split("-")[0] // Get start time from slot
      
      if (slotTime < startTime || slotTime > endTime) {
        return false
      }
    }

    return true
  }

  // Get available plans for a specific date
  async getAvailablePlansForDate(date: Date): Promise<ConsultationPlan[]> {
    const dayOfWeek = date.getDay()
    
    return this.consultationPlanModel.find({
      isActive: true,
      availableDays: dayOfWeek
    }).sort({ sortOrder: 1 })
  }
}