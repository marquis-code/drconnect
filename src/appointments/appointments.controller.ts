import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from "@nestjs/common"
import { AppointmentsService } from "./appointments.service"
import { CreateAppointmentDto } from "./dto/create-appointment.dto"
import { RescheduleAppointmentDto } from "./dto/reschedule-appointment.dto"
import { Request } from "express"
import { JwtAuthGuard } from "src/auth/guards/jwt.guard"

@Controller("appointments")
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  async createAppointment(@Body() createAppointmentDto: CreateAppointmentDto, @Req() req: Request) {
    return this.appointmentsService.createAppointment(req.user!.userId, createAppointmentDto)
  }

  @Get()
  async getAppointments(@Req() req: Request) {
    return this.appointmentsService.getAppointments(req.user!.userId, req.user!.role)
  }

  @Get(':id')
  async getAppointmentById(@Param('id') id: string) {
    return this.appointmentsService.getAppointmentById(id)
  }

  @Put(":id/cancel")
  async cancelAppointment(@Param('id') id: string, @Body() body: { reason: string }, @Req() req: Request) {
    return this.appointmentsService.cancelAppointment(id, body.reason)
  }

  @Put(":id/reschedule")
  async rescheduleAppointment(@Param('id') id: string, @Body() rescheduleDto: RescheduleAppointmentDto, @Req() req: Request) {
    return this.appointmentsService.rescheduleAppointment(id, rescheduleDto)
  }

  @Put(":id/complete")
  async completeAppointment(@Param('id') id: string, @Req() req: Request) {
    return this.appointmentsService.completeAppointment(id)
  }
}