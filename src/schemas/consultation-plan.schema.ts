// src/schemas/consultation-plan.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema({ timestamps: true })
export class ConsultationPlan extends Document {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ enum: ["physical", "virtual"], required: true })
  consultationType: string

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

  @Prop({ type: [String], enum: ["voice", "video"], default: ["video"] })
  consultationModes: string[]

  @Prop({ default: 0 })
  sortOrder: number // for display ordering

  createdAt?: Date
  updatedAt?: Date
}

export const ConsultationPlanSchema = SchemaFactory.createForClass(ConsultationPlan)