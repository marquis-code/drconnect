
// src/schemas/consultation-plan.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export enum ConsultationType {
  // Primary Consultation Types
  FIRST_CONTACT = "first_contact", // Initial consultation for new patients
  FOLLOW_UP = "follow_up", // Follow-up after initial consultation
  MEDICAL_REVIEW = "medical_review", // Review for patients on active treatment
  
  // Specialized Consultation Types
  EMERGENCY = "emergency", // Urgent medical consultation
  ROUTINE_CHECKUP = "routine_checkup", // Regular health checkup
  PRESCRIPTION_REFILL = "prescription_refill", // Medication refill consultation
  LAB_RESULT_REVIEW = "lab_result_review", // Review of laboratory results
  SECOND_OPINION = "second_opinion", // Second opinion consultation
  
  // Specialized Medical Services
  MENTAL_HEALTH = "mental_health", // Psychiatric/psychological consultation
  CHRONIC_DISEASE_MANAGEMENT = "chronic_disease_management", // Diabetes, hypertension, etc.
  PRENATAL_POSTNATAL = "prenatal_postnatal", // Maternity care
  PEDIATRIC = "pediatric", // Children's health
  GERIATRIC = "geriatric", // Elderly care
  NUTRITION_COUNSELING = "nutrition_counseling", // Dietary consultation
  
  // Procedural Consultations
  PRE_OPERATIVE = "pre_operative", // Before surgery consultation
  POST_OPERATIVE = "post_operative", // After surgery follow-up
  PROCEDURE_CONSULTATION = "procedure_consultation", // Discussing medical procedures
  
  // Administrative/Other
  HEALTH_SCREENING = "health_screening", // General health screening
  WELLNESS_CONSULTATION = "wellness_consultation", // Preventive health advice
  VACCINATION = "vaccination", // Immunization consultation
  SICK_NOTE = "sick_note", // Medical certificate consultation
  REFERRAL = "referral", // Specialist referral consultation
}

export enum ConsultationMode {
  VIDEO = "video",
  VOICE = "voice",
  CHAT = "chat",
  IN_PERSON = "in_person"
}

export enum ConsultationCategory {
  PHYSICAL = "physical", // In-person consultation
  VIRTUAL = "virtual", // Remote consultation (video/voice/chat)
  HYBRID = "hybrid" // Can be either physical or virtual
}

@Schema({ timestamps: true })
export class ConsultationPlan extends Document {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ 
    enum: Object.values(ConsultationType), 
    required: true 
  })
  consultationType: ConsultationType

  @Prop({ 
    enum: Object.values(ConsultationCategory), 
    required: true,
    default: ConsultationCategory.VIRTUAL
  })
  consultationCategory: ConsultationCategory

  @Prop({ required: true })
  duration: number // in minutes

  @Prop({ required: true })
  price: number

  @Prop({ type: [Number], default: [] }) // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  availableDays: number[]

  @Prop({ type: String, default: null })
  availableTimeRange: string | null // e.g., "09:00-17:00"

  @Prop({ default: true })
  isActive: boolean

  @Prop({ 
    type: [String], 
    enum: Object.values(ConsultationMode), 
    default: [ConsultationMode.VIDEO] 
  })
  consultationModes: ConsultationMode[]

  @Prop({ default: 0 })
  sortOrder: number // for display ordering

  // Additional metadata
  @Prop({ type: [String], default: [] })
  tags: string[] // e.g., ["urgent", "specialist", "routine"]

  @Prop({ default: false })
  requiresPreApproval: boolean // Some consultations may need approval

  @Prop({ type: String, default: null })
  preparationInstructions: string | null // What patient should prepare

  @Prop({ default: 1 })
  minAdvanceBookingHours: number // Minimum hours before appointment

  @Prop({ default: 720 }) // 30 days default
  maxAdvanceBookingHours: number // Maximum hours in advance

  @Prop({ default: false })
  isNewPatientOnly: boolean // Only for new patients

  @Prop({ default: false })
  isExistingPatientOnly: boolean // Only for existing patients

  @Prop({ type: String, default: null })
  specialtyRequired: string | null // e.g., "Cardiology", "Pediatrics"

  createdAt?: Date
  updatedAt?: Date
}

export const ConsultationPlanSchema = SchemaFactory.createForClass(ConsultationPlan)

// Add indexes for better query performance
ConsultationPlanSchema.index({ consultationType: 1, isActive: 1 })
ConsultationPlanSchema.index({ sortOrder: 1 })
ConsultationPlanSchema.index({ price: 1 })