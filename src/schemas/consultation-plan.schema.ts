// src/schemas/consultation-plan.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"
import { 
  ConsultationType, 
  ConsultationMode, 
  ConsultationCategory,
  MentalHealthSubType 
} from "./shared-enums"

@Schema({ timestamps: true })
export class ConsultationPlan extends Document {
  @Prop({ required: true, unique: true, trim: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ 
    type: String,
    enum: Object.values(ConsultationType), 
    required: true,
    index: true
  })
  consultationType: ConsultationType

  @Prop({ 
    type: String,
    enum: Object.values(ConsultationCategory), 
    required: true,
    default: ConsultationCategory.VIRTUAL
  })
  consultationCategory: ConsultationCategory

  @Prop({ required: true, min: 1 })
  duration: number // in minutes

  @Prop({ required: true, min: 0 })
  price: number

  @Prop({ type: [Number], default: [] }) // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  availableDays: number[]

  @Prop({ type: String, default: null })
  availableTimeRange: string | null // e.g., "09:00-17:00"

  @Prop({ default: true, index: true })
  isActive: boolean

  @Prop({ 
    type: [String], 
    enum: Object.values(ConsultationMode), 
    default: [ConsultationMode.VIDEO] 
  })
  consultationModes: ConsultationMode[]

  @Prop({ default: 0, index: true })
  sortOrder: number // for display ordering

  // Additional metadata
  @Prop({ type: [String], default: [] })
  tags: string[] // e.g., ["urgent", "specialist", "routine"]

  @Prop({ default: false })
  requiresPreApproval: boolean // Some consultations may need approval

  @Prop({ type: String, default: null })
  preparationInstructions: string | null // What patient should prepare

  @Prop({ default: 1, min: 0 })
  minAdvanceBookingHours: number // Minimum hours before appointment

  @Prop({ default: 720, min: 1 }) // 30 days default
  maxAdvanceBookingHours: number // Maximum hours in advance

  @Prop({ default: false })
  isNewPatientOnly: boolean // Only for new patients

  @Prop({ default: false })
  isExistingPatientOnly: boolean // Only for existing patients

  @Prop({ type: String, default: null })
  specialtyRequired: string | null // e.g., "Mental Health", "Pediatrics", "Nutrition"

  // Mental Health specific fields
  @Prop({ 
    type: String, 
    enum: Object.values(MentalHealthSubType),
    default: null 
  })
  mentalHealthSubType: MentalHealthSubType | null // Sub-type for mental health consultations

  // Prescription inclusion flag
  @Prop({ default: false })
  includesPrescription: boolean // Whether consultation includes prescription (e.g., Pediatric, Geriatric, Mental Health treatment)

  // Priority flag
  @Prop({ default: false })
  isPriority: boolean // For emergency consultations that are prioritized

  // Counseling/Therapy specific
  @Prop({ default: false })
  isCouplesTherapy: boolean // For premarital and marriage/relationship counseling

  @Prop({ default: false })
  isGroupTherapy: boolean // For family or group therapy sessions

  // Notes for special conditions
  @Prop({ type: String, default: null })
  specialConditions: string | null // E.g., "Only for patients treated by Doctors Dey" for sick notes

  createdAt?: Date
  updatedAt?: Date
}

export const ConsultationPlanSchema = SchemaFactory.createForClass(ConsultationPlan)

// Add indexes for better query performance
ConsultationPlanSchema.index({ consultationType: 1, isActive: 1 })
ConsultationPlanSchema.index({ price: 1 })

// Compound indexes for common queries
ConsultationPlanSchema.index({ 
  consultationType: 1, 
  consultationCategory: 1, 
  isActive: 1 
})

// Index for availability queries
ConsultationPlanSchema.index({ 
  availableDays: 1, 
  isActive: 1 
})

// Index for priority consultations (emergency)
ConsultationPlanSchema.index({ isPriority: 1, isActive: 1 })

// Index for mental health sub-types
ConsultationPlanSchema.index({ 
  consultationType: 1, 
  mentalHealthSubType: 1,
  isActive: 1 
})

// Index for prescription-inclusive consultations
ConsultationPlanSchema.index({ includesPrescription: 1, isActive: 1 })