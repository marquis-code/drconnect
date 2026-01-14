// src/auth/dto/update-profile.dto.ts
import { IsOptional, IsString, IsEmail, IsEnum, IsArray, IsUrl } from "class-validator"
import { UserRole } from "./register.dto"

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsUrl()
  profilePicture?: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsString()
  dateOfBirth?: string

  @IsOptional()
  @IsEnum(["male", "female", "other"])
  gender?: string

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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[]

  @IsOptional()
  @IsString()
  consultationFee?: string
}