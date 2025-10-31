import { IsNotEmpty, IsEnum, IsNumber, IsEmail, IsOptional } from "class-validator"

export class InitiatePaymentDto {
  @IsNotEmpty()
  appointmentId: string

  @IsNumber()
  amount: number

  @IsEnum(["Paystack", "Mono"])
  paymentMethod: string

  @IsEmail()
  email: string

  @IsNotEmpty()
  phone: string

  @IsNotEmpty()
  address: string

  @IsNotEmpty()
  customerName: string

  @IsOptional()
  bvn?: string

  @IsOptional()
  redirectUrl?: string

  @IsOptional()
  description?: string
}
