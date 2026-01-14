// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
// import { Document } from "mongoose"

// @Schema({ timestamps: true })
// export class Availability extends Document {
//   @Prop({ enum: [0, 1, 2, 3, 4, 5, 6], required: true })
//   dayOfWeek: number

//   @Prop({ type: [{ startTime: String, endTime: String }], required: true })
//   timeSlots: Array<{ startTime: string; endTime: string }>

//   @Prop({ enum: ["physical", "virtual"], required: true })
//   consultationType: string

//   @Prop({ default: true })
//   isAvailable: boolean

//   createdAt?: Date
//   updatedAt?: Date
// }

// export const AvailabilitySchema = SchemaFactory.createForClass(Availability)


// src/schemas/availability.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

export enum ConsultationType {
  FIRST_CONTACT = "first_contact",
  FOLLOW_UP = "follow_up",
  MEDICAL_REVIEW = "medical_review",
  EMERGENCY = "emergency",
  ROUTINE_CHECKUP = "routine_checkup",
  PRESCRIPTION_REFILL = "prescription_refill",
  LAB_RESULT_REVIEW = "lab_result_review",
  SECOND_OPINION = "second_opinion",
  MENTAL_HEALTH = "mental_health",
  CHRONIC_DISEASE_MANAGEMENT = "chronic_disease_management",
  PRENATAL_POSTNATAL = "prenatal_postnatal",
  PEDIATRIC = "pediatric",
  GERIATRIC = "geriatric",
  NUTRITION_COUNSELING = "nutrition_counseling",
  PRE_OPERATIVE = "pre_operative",
  POST_OPERATIVE = "post_operative",
  PROCEDURE_CONSULTATION = "procedure_consultation",
  HEALTH_SCREENING = "health_screening",
  WELLNESS_CONSULTATION = "wellness_consultation",
  VACCINATION = "vaccination",
  SICK_NOTE = "sick_note",
  REFERRAL = "referral"
}

export enum ConsultationCategory {
  PHYSICAL = "physical",
  VIRTUAL = "virtual",
  HYBRID = "hybrid"
}

export enum ConsultationMode {
  VIDEO = "video",
  VOICE = "voice",
  CHAT = "chat",
  IN_PERSON = "in_person"
}

@Schema({ timestamps: true })
export class Availability extends Document {
  @Prop({ type: Types.ObjectId, ref: "User", required: false })
  doctorId: Types.ObjectId // Specific doctor's availability (optional for system-wide)

  @Prop({ enum: [0, 1, 2, 3, 4, 5, 6], required: true })
  dayOfWeek: number // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  @Prop({ type: [{ startTime: String, endTime: String }], required: true })
  timeSlots: Array<{ startTime: string; endTime: string }> // e.g., [{ startTime: "09:00", endTime: "12:00" }]

  @Prop({ 
    enum: Object.values(ConsultationCategory), 
    required: true 
  })
  consultationCategory: ConsultationCategory

  @Prop({ 
    type: [String],
    enum: Object.values(ConsultationType),
    default: []
  })
  allowedConsultationTypes: ConsultationType[] // Specific types allowed during this slot

  @Prop({ 
    type: [String],
    enum: Object.values(ConsultationMode),
    default: [ConsultationMode.VIDEO, ConsultationMode.VOICE]
  })
  allowedConsultationModes: ConsultationMode[]

  @Prop({ default: true })
  isAvailable: boolean

  @Prop()
  location: string // Physical location for in-person consultations

  @Prop({ default: 1 })
  maxConcurrentAppointments: number // How many appointments can be booked in same slot

  @Prop({ default: 30 })
  slotDuration: number // Duration of each bookable slot in minutes

  @Prop({ default: 0 })
  bufferTime: number // Buffer time between appointments in minutes

  // Override dates (for holidays, special availability, etc.)
  @Prop()
  overrideDate: Date // Specific date this availability applies to (overrides dayOfWeek)

  @Prop()
  overrideReason: string // e.g., "Public Holiday", "Special Clinic Hours"

  @Prop({ default: false })
  isRecurring: boolean // true for regular weekly schedule, false for one-time override

  // Effective date range
  @Prop()
  effectiveFrom: Date

  @Prop()
  effectiveTo: Date

  @Prop({ type: Object })
  metadata: Record<string, any> // Additional custom data

  createdAt?: Date
  updatedAt?: Date
}

export const AvailabilitySchema = SchemaFactory.createForClass(Availability)

// Indexes for optimal querying
AvailabilitySchema.index({ doctorId: 1, dayOfWeek: 1, isAvailable: 1 })
AvailabilitySchema.index({ consultationCategory: 1, isAvailable: 1 })
AvailabilitySchema.index({ overrideDate: 1 })
AvailabilitySchema.index({ effectiveFrom: 1, effectiveTo: 1 })
AvailabilitySchema.index({ dayOfWeek: 1, isRecurring: 1 })