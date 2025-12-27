
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

  @Prop()
  location: string

  @Prop({ required: true })
  price: number

  @Prop({ enum: ["pending", "successful", "failed"], default: "pending" })
  paymentStatus: string

  @Prop() // ✅ ADD THIS
  transactionReference: string

  @Prop({ enum: ["booked", "completed", "canceled"], default: "booked" })
  status: string

  @Prop()
  cancellationReason: string

  @Prop()
  googleMeetLink: string

  @Prop({ type: Types.ObjectId, ref: "ConsultationPlan", required: false })
 planId: Types.ObjectId
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment)