import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Schema as MongooseSchema } from "mongoose"

@Schema({ timestamps: true })
export class Settings extends Document {
  @Prop({ required: true })
  physicalConsultationFee: number

  @Prop({ required: true })
  virtualConsultationFee: number

  @Prop({ required: true })
  clinicLocation: string

  @Prop({ required: true })
  clinicLatitude: number

  @Prop({ required: true })
  clinicLongitude: number

  @Prop({ required: true })
  contactEmail: string

  @Prop({ required: true })
  contactPhone: string

  @Prop({ type: MongooseSchema.Types.Mixed, default: null })
  businessHours: Record<string, any> | null

  @Prop({ type: MongooseSchema.Types.Mixed, default: null })
  bankDetails: Record<string, any> | null

  createdAt?: Date
  updatedAt?: Date
}

export const SettingsSchema = SchemaFactory.createForClass(Settings)