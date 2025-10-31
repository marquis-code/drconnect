import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema({ timestamps: true })
export class Availability extends Document {
  @Prop({ enum: [0, 1, 2, 3, 4, 5, 6], required: true })
  dayOfWeek: number

  @Prop({ type: [{ startTime: String, endTime: String }], required: true })
  timeSlots: Array<{ startTime: string; endTime: string }>

  @Prop({ enum: ["physical", "virtual"], required: true })
  consultationType: string

  @Prop({ default: true })
  isAvailable: boolean

  createdAt?: Date
  updatedAt?: Date
}

export const AvailabilitySchema = SchemaFactory.createForClass(Availability)
