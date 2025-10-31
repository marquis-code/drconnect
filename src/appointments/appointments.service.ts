import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { type Model, Types } from "mongoose"
import { Appointment } from "src/schemas/appointment.schema"
import { CreateAppointmentDto } from "./dto/create-appointment.dto"
import { RescheduleAppointmentDto } from "./dto/reschedule-appointment.dto"
import { NotificationService } from "src/notifications/notification.service"
import { GoogleMeetService } from "src/integrations/google-meet.service"

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    private notificationService: NotificationService,
    private googleMeetService: GoogleMeetService,
  ) {}

  async createAppointment(userId: string, createAppointmentDto: CreateAppointmentDto) {
    const { consultationType, consultationMode, date, timeSlot, location, price } = createAppointmentDto

    const appointment = new this.appointmentModel({
      userId: new Types.ObjectId(userId),
      consultationType,
      consultationMode: consultationMode || "video",
      date: new Date(date),
      timeSlot,
      location,
      price,
      paymentStatus: "pending",
      status: "booked",
    })

    // Generate Google Meet link for virtual consultations
    if (appointment.consultationType === "virtual") {
      try {
        const meetLink = await this.googleMeetService.generateMeetLink(date, timeSlot);
        appointment.googleMeetLink = meetLink
      } catch (error) {
        console.error("Failed to generate Google Meet link:", error)
      }
    }

    await appointment.save()

    return appointment
  }

  async getAppointments(userId: string, role: string) {
    const query: any = {}

    if (role === "user") {
      query.userId = new Types.ObjectId(userId)
    }

    const appointments = await this.appointmentModel.find(query).populate("userId", "name email phone")
    return appointments
  }

  async getAppointmentById(appointmentId: string) {
    const appointment = await this.appointmentModel.findById(appointmentId).populate("userId", "name email phone")

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }

    return appointment
  }

  async cancelAppointment(appointmentId: string, cancellationReason: string) {
    const appointment = await this.appointmentModel.findById(appointmentId)

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }

    if (appointment.status === "canceled") {
      throw new BadRequestException("Appointment is already canceled")
    }

    appointment.status = "canceled"
    appointment.cancellationReason = cancellationReason
    await appointment.save()

    return appointment
  }

  async rescheduleAppointment(appointmentId: string, rescheduleDto: RescheduleAppointmentDto) {
    const { newDate, newTimeSlot } = rescheduleDto

    const appointment = await this.appointmentModel.findById(appointmentId)

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }

    if (appointment.status === "canceled") {
      throw new BadRequestException("Cannot reschedule a canceled appointment")
    }

    appointment.date = new Date(newDate)
    appointment.timeSlot = newTimeSlot
    await appointment.save()

    return appointment
  }

  async completeAppointment(appointmentId: string) {
    const appointment = await this.appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status: "completed" },
      { new: true },
    )

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }

    return appointment
  }

  async getUpcomingAppointments() {
    const now = new Date()
    return this.appointmentModel.find({
      date: { $gte: now },
      status: "booked",
    })
  }
}