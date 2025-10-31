import { IsDateString, IsNotEmpty } from "class-validator"

export class RescheduleAppointmentDto {
  @IsDateString()
  newDate: string

  @IsNotEmpty()
  newTimeSlot: string
}
