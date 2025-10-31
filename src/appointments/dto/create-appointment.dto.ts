import { IsNotEmpty, IsEnum, IsDateString, IsOptional } from "class-validator"

export class CreateAppointmentDto {
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
}
