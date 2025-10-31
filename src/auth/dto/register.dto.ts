import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength } from "class-validator"

export class RegisterDto {
  @IsNotEmpty()
  name: string

  @IsEmail()
  email: string

  @IsPhoneNumber()
  phone: string

  @MinLength(6)
  password: string
}
