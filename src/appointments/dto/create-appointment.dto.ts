// import { IsNotEmpty, IsEnum, IsDateString, IsOptional } from "class-validator"

// export class CreateAppointmentDto {
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
// }

// Update src/appointments/dto/create-appointment.dto.ts
import { IsNotEmpty, IsEnum, IsDateString, IsOptional, IsMongoId } from "class-validator"

export class CreateAppointmentDto {
  @IsOptional()
  @IsMongoId()
  planId?: string // NEW: Optional plan ID

  @IsEnum(["physical", "virtual"])
  consultationType: string

  @IsEnum(["voice", "video"])
  @IsOptional()
  consultationMode: string

  @IsDateString()
  date: string

  @IsNotEmpty()
  timeSlot: string

  @IsOptional()
  location: string

  @IsNotEmpty()
  price: number

  @IsOptional()
  duration?: number // NEW: Duration in minutes
}