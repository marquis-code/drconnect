
// // src/schemas/consultation-plan.schema.ts
// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
// import { Document } from "mongoose"

// export enum ConsultationType {
//   // Primary Consultation Types
//   FIRST_CONTACT = "first_contact", // Initial consultation for new patients
//   FOLLOW_UP = "follow_up", // Follow-up after initial consultation
//   MEDICAL_REVIEW = "medical_review", // Review for patients on active treatment
  
//   // Specialized Consultation Types
//   EMERGENCY = "emergency", // Urgent medical consultation (prioritized, answered immediately or within the hour)
//   ROUTINE_CHECKUP = "routine_checkup", // Regular health checkup (similar to follow-up)
//   PRESCRIPTION_REFILL = "prescription_refill", // Medication refill consultation
//   LAB_RESULT_REVIEW = "lab_result_review", // Review of laboratory results (similar to medical review)
//   SECOND_OPINION = "second_opinion", // Second opinion consultation (similar to first contact)
  
//   // Specialized Medical Services
//   MENTAL_HEALTH = "mental_health", // Psychiatric/psychological consultation (includes psychotherapy, CBT, depression/anxiety treatment, family/group therapy)
//   PEDIATRIC = "pediatric", // Children's health consultation (includes prescription)
//   GERIATRIC = "geriatric", // Elderly care consultation (includes prescription)
//   NUTRITION_COUNSELING = "nutrition_counseling", // Dietary consultation
  
//   // Wellness & Counseling
//   WELLNESS_CONSULTATION = "wellness_consultation", // Preventive health advice
//   SPIRITUALITY_COUNSELING = "spirituality_counseling", // Counseling on spirituality in medicine (including spiritual healing and prayers)
//   PREMARITAL_COUNSELING = "premarital_counseling", // Premarital medical counseling
//   MARRIAGE_RELATIONSHIP_COUNSELING = "marriage_relationship_counseling", // Marriage/relationship counseling (including sex therapy/counseling)
  
//   // Administrative/Other
//   SICK_NOTE = "sick_note", // Medical certificate consultation (only for treated patients)
//   REFERRAL = "referral", // Specialist referral consultation
  
//   // Onsite Services
//   ONSITE_THERAPY = "onsite_therapy", // Physical therapy session (all forms of health and marital/relationship counseling)
// }

// export enum ConsultationMode {
//   VIDEO = "video",
//   VOICE = "voice",
//   CHAT = "chat",
//   IN_PERSON = "in_person"
// }

// export enum ConsultationCategory {
//   PHYSICAL = "physical", // In-person consultation
//   VIRTUAL = "virtual", // Remote consultation (video/voice/chat)
//   HYBRID = "hybrid" // Can be either physical or virtual
// }

// // Sub-types for Mental Health consultations
// export enum MentalHealthSubType {
//   GENERAL = "general", // General mental health consultation
//   PSYCHOTHERAPY = "psychotherapy", // Psychotherapy session
//   CBT = "cbt", // Cognitive Behavioral Therapy
//   DEPRESSION_TREATMENT = "depression_treatment", // Depression treatment (plus prescription)
//   ANXIETY_TREATMENT = "anxiety_treatment", // Anxiety treatment (plus prescription)
//   FAMILY_GROUP_THERAPY = "family_group_therapy", // Family or group therapy
// }

// @Schema({ timestamps: true })
// export class ConsultationPlan extends Document {
//   @Prop({ required: true, unique: true, trim: true })
//   name: string

//   @Prop({ required: true })
//   description: string

//   @Prop({ 
//     enum: Object.values(ConsultationType), 
//     required: true,
//     index: true
//   })
//   consultationType: ConsultationType

//   @Prop({ 
//     enum: Object.values(ConsultationCategory), 
//     required: true,
//     default: ConsultationCategory.VIRTUAL
//   })
//   consultationCategory: ConsultationCategory

//   @Prop({ required: true, min: 1 })
//   duration: number // in minutes

//   @Prop({ required: true, min: 0 })
//   price: number

//   @Prop({ type: [Number], default: [] }) // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
//   availableDays: number[]

//   @Prop({ type: String, default: null })
//   availableTimeRange: string | null // e.g., "09:00-17:00"

//   @Prop({ default: true, index: true })
//   isActive: boolean

//   @Prop({ 
//     type: [String], 
//     enum: Object.values(ConsultationMode), 
//     default: [ConsultationMode.VIDEO] 
//   })
//   consultationModes: ConsultationMode[]

//   @Prop({ default: 0, index: true })
//   sortOrder: number // for display ordering

//   // Additional metadata
//   @Prop({ type: [String], default: [] })
//   tags: string[] // e.g., ["urgent", "specialist", "routine"]

//   @Prop({ default: false })
//   requiresPreApproval: boolean // Some consultations may need approval

//   @Prop({ type: String, default: null })
//   preparationInstructions: string | null // What patient should prepare

//   @Prop({ default: 1, min: 0 })
//   minAdvanceBookingHours: number // Minimum hours before appointment

//   @Prop({ default: 720, min: 1 }) // 30 days default
//   maxAdvanceBookingHours: number // Maximum hours in advance

//   @Prop({ default: false })
//   isNewPatientOnly: boolean // Only for new patients

//   @Prop({ default: false })
//   isExistingPatientOnly: boolean // Only for existing patients

//   @Prop({ type: String, default: null })
//   specialtyRequired: string | null // e.g., "Mental Health", "Pediatrics", "Nutrition"

//   // Mental Health specific fields
//   @Prop({ 
//     type: String, 
//     enum: Object.values(MentalHealthSubType),
//     default: null 
//   })
//   mentalHealthSubType: MentalHealthSubType | null // Sub-type for mental health consultations

//   // Prescription inclusion flag
//   @Prop({ default: false })
//   includesPrescription: boolean // Whether consultation includes prescription (e.g., Pediatric, Geriatric, Mental Health treatment)

//   // Priority flag
//   @Prop({ default: false })
//   isPriority: boolean // For emergency consultations that are prioritized

//   // Counseling/Therapy specific
//   @Prop({ default: false })
//   isCouplesTherapy: boolean // For premarital and marriage/relationship counseling

//   @Prop({ default: false })
//   isGroupTherapy: boolean // For family or group therapy sessions

//   // Notes for special conditions
//   @Prop({ type: String, default: null })
//   specialConditions: string | null // E.g., "Only for patients treated by Doctors Dey" for sick notes

//   createdAt?: Date
//   updatedAt?: Date
// }

// export const ConsultationPlanSchema = SchemaFactory.createForClass(ConsultationPlan)

// // Add indexes for better query performance
// ConsultationPlanSchema.index({ consultationType: 1, isActive: 1 })
// ConsultationPlanSchema.index({ sortOrder: 1 })
// ConsultationPlanSchema.index({ price: 1 })
// ConsultationPlanSchema.index({ name: 1 }, { unique: true })

// // Compound indexes for common queries
// ConsultationPlanSchema.index({ 
//   consultationType: 1, 
//   consultationCategory: 1, 
//   isActive: 1 
// })

// // Index for availability queries
// ConsultationPlanSchema.index({ 
//   availableDays: 1, 
//   isActive: 1 
// })

// // Index for priority consultations (emergency)
// ConsultationPlanSchema.index({ isPriority: 1, isActive: 1 })

// // Index for mental health sub-types
// ConsultationPlanSchema.index({ 
//   consultationType: 1, 
//   mentalHealthSubType: 1,
//   isActive: 1 
// })

// // Index for prescription-inclusive consultations
// ConsultationPlanSchema.index({ includesPrescription: 1, isActive: 1 })

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
    enum: Object.values(ConsultationType), 
    required: true,
    index: true
  })
  consultationType: ConsultationType

  @Prop({ 
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
ConsultationPlanSchema.index({ sortOrder: 1 })
ConsultationPlanSchema.index({ price: 1 })
ConsultationPlanSchema.index({ name: 1 }, { unique: true })

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