// public.controller.ts or user.controller.ts
import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import { AdminService } from "./admin.service"

@Controller("public")
export class PublicController {
  constructor(private adminService: AdminService) {}

  @Get("availability/by-date")
  async getAvailabilityByDate(
    @Query('date') date?: string,
    @Query('time') time?: string,
    @Query('consultationType') consultationType?: string
  ) {
    return this.adminService.getAvailabilityByDate(date, time, consultationType);
  }

  @Get("settings")
  async getSettings() {
    return this.adminService.getSettings()
  }
}