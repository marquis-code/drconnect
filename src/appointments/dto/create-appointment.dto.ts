
// import { IsNotEmpty, IsEnum, IsDateString, IsOptional, IsMongoId } from "class-validator"

// export class CreateAppointmentDto {
//   @IsOptional()
//   @IsMongoId()
//   planId?: string // NEW: Optional plan ID

//   @IsEnum(["physical", "virtual"])
//   consultationType: string

//   @IsEnum(["voice", "video"])
//   @IsOptional()
//   consultationMode: string

//   @IsDateString()
//   date: string

//   @IsNotEmpty()
//   timeSlot: string

//   @IsOptional()
//   location: string

//   @IsNotEmpty()
//   price: number

//   @IsOptional()
//   duration?: number // NEW: Duration in minutes
// }

// src/appointments/dto/create-appointment.dto.ts
import { 
  IsNotEmpty, 
  IsEnum, 
  IsDateString, 
  IsOptional, 
  IsMongoId,
  IsString,
  IsNumber,
  IsArray,
  Min
} from "class-validator"
import { 
  ConsultationType, 
  ConsultationMode, 
  ConsultationCategory 
} from "../../schemas/appointment.schema"

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsMongoId()
  planId: string

  @IsOptional()
  @IsMongoId()
  doctorId?: string

  @IsEnum(ConsultationType)
  consultationType: ConsultationType

  @IsEnum(ConsultationCategory)
  consultationCategory: ConsultationCategory

  @IsEnum(ConsultationMode)
  consultationMode: ConsultationMode

  @IsDateString()
  date: string

  @IsNotEmpty()
  @IsString()
  timeSlot: string

  @IsNumber()
  @Min(1)
  duration: number // in minutes

  @IsOptional()
  @IsString()
  location?: string

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number

  @IsOptional()
  @IsString()
  patientNotes?: string

  @IsOptional()
  @IsString()
  chiefComplaint?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  symptoms?: string[]

  @IsOptional()
  @IsMongoId()
  previousAppointmentId?: string // For follow-up appointments
}