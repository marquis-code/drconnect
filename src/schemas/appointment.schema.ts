
// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
// import { Document, Types } from "mongoose"

// @Schema({ timestamps: true })
// export class Appointment extends Document {
//   @Prop({ type: Types.ObjectId, ref: "User", required: true })
//   userId: Types.ObjectId

//   @Prop({ enum: ["physical", "virtual"], required: true })
//   consultationType: string

//   @Prop({ enum: ["voice", "video"], default: "video" })
//   consultationMode: string

//   @Prop({ required: true })
//   date: Date

//   @Prop({ required: true })
//   timeSlot: string

//   @Prop()
//   location: string

//   @Prop({ required: true })
//   price: number

//   @Prop({ enum: ["pending", "successful", "failed"], default: "pending" })
//   paymentStatus: string

//   @Prop() // ✅ ADD THIS
//   transactionReference: string

//   @Prop({ enum: ["booked", "completed", "canceled"], default: "booked" })
//   status: string

//   @Prop()
//   cancellationReason: string

//   @Prop()
//   googleMeetLink: string

//   @Prop({ type: Types.ObjectId, ref: "ConsultationPlan", required: false })
//  planId: Types.ObjectId
// }

// export const AppointmentSchema = SchemaFactory.createForClass(Appointment)

// src/schemas/appointment.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

export enum AppointmentStatus {
  BOOKED = "booked",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELED = "canceled",
  NO_SHOW = "no_show",
  RESCHEDULED = "rescheduled"
}

export enum PaymentStatus {
  PENDING = "pending",
  SUCCESSFUL = "successful",
  FAILED = "failed",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded"
}

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

export enum ConsultationMode {
  VIDEO = "video",
  VOICE = "voice",
  CHAT = "chat",
  IN_PERSON = "in_person"
}

export enum ConsultationCategory {
  PHYSICAL = "physical",
  VIRTUAL = "virtual",
  HYBRID = "hybrid"
}

@Schema({ timestamps: true })
export class Appointment extends Document {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "User", required: false })
  doctorId: Types.ObjectId // Healthcare provider assigned

  @Prop({ type: Types.ObjectId, ref: "ConsultationPlan", required: true })
  planId: Types.ObjectId

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

  @Prop({ 
    enum: Object.values(ConsultationMode), 
    default: ConsultationMode.VIDEO 
  })
  consultationMode: ConsultationMode

  @Prop({ required: true })
  date: Date

  @Prop({ required: true })
  timeSlot: string // e.g., "09:00-09:30"

  @Prop({ required: true })
  duration: number // in minutes

  @Prop()
  location: string // Physical address for in-person consultations

  @Prop({ required: true })
  price: number

  @Prop({ 
    enum: Object.values(PaymentStatus), 
    default: PaymentStatus.PENDING 
  })
  paymentStatus: PaymentStatus

  @Prop()
  transactionReference: string

  @Prop()
  paymentMethod: string // e.g., "card", "bank_transfer", "wallet"

  @Prop({ 
    enum: Object.values(AppointmentStatus), 
    default: AppointmentStatus.BOOKED 
  })
  status: AppointmentStatus

  @Prop()
  cancellationReason: string

  @Prop()
  canceledBy: string // "patient" or "doctor" or "system"

  @Prop()
  canceledAt: Date

  @Prop()
  googleMeetLink: string

  @Prop()
  meetingRoomId: string // For custom video platforms

  @Prop()
  meetingPassword: string

  // Patient information
  @Prop()
  patientNotes: string // Patient's reason for visit

  @Prop()
  chiefComplaint: string // Main health concern

  @Prop({ type: [String], default: [] })
  symptoms: string[]

  // Doctor's notes
  @Prop()
  doctorNotes: string

  @Prop()
  diagnosis: string

  @Prop()
  prescription: string

  @Prop({ type: [String], default: [] })
  attachments: string[] // URLs to uploaded files (lab results, images, etc.)

  // Follow-up information
  @Prop()
  followUpRequired: boolean

  @Prop()
  followUpDate: Date

  @Prop({ type: Types.ObjectId, ref: "Appointment" })
  previousAppointmentId: Types.ObjectId // Link to previous appointment for follow-ups

  @Prop({ type: Types.ObjectId, ref: "Appointment" })
  nextAppointmentId: Types.ObjectId // Link to scheduled follow-up

  // Timing tracking
  @Prop()
  scheduledStartTime: Date

  @Prop()
  actualStartTime: Date

  @Prop()
  actualEndTime: Date

  @Prop()
  checkedInAt: Date

  // Reminders
  @Prop({ default: false })
  reminderSent: boolean

  @Prop()
  reminderSentAt: Date

  // Rating and feedback
  @Prop({ min: 1, max: 5 })
  patientRating: number

  @Prop()
  patientFeedback: string

  @Prop()
  doctorRating: number

  @Prop()
  doctorFeedback: string

  // Metadata
  @Prop({ type: Object })
  metadata: Record<string, any> // For additional custom fields

  createdAt?: Date
  updatedAt?: Date
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment)

// Indexes for better query performance
AppointmentSchema.index({ userId: 1, date: -1 })
AppointmentSchema.index({ doctorId: 1, date: -1 })
AppointmentSchema.index({ status: 1, date: 1 })
AppointmentSchema.index({ consultationType: 1, date: -1 })
AppointmentSchema.index({ transactionReference: 1 })
AppointmentSchema.index({ date: 1, timeSlot: 1 })