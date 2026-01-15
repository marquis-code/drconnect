// import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from "@nestjs/common"
// import { AppointmentsService } from "./appointments.service"
// import { CreateAppointmentDto } from "./dto/create-appointment.dto"
// import { RescheduleAppointmentDto } from "./dto/reschedule-appointment.dto"
// import { Request } from "express"
// import { JwtAuthGuard } from "src/auth/guards/jwt.guard"

// @Controller("appointments")
// @UseGuards(JwtAuthGuard)
// export class AppointmentsController {
//   constructor(private appointmentsService: AppointmentsService) {}

//   @Post()
//   async createAppointment(@Body() createAppointmentDto: CreateAppointmentDto, @Req() req: Request) {
//     return this.appointmentsService.createAppointment(req.user!.userId, createAppointmentDto)
//   }

//   @Get()
//   async getAppointments(@Req() req: Request) {
//     return this.appointmentsService.getAppointments(req.user!.userId, req.user!.role)
//   }

//   @Get(':id')
//   async getAppointmentById(@Param('id') id: string) {
//     return this.appointmentsService.getAppointmentById(id)
//   }

//   @Put(":id/cancel")
//   async cancelAppointment(@Param('id') id: string, @Body() body: { reason: string }, @Req() req: Request) {
//     return this.appointmentsService.cancelAppointment(id, body.reason)
//   }

//   @Put(":id/reschedule")
//   async rescheduleAppointment(@Param('id') id: string, @Body() rescheduleDto: RescheduleAppointmentDto, @Req() req: Request) {
//     return this.appointmentsService.rescheduleAppointment(id, rescheduleDto)
//   }

//   @Put(":id/complete")
//   async completeAppointment(@Param('id') id: string, @Req() req: Request) {
//     return this.appointmentsService.completeAppointment(id)
//   }
// }

// // src/appointments/appointments.controller.ts
// import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from "@nestjs/common"
// import { AppointmentsService } from "./appointments.service"
// import { CreateAppointmentDto } from "./dto/create-appointment.dto"
// import { RescheduleAppointmentDto } from "./dto/reschedule-appointment.dto"
// import { Request } from "express"
// import { JwtAuthGuard } from "src/auth/guards/jwt.guard"

// @Controller("appointments")
// @UseGuards(JwtAuthGuard)
// export class AppointmentsController {
//   constructor(private appointmentsService: AppointmentsService) {}

//   @Post()
//   async createAppointment(@Body() createAppointmentDto: CreateAppointmentDto, @Req() req: Request) {
//     return this.appointmentsService.createAppointment(req.user!.userId, createAppointmentDto)
//   }

//   @Get()
//   async getAppointments(@Req() req: Request) {
//     return this.appointmentsService.getAppointments(req.user!.userId, req.user!.role)
//   }

//   @Get(':id')
//   async getAppointmentById(@Param('id') id: string) {
//     return this.appointmentsService.getAppointmentById(id)
//   }

//   @Put(":id/cancel")
//   async cancelAppointment(@Param('id') id: string, @Body() body: { reason: string }) {
//     return this.appointmentsService.cancelAppointment(id, body.reason)
//   }

//   @Put(":id/reschedule")
//   async rescheduleAppointment(@Param('id') id: string, @Body() rescheduleDto: RescheduleAppointmentDto) {
//     return this.appointmentsService.rescheduleAppointment(id, rescheduleDto)
//   }

//   @Put(":id/complete")
//   async completeAppointment(@Param('id') id: string) {
//     return this.appointmentsService.completeAppointment(id)
//   }
// }


// src/appointments/appointments.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Patch,
  Body, 
  Param, 
  Query,
  UseGuards, 
  Req 
} from "@nestjs/common"
import { AppointmentsService } from "./appointments.service"
import { CreateAppointmentDto } from "./dto/create-appointment.dto"
import { UpdateAppointmentDto } from "./dto/update-appointment.dto"
import { RescheduleAppointmentDto } from "./dto/reschedule-appointment.dto"
import { CancelAppointmentDto } from "./dto/cancel-appointment.dto"
import { CompleteAppointmentDto } from "./dto/complete-appointment.dto"
import { RateAppointmentDto } from "./dto/rate-appointment.dto"
import { QueryAppointmentsDto } from "./dto/query-appointments.dto"
import { Request } from "express"
import { JwtAuthGuard } from "../auth/guards/jwt.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"

@Controller("appointments")
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  async createAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto, 
    @Req() req: Request
  ) {
    return this.appointmentsService.createAppointment(req.user!.userId, createAppointmentDto)
  }

  @Get()
  async getAppointments(
    @Query() queryDto: QueryAppointmentsDto,
    @Req() req: Request
  ) {
    return this.appointmentsService.getAppointments(req.user!.userId, req.user!.role, queryDto)
  }

  @Get("patient-status")
async getPatientStatus(@Req() req: Request) {
  return this.appointmentsService.getPatientStatus(req.user!.userId)
}

  @Get("upcoming")
  async getUpcomingAppointments(@Req() req: Request) {
    return this.appointmentsService.getUserUpcomingAppointments(req.user!.userId)
  }

  @Get("past")
  async getPastAppointments(@Req() req: Request) {
    return this.appointmentsService.getUserPastAppointments(req.user!.userId)
  }

  @Get("statistics")
  async getAppointmentStatistics(@Req() req: Request) {
    return this.appointmentsService.getAppointmentStatistics(req.user!.userId, req.user!.role)
  }

  @Get(':id')
  async getAppointmentById(@Param('id') id: string, @Req() req: Request) {
    return this.appointmentsService.getAppointmentById(id, req.user!.userId, req.user!.role)
  }

  @Patch(':id')
  async updateAppointment(
    @Param('id') id: string,
    @Body() updateDto: UpdateAppointmentDto,
    @Req() req: Request
  ) {
    return this.appointmentsService.updateAppointment(id, updateDto, req.user!.userId, req.user!.role)
  }

  @Put(":id/cancel")
  async cancelAppointment(
    @Param('id') id: string, 
    @Body() cancelDto: CancelAppointmentDto,
    @Req() req: Request
  ) {
    return this.appointmentsService.cancelAppointment(
      id, 
      cancelDto.cancellationReason,
      cancelDto.canceledBy || "patient",
      req.user!.userId,
      req.user!.role
    )
  }

  @Put(":id/reschedule")
  async rescheduleAppointment(
    @Param('id') id: string, 
    @Body() rescheduleDto: RescheduleAppointmentDto,
    @Req() req: Request
  ) {
    return this.appointmentsService.rescheduleAppointment(
      id, 
      rescheduleDto,
      req.user!.userId,
      req.user!.role
    )
  }

  @Put(":id/complete")
  @UseGuards(RolesGuard)
  @Roles("doctor", "admin")
  async completeAppointment(
    @Param('id') id: string,
    @Body() completeDto: CompleteAppointmentDto,
    @Req() req: Request
  ) {
    return this.appointmentsService.completeAppointment(id, completeDto, req.user!.userId)
  }

  @Put(":id/check-in")
  async checkInAppointment(@Param('id') id: string, @Req() req: Request) {
    return this.appointmentsService.checkInAppointment(id, req.user!.userId)
  }

  @Post(":id/rate")
  async rateAppointment(
    @Param('id') id: string,
    @Body() rateDto: RateAppointmentDto,
    @Req() req: Request
  ) {
    return this.appointmentsService.rateAppointment(
      id, 
      rateDto.rating, 
      rateDto.feedback,
      req.user!.userId,
      req.user!.role
    )
  }

  @Put(":id/confirm")
  @UseGuards(RolesGuard)
  @Roles("doctor", "admin")
  async confirmAppointment(@Param('id') id: string) {
    return this.appointmentsService.confirmAppointment(id)
  }

  @Put(":id/start")
  @UseGuards(RolesGuard)
  @Roles("doctor", "admin")
  async startAppointment(@Param('id') id: string, @Req() req: Request) {
    return this.appointmentsService.startAppointment(id, req.user!.userId)
  }

  @Get(":id/meet-link")
  async getMeetLink(@Param('id') id: string, @Req() req: Request) {
    return this.appointmentsService.getMeetLink(id, req.user!.userId, req.user!.role)
  }
}