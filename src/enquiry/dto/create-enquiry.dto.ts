import { 
  IsString, 
  IsEmail, 
  IsNotEmpty, 
  IsEnum, 
  IsOptional, 
  MinLength, 
  MaxLength,
  Matches,
  IsArray
} from 'class-validator';
import { Type } from 'class-transformer';
import { EnquiryStatus, EnquiryPriority } from '../../schemas/enquiry.schema';

export class CreateEnquiryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, {
    message: 'Phone number is not valid'
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  message: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}

export class UpdateEnquiryDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsEnum(EnquiryStatus)
  status?: EnquiryStatus;

  @IsOptional()
  @IsEnum(EnquiryPriority)
  priority?: EnquiryPriority;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}

export class QueryEnquiryDto {
  @IsOptional()
  @IsEnum(EnquiryStatus)
  status?: EnquiryStatus;

  @IsOptional()
  @IsEnum(EnquiryPriority)
  priority?: EnquiryPriority;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class EnquiryResponseDto {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  status: EnquiryStatus;
  priority: EnquiryPriority;
  assignedTo?: string;
  tags: string[];
  notes?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}