import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

@Schema({ timestamps: true })
export class Appointment extends Document {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId

  @Prop({ enum: ["physical", "virtual"], required: true })
  consultationType: string

  @Prop({ enum: ["voice", "video"], default: "video" })
  consultationMode: string

  @Prop({ required: true })
  date: Date

  @Prop({ required: true })
  timeSlot: string

  @Prop({ default: null })
  location: string

  @Prop({ default: null })
  googleMeetLink: string

  @Prop({ required: true })
  price: number

  @Prop({ enum: ["pending", "successful", "failed"], default: "pending" })
  paymentStatus: string

  @Prop({ enum: ["booked", "completed", "canceled"], default: "booked" })
  status: string

  @Prop({ default: null })
  transactionId: string

  @Prop({ default: null })
  cancellationReason: string

  @Prop({ default: null })
  notes: string

  createdAt?: Date
  updatedAt?: Date
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment)
