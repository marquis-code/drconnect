// src/appointments/dto/cancel-appointment.dto.ts
import { IsNotEmpty, IsString, IsEnum, IsOptional } from "class-validator"

export class CancelAppointmentDto {
  @IsNotEmpty()
  @IsString()
  cancellationReason: string

  @IsOptional()
  @IsEnum(["patient", "doctor", "system"])
  canceledBy?: string
}