// src/availability/dto/create-availability.dto.ts
import { 
  IsNotEmpty, 
  IsEnum, 
  IsNumber, 
  IsArray, 
  IsOptional, 
  IsBoolean,
  IsString,
  IsMongoId,
  IsDateString,
  ValidateNested,
  Min,
  Max
} from "class-validator"
import { Type } from "class-transformer"
import { 
  ConsultationType, 
  ConsultationMode, 
  ConsultationCategory 
} from "../../schemas/availability.schema"

class TimeSlotDto {
  @IsString()
  startTime: string

  @IsString()
  endTime: string
}

export class CreateAvailabilityDto {
  @IsOptional()
  @IsMongoId()
  doctorId?: string

  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek: number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  timeSlots: TimeSlotDto[]

  @IsEnum(ConsultationCategory)
  consultationCategory: ConsultationCategory

  @IsOptional()
  @IsArray()
  @IsEnum(ConsultationType, { each: true })
  allowedConsultationTypes?: ConsultationType[]

  @IsOptional()
  @IsArray()
  @IsEnum(ConsultationMode, { each: true })
  allowedConsultationModes?: ConsultationMode[]

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean

  @IsOptional()
  @IsString()
  location?: string

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxConcurrentAppointments?: number

  @IsOptional()
  @IsNumber()
  @Min(5)
  slotDuration?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  bufferTime?: number

  @IsOptional()
  @IsDateString()
  overrideDate?: string

  @IsOptional()
  @IsString()
  overrideReason?: string

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean

  @IsOptional()
  @IsDateString()
  effectiveFrom?: string

  @IsOptional()
  @IsDateString()
  effectiveTo?: string
}