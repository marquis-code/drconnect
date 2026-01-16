// src/appointments/dto/query-appointments.dto.ts
import { 
  IsOptional, 
  IsEnum, 
  IsDateString, 
  IsMongoId,
  IsString
} from "class-validator"
// import { 
//   AppointmentStatus, 
//   ConsultationType,
//   PaymentStatus 
// } from "../../schemas/appointment.schema"
import { 
  ConsultationType, 
  AppointmentStatus,
  PaymentStatus 
} from "src/schemas/shared-enums"

export class QueryAppointmentsDto {
  @IsOptional()
  @IsMongoId()
  userId?: string

  @IsOptional()
  @IsMongoId()
  doctorId?: string

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus

  @IsOptional()
  @IsEnum(ConsultationType)
  consultationType?: ConsultationType

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus

  @IsOptional()
  @IsDateString()
  dateFrom?: string

  @IsOptional()
  @IsDateString()
  dateTo?: string

  @IsOptional()
  @IsString()
  searchTerm?: string // Search in patient notes, chief complaint, etc.
}