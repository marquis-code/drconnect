// src/consultation-plans/dto/create-consultation-plan.dto.ts
import { IsNotEmpty, IsEnum, IsNumber, IsArray, IsOptional, IsBoolean, IsString, Min } from "class-validator"

export class CreateConsultationPlanDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsEnum(["physical", "virtual"])
  consultationType: string

  @IsNumber()
  @Min(1)
  duration: number // in minutes

  @IsNumber()
  @Min(0)
  price: number

  @IsArray()
  @IsNumber({}, { each: true })
  availableDays: number[] // e.g., [4, 6] for Thursday and Saturday

  @IsOptional()
  @IsString()
  availableTimeRange?: string // e.g., "09:00-17:00"

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsArray()
  @IsEnum(["voice", "video"], { each: true })
  @IsOptional()
  consultationModes?: string[]

  @IsOptional()
  @IsNumber()
  sortOrder?: number
}