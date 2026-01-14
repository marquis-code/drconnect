// src/auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsEnum } from "class-validator"

export enum UserRole {
  USER = "user",
  PATIENT = "patient",
  DOCTOR = "doctor",
  ADMIN = "admin"
}

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsNotEmpty()
  @MinLength(6)
  password: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole

  // Doctor-specific fields
  @IsOptional()
  @IsString()
  specialization?: string

  @IsOptional()
  @IsString()
  licenseNumber?: string

  @IsOptional()
  @IsString()
  qualification?: string

  @IsOptional()
  @IsString()
  bio?: string
}