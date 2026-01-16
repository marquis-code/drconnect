// src/appointments/dto/update-appointment.dto.ts
import { PartialType } from "@nestjs/mapped-types"
import { CreateAppointmentDto } from "./create-appointment.dto"
import { 
  IsEnum, 
  IsOptional, 
  IsString, 
  IsNumber, 
  IsBoolean,
  IsDateString,
  Min,
  Max
} from "class-validator"
// import { AppointmentStatus, PaymentStatus } from "../../schemas/appointment.schema"
import { 
  ConsultationType, 
  ConsultationMode, 
  ConsultationCategory,
  AppointmentStatus,
  PaymentStatus 
} from "src/schemas/shared-enums"

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus

  @IsOptional()
  @IsString()
  transactionReference?: string

  @IsOptional()
  @IsString()
  paymentMethod?: string

  @IsOptional()
  @IsString()
  googleMeetLink?: string

  @IsOptional()
  @IsString()
  meetingRoomId?: string

  @IsOptional()
  @IsString()
  doctorNotes?: string

  @IsOptional()
  @IsString()
  diagnosis?: string

  @IsOptional()
  @IsString()
  prescription?: string

  @IsOptional()
  @IsBoolean()
  followUpRequired?: boolean

  @IsOptional()
  @IsDateString()
  followUpDate?: string
}