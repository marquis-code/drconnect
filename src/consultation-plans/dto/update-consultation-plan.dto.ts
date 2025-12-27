// src/consultation-plans/dto/update-consultation-plan.dto.ts
import { PartialType } from "@nestjs/mapped-types"
import { CreateConsultationPlanDto } from "./create-consultation-plan.dto"

export class UpdateConsultationPlanDto extends PartialType(CreateConsultationPlanDto) {}