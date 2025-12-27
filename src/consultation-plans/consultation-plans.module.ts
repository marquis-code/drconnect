// src/consultation-plans/consultation-plans.module.ts
import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ConsultationPlansService } from "./consultation-plans.service"
import { ConsultationPlansController } from "./consultation-plans.controller"
import { ConsultationPlan, ConsultationPlanSchema } from "src/schemas/consultation-plan.schema"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConsultationPlan.name, schema: ConsultationPlanSchema }
    ]),
  ],
  providers: [ConsultationPlansService],
  controllers: [ConsultationPlansController],
  exports: [ConsultationPlansService],
})
export class ConsultationPlansModule {}