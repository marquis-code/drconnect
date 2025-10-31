import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types, Schema as MongooseSchema } from "mongoose"

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: "Appointment", required: true })
  appointmentId: Types.ObjectId

  @Prop({ required: true })
  amount: number

  @Prop({ enum: ["Paystack", "Mono"], required: true })
  paymentMethod: string

  @Prop({ required: true })
  transactionRef: string

  @Prop({ enum: ["pending", "successful", "failed"], default: "pending" })
  paymentStatus: string

  @Prop({ type: String, default: null })
  paystackReference: string | null

  @Prop({ type: String, default: null })
  monoReference: string | null

  @Prop({ type: MongooseSchema.Types.Mixed, default: null })
  metadata: Record<string, any> | null

  createdAt?: Date
  updatedAt?: Date
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction)