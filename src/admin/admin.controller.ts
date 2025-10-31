import { Controller, Get, Post, Body, UseGuards, Query } from "@nestjs/common"
import { AdminService } from "./admin.service"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"
import { AdminGuard } from "src/auth/guards/admin.guard"

@Controller("admin")
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get("dashboard")
  async getDashboardStats() {
    return this.adminService.getDashboardStats()
  }

  @Get("users")
  async getAllUsers() {
    return this.adminService.getAllUsers()
  }

  @Get('appointments')
  async getAllAppointments(@Query('status') status?: string) {
    if (status) {
      return this.adminService.getAppointmentsByStatus(status);
    }
    return this.adminService.getAllAppointments();
  }

  @Get("transactions")
  async getAllTransactions() {
    return this.adminService.getAllTransactions()
  }

  @Post('availability')
  async setAvailability(@Body() availabilityData: any) {
    return this.adminService.setAvailability(availabilityData);
  }

  @Get("availability")
  async getAvailability() {
    return this.adminService.getAvailability()
  }

  @Get("availability/by-date")
  async getAvailabilityByDate(
    @Query('date') date?: string,
    @Query('time') time?: string,
    @Query('consultationType') consultationType?: string
  ) {
    return this.adminService.getAvailabilityByDate(date, time, consultationType);
  }

  @Post('settings')
  async updateSettings(@Body() settingsData: any) {
    return this.adminService.updateSettings(settingsData);
  }

  @Get("settings")
  async getSettings() {
    return this.adminService.getSettings()
  }

  @Get("export/transactions")
  async exportTransactions() {
    return this.adminService.exportTransactions()
  }

  @Get("export/appointments")
  async exportAppointments() {
    return this.adminService.exportAppointments()
  }
}