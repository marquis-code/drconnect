// // public.controller.ts or user.controller.ts
// import { Controller, Get, Query, UseGuards } from "@nestjs/common"
// import { AdminService } from "./admin.service"

// @Controller("public")
// export class PublicController {
//   constructor(private adminService: AdminService) {}

//   @Get("availability/by-date")
//   async getAvailabilityByDate(
//     @Query('date') date?: string,
//     @Query('time') time?: string,
//     @Query('consultationType') consultationType?: string
//   ) {
//     return this.adminService.getAvailabilityByDate(date, time, consultationType);
//   }

//   @Get("settings")
//   async getSettings() {
//     return this.adminService.getSettings()
//   }
// }

// src/admin/public.controller.ts
import { Controller, Get, Query, BadRequestException } from "@nestjs/common"
import { AdminService } from "./admin.service"
import { ConsultationCategory } from "src/schemas/availability.schema"

@Controller("public")
export class PublicController {
  constructor(private adminService: AdminService) {}

  @Get("availability/by-date")
  async getAvailabilityByDate(
    @Query("date") date?: string,
    @Query("time") time?: string,
    @Query("consultationCategory") consultationCategory?: string,
    @Query("doctorId") doctorId?: string
  ) {
    // Validate and convert consultationCategory if provided
    let validatedCategory: ConsultationCategory | undefined

    if (consultationCategory) {
      const upperCategory = consultationCategory.toUpperCase()
      
      if (!Object.values(ConsultationCategory).includes(consultationCategory as ConsultationCategory)) {
        throw new BadRequestException(
          `Invalid consultation category. Must be one of: ${Object.values(ConsultationCategory).join(", ")}`
        )
      }
      
      validatedCategory = consultationCategory as ConsultationCategory
    }

    return this.adminService.getAvailabilityByDate(
      date, 
      time, 
      validatedCategory,
      doctorId
    )
  }

  @Get("settings")
  async getSettings() {
    return this.adminService.getSettings()
  }
}