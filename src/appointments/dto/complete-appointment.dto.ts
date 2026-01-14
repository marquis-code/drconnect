// src/appointments/dto/complete-appointment.dto.ts
import { 
  IsOptional, 
  IsString, 
  IsBoolean, 
  IsDateString,
  IsArray
} from "class-validator"

export class CompleteAppointmentDto {
  @IsString()
  doctorNotes: string

  @IsOptional()
  @IsString()
  diagnosis?: string

  @IsOptional()
  @IsString()
  prescription?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[]

  @IsOptional()
  @IsBoolean()
  followUpRequired?: boolean

  @IsOptional()
  @IsDateString()
  followUpDate?: string
}