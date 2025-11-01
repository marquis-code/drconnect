import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength, IsOptional } from "class-validator"

export class RegisterDto {
  @IsOptional()
  role?: string   // optional field

  @IsNotEmpty()
  name: string

  @IsEmail()
  email: string

  @IsPhoneNumber()
  phone: string

  @MinLength(6)
  password: string
}
