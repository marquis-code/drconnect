// // src/consultation-plans/consultation-plans.service.ts
// import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
// import { InjectModel } from "@nestjs/mongoose"
// import { Model } from "mongoose"
// import { ConsultationPlan } from "src/schemas/consultation-plan.schema"
// import { CreateConsultationPlanDto } from "./dto/create-consultation-plan.dto"
// import { UpdateConsultationPlanDto } from "./dto/update-consultation-plan.dto"

// @Injectable()
// export class ConsultationPlansService {
//   constructor(
//     @InjectModel(ConsultationPlan.name) private consultationPlanModel: Model<ConsultationPlan>,
//   ) {}

//   async createPlan(createPlanDto: CreateConsultationPlanDto): Promise<ConsultationPlan> {
//     const plan = new this.consultationPlanModel(createPlanDto)
//     return plan.save()
//   }

//   async getAllPlans(includeInactive = false): Promise<ConsultationPlan[]> {
//     const query = includeInactive ? {} : { isActive: true }
//     return this.consultationPlanModel.find(query).sort({ sortOrder: 1, createdAt: 1 })
//   }

//   async getPlanById(planId: string): Promise<ConsultationPlan> {
//     const plan = await this.consultationPlanModel.findById(planId)
//     if (!plan) {
//       throw new NotFoundException("Consultation plan not found")
//     }
//     return plan
//   }

//   async updatePlan(planId: string, updatePlanDto: UpdateConsultationPlanDto): Promise<ConsultationPlan> {
//     const plan = await this.consultationPlanModel.findByIdAndUpdate(
//       planId,
//       updatePlanDto,
//       { new: true }
//     )

//     if (!plan) {
//       throw new NotFoundException("Consultation plan not found")
//     }

//     return plan
//   }

//   async deletePlan(planId: string): Promise<void> {
//     const result = await this.consultationPlanModel.findByIdAndDelete(planId)
//     if (!result) {
//       throw new NotFoundException("Consultation plan not found")
//     }
//   }

//   async togglePlanStatus(planId: string): Promise<ConsultationPlan> {
//     const plan = await this.consultationPlanModel.findById(planId)
//     if (!plan) {
//       throw new NotFoundException("Consultation plan not found")
//     }

//     plan.isActive = !plan.isActive
//     return plan.save()
//   }

//   // Check if a plan is available for a specific date/time
//   async isPlanAvailableForDateTime(planId: string, date: Date, timeSlot: string): Promise<boolean> {
//     const plan = await this.getPlanById(planId)

//     if (!plan.isActive) {
//       return false
//     }

//     const dayOfWeek = date.getDay()
    
//     // Check if the day is available
//     if (!plan.availableDays.includes(dayOfWeek)) {
//       return false
//     }

//     // Check time range if specified
//     if (plan.availableTimeRange) {
//       const [startTime, endTime] = plan.availableTimeRange.split("-")
//       const slotTime = timeSlot.split("-")[0] // Get start time from slot
      
//       if (slotTime < startTime || slotTime > endTime) {
//         return false
//       }
//     }

//     return true
//   }

//   // Get available plans for a specific date
//   async getAvailablePlansForDate(date: Date): Promise<ConsultationPlan[]> {
//     const dayOfWeek = date.getDay()
    
//     return this.consultationPlanModel.find({
//       isActive: true,
//       availableDays: dayOfWeek
//     }).sort({ sortOrder: 1 })
//   }
// }

// src/consultation-plans/consultation-plans.service.ts
import { Injectable, NotFoundException, BadRequestException, ConflictException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { ConsultationPlan, ConsultationType, ConsultationCategory } from "src/schemas/consultation-plan.schema"
import { CreateConsultationPlanDto } from "./dto/create-consultation-plan.dto"
import { UpdateConsultationPlanDto } from "./dto/update-consultation-plan.dto"

interface GetAllPlansOptions {
  includeInactive?: boolean
  consultationType?: ConsultationType
  consultationCategory?: ConsultationCategory
  minPrice?: number
  maxPrice?: number
}

@Injectable()
export class ConsultationPlansService {
  constructor(
    @InjectModel(ConsultationPlan.name) private consultationPlanModel: Model<ConsultationPlan>,
  ) {}

  async createPlan(createPlanDto: CreateConsultationPlanDto): Promise<ConsultationPlan> {
    // Validate business rules
    if (createPlanDto.isNewPatientOnly && createPlanDto.isExistingPatientOnly) {
      throw new BadRequestException("Plan cannot be for both new and existing patients only")
    }

    // Validate time range format if provided
    if (createPlanDto.availableTimeRange) {
      this.validateTimeRange(createPlanDto.availableTimeRange)
    }

    // Check for duplicate plan names
    const existingPlan = await this.consultationPlanModel.findOne({ 
      name: createPlanDto.name 
    })
    
    if (existingPlan) {
      throw new ConflictException("A consultation plan with this name already exists")
    }

    const plan = new this.consultationPlanModel(createPlanDto)
    return plan.save()
  }

  async getAllPlans(options: GetAllPlansOptions = {}): Promise<ConsultationPlan[]> {
    const { 
      includeInactive = false, 
      consultationType, 
      consultationCategory,
      minPrice,
      maxPrice
    } = options

    const query: any = {}

    if (!includeInactive) {
      query.isActive = true
    }

    if (consultationType) {
      query.consultationType = consultationType
    }

    if (consultationCategory) {
      query.consultationCategory = consultationCategory
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {}
      if (minPrice !== undefined) {
        query.price.$gte = minPrice
      }
      if (maxPrice !== undefined) {
        query.price.$lte = maxPrice
      }
    }

    return this.consultationPlanModel
      .find(query)
      .sort({ sortOrder: 1, createdAt: 1 })
      .exec()
  }

  async getPlanById(planId: string): Promise<ConsultationPlan> {
    const plan = await this.consultationPlanModel.findById(planId)
    if (!plan) {
      throw new NotFoundException("Consultation plan not found")
    }
    return plan
  }

  async getPlansByType(consultationType: ConsultationType): Promise<ConsultationPlan[]> {
    return this.consultationPlanModel
      .find({ consultationType, isActive: true })
      .sort({ sortOrder: 1, price: 1 })
      .exec()
  }

  async getPlansByCategory(consultationCategory: ConsultationCategory): Promise<ConsultationPlan[]> {
    return this.consultationPlanModel
      .find({ consultationCategory, isActive: true })
      .sort({ sortOrder: 1, price: 1 })
      .exec()
  }

  async getPlansForNewPatients(): Promise<ConsultationPlan[]> {
    return this.consultationPlanModel
      .find({ 
        isActive: true,
        $or: [
          { isNewPatientOnly: true },
          { isNewPatientOnly: false, isExistingPatientOnly: false }
        ]
      })
      .sort({ sortOrder: 1 })
      .exec()
  }

  async getPlansForExistingPatients(): Promise<ConsultationPlan[]> {
    return this.consultationPlanModel
      .find({ 
        isActive: true,
        $or: [
          { isExistingPatientOnly: true },
          { isNewPatientOnly: false, isExistingPatientOnly: false }
        ]
      })
      .sort({ sortOrder: 1 })
      .exec()
  }

  async updatePlan(planId: string, updatePlanDto: UpdateConsultationPlanDto): Promise<ConsultationPlan> {
    // Validate business rules
    if (updatePlanDto.isNewPatientOnly && updatePlanDto.isExistingPatientOnly) {
      throw new BadRequestException("Plan cannot be for both new and existing patients only")
    }

    // Validate time range format if provided
    if (updatePlanDto.availableTimeRange) {
      this.validateTimeRange(updatePlanDto.availableTimeRange)
    }

    // Check for duplicate names (excluding current plan)
    if (updatePlanDto.name) {
      const existingPlan = await this.consultationPlanModel.findOne({ 
        name: updatePlanDto.name,
        _id: { $ne: planId }
      })
      
      if (existingPlan) {
        throw new ConflictException("A consultation plan with this name already exists")
      }
    }

    const plan = await this.consultationPlanModel.findByIdAndUpdate(
      planId,
      updatePlanDto,
      { new: true, runValidators: true }
    )

    if (!plan) {
      throw new NotFoundException("Consultation plan not found")
    }

    return plan
  }

  async deletePlan(planId: string): Promise<void> {
    // You might want to check if there are any upcoming appointments with this plan
    // and prevent deletion or handle accordingly
    
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

  async reorderPlans(orderData: { planId: string; sortOrder: number }[]): Promise<void> {
    const bulkOps = orderData.map(item => ({
      updateOne: {
        filter: { _id: item.planId },
        update: { sortOrder: item.sortOrder }
      }
    }))

    await this.consultationPlanModel.bulkWrite(bulkOps)
  }

  // Check if a plan is available for a specific date/time
  async isPlanAvailableForDateTime(planId: string, date: Date, timeSlot: string): Promise<boolean> {
    const plan = await this.getPlanById(planId)

    if (!plan.isActive) {
      return false
    }

    const dayOfWeek = date.getDay()
    
    // Check if the day is available
    if (plan.availableDays && plan.availableDays.length > 0) {
      if (!plan.availableDays.includes(dayOfWeek)) {
        return false
      }
    }

    // Check time range if specified
    if (plan.availableTimeRange) {
      const [startTime, endTime] = plan.availableTimeRange.split("-")
      const slotTime = timeSlot.split("-")[0] // Get start time from slot
      
      if (slotTime < startTime || slotTime > endTime) {
        return false
      }
    }

    // Check advance booking restrictions
    const now = new Date()
    const hoursDifference = (date.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (plan.minAdvanceBookingHours && hoursDifference < plan.minAdvanceBookingHours) {
      return false
    }

    if (plan.maxAdvanceBookingHours && hoursDifference > plan.maxAdvanceBookingHours) {
      return false
    }

    return true
  }

  // Get available plans for a specific date
  async getAvailablePlansForDate(
    date: Date,
    consultationType?: ConsultationType,
    consultationCategory?: ConsultationCategory
  ): Promise<ConsultationPlan[]> {
    const dayOfWeek = date.getDay()
    
    const query: any = {
      isActive: true,
      $or: [
        { availableDays: dayOfWeek },
        { availableDays: { $size: 0 } } // Plans with no specific days set are available all days
      ]
    }

    if (consultationType) {
      query.consultationType = consultationType
    }

    if (consultationCategory) {
      query.consultationCategory = consultationCategory
    }

    const plans = await this.consultationPlanModel
      .find(query)
      .sort({ sortOrder: 1 })
      .exec()

    // Further filter based on advance booking restrictions
    const now = new Date()
    return plans.filter(plan => {
      const hoursDifference = (date.getTime() - now.getTime()) / (1000 * 60 * 60)

      if (plan.minAdvanceBookingHours && hoursDifference < plan.minAdvanceBookingHours) {
        return false
      }

      if (plan.maxAdvanceBookingHours && hoursDifference > plan.maxAdvanceBookingHours) {
        return false
      }

      return true
    })
  }

  // Validate time range format (HH:MM-HH:MM)
  private validateTimeRange(timeRange: string): void {
    const timeRangeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRangeRegex.test(timeRange)) {
      throw new BadRequestException("Invalid time range format. Use HH:MM-HH:MM format")
    }

    const [startTime, endTime] = timeRange.split("-")
    if (startTime >= endTime) {
      throw new BadRequestException("Start time must be before end time")
    }
  }

  // Check if patient is eligible for a plan
  async isPatientEligibleForPlan(planId: string, isNewPatient: boolean): Promise<boolean> {
    const plan = await this.getPlanById(planId)

    if (plan.isNewPatientOnly && !isNewPatient) {
      return false
    }

    if (plan.isExistingPatientOnly && isNewPatient) {
      return false
    }

    return true
  }
}