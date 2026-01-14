// // src/consultation-plans/dto/create-consultation-plan.dto.ts
// import { IsNotEmpty, IsEnum, IsNumber, IsArray, IsOptional, IsBoolean, IsString, Min } from "class-validator"

// export class CreateConsultationPlanDto {
//   @IsNotEmpty()
//   @IsString()
//   name: string

//   @IsNotEmpty()
//   @IsString()
//   description: string

//   @IsEnum(["physical", "virtual"])
//   consultationType: string

//   @IsNumber()
//   @Min(1)
//   duration: number // in minutes

//   @IsNumber()
//   @Min(0)
//   price: number

//   @IsArray()
//   @IsNumber({}, { each: true })
//   availableDays: number[] // e.g., [4, 6] for Thursday and Saturday

//   @IsOptional()
//   @IsString()
//   availableTimeRange?: string // e.g., "09:00-17:00"

//   @IsOptional()
//   @IsBoolean()
//   isActive?: boolean

//   @IsArray()
//   @IsEnum(["voice", "video"], { each: true })
//   @IsOptional()
//   consultationModes?: string[]

//   @IsOptional()
//   @IsNumber()
//   sortOrder?: number
// }


// src/consultation-plans/dto/create-consultation-plan.dto.ts
import { 
  IsNotEmpty, 
  IsEnum, 
  IsNumber, 
  IsArray, 
  IsOptional, 
  IsBoolean, 
  IsString, 
  Min,
  Max
} from "class-validator"
import { 
  ConsultationType, 
  ConsultationMode, 
  ConsultationCategory 
} from "../../schemas/consultation-plan.schema"

export class CreateConsultationPlanDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsEnum(ConsultationType)
  consultationType: ConsultationType

  @IsEnum(ConsultationCategory)
  consultationCategory: ConsultationCategory

  @IsNumber()
  @Min(1)
  duration: number // in minutes

  @IsNumber()
  @Min(0)
  price: number

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  availableDays?: number[] // e.g., [1, 2, 3, 4, 5] for Monday-Friday

  @IsOptional()
  @IsString()
  availableTimeRange?: string // e.g., "09:00-17:00"

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsArray()
  @IsEnum(ConsultationMode, { each: true })
  consultationModes: ConsultationMode[]

  @IsOptional()
  @IsNumber()
  sortOrder?: number

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @IsOptional()
  @IsBoolean()
  requiresPreApproval?: boolean

  @IsOptional()
  @IsString()
  preparationInstructions?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  minAdvanceBookingHours?: number

  @IsOptional()
  @IsNumber()
  @Min(1)
  maxAdvanceBookingHours?: number

  @IsOptional()
  @IsBoolean()
  isNewPatientOnly?: boolean

  @IsOptional()
  @IsBoolean()
  isExistingPatientOnly?: boolean

  @IsOptional()
  @IsString()
  specialtyRequired?: string
}