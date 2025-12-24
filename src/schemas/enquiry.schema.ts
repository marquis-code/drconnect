import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum EnquiryStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum EnquiryPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Schema({ timestamps: true })
export class Enquiry extends Document {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true })
  message: string;

  @Prop({ 
    type: String, 
    enum: EnquiryStatus, 
    default: EnquiryStatus.NEW 
  })
  status: EnquiryStatus;

  @Prop({ 
    type: String, 
    enum: EnquiryPriority, 
    default: EnquiryPriority.MEDIUM 
  })
  priority: EnquiryPriority;

  @Prop({ type: String })
  assignedTo?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: String })
  notes?: string;

  @Prop({ type: Date })
  resolvedAt?: Date;

  @Prop({ type: String })
  ipAddress?: string;

  @Prop({ type: String })
  userAgent?: string;
}

export const EnquirySchema = SchemaFactory.createForClass(Enquiry);