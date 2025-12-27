
import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { type Model, Types } from "mongoose"
import { Appointment } from "src/schemas/appointment.schema"
import { ConsultationPlansService } from "../consultation-plans/consultation-plans.service"
import { CreateAppointmentDto } from "./dto/create-appointment.dto"
import { RescheduleAppointmentDto } from "./dto/reschedule-appointment.dto"
import { GoogleMeetService } from "src/integrations/google-meet.service"

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    private googleMeetService: GoogleMeetService,
    private consultationPlansService: ConsultationPlansService,
  ) {}

  async createAppointment(userId: string, createAppointmentDto: CreateAppointmentDto) {
  const { planId, consultationType, consultationMode, date, timeSlot, location, price, duration } = createAppointmentDto

  // Validate plan if provided
  if (planId) {
    const plan = await this.consultationPlansService.getPlanById(planId)
    
    // Check if plan is available for the selected date/time
    const isAvailable = await this.consultationPlansService.isPlanAvailableForDateTime(
      planId,
      new Date(date),
      timeSlot
    )

    if (!isAvailable) {
      throw new BadRequestException(
        "This consultation plan is not available for the selected date and time"
      )
    }

    // Validate consultation type matches plan
    if (plan.consultationType !== consultationType) {
      throw new BadRequestException(
        `Consultation type must be ${plan.consultationType} for this plan`
      )
    }

    // Validate consultation mode if specified
    if (consultationMode && !plan.consultationModes.includes(consultationMode)) {
      throw new BadRequestException(
        `Consultation mode ${consultationMode} is not available for this plan`
      )
    }
  }

  // Check if slot is already booked
  const isSlotAvailable = await this.checkSlotAvailability(
    date,
    timeSlot,
    consultationType
  )

  if (!isSlotAvailable) {
    throw new BadRequestException(
      `This time slot is no longer available for ${consultationType} consultation. Please choose another time.`
    )
  }

  const appointment = new this.appointmentModel({
    userId: new Types.ObjectId(userId),
    planId: planId ? new Types.ObjectId(planId) : undefined,
    consultationType,
    consultationMode: consultationMode || "video",
    date: new Date(date),
    timeSlot,
    location,
    price,
    duration: duration || 30, // Default 30 minutes if not specified
    paymentStatus: "pending",
    status: "booked",
  })

  await appointment.save()

  return appointment
}

  // async createAppointment(userId: string, createAppointmentDto: CreateAppointmentDto) {
  //   const { consultationType, consultationMode, date, timeSlot, location, price } = createAppointmentDto

  //   // ✅ CHECK IF SLOT IS ALREADY BOOKED
  //   const isSlotAvailable = await this.checkSlotAvailability(
  //     date,
  //     timeSlot,
  //     consultationType
  //   );

  //   if (!isSlotAvailable) {
  //     throw new BadRequestException(
  //       `This time slot is no longer available for ${consultationType} consultation. Please choose another time.`
  //     );
  //   }

  //   const appointment = new this.appointmentModel({
  //     userId: new Types.ObjectId(userId),
  //     consultationType,
  //     consultationMode: consultationMode || "video",
  //     date: new Date(date),
  //     timeSlot,
  //     location,
  //     price,
  //     paymentStatus: "pending",
  //     status: "booked",
  //   })

  //   await appointment.save()

  //   return appointment
  // }

  // ✅ Check if slot is available
  async checkSlotAvailability(
    date: string,
    timeSlot: string,
    consultationType: string
  ): Promise<boolean> {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Check for existing appointments at this time slot
    const existingAppointment = await this.appointmentModel.findOne({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      timeSlot,
      consultationType,
      status: { $nin: ["canceled", "completed"] }, // Exclude canceled/completed
    });

    return !existingAppointment; // Available if no existing appointment found
  }

  // ✅ Generate Google Meet link after payment
  async generateMeetLinkAfterPayment(appointmentId: string): Promise<string> {
    const appointment = await this.appointmentModel.findById(appointmentId);

    if (!appointment) {
      throw new NotFoundException("Appointment not found");
    }

    if (appointment.paymentStatus !== "successful") {
      throw new BadRequestException("Payment must be successful before generating Meet link");
    }

    if (appointment.consultationType !== "virtual") {
      throw new BadRequestException("Google Meet link is only for virtual consultations");
    }

    // Generate Google Meet link
    try {
      const dateString = appointment.date.toISOString().split('T')[0];
      const meetLink = await this.googleMeetService.generateMeetLink(
        dateString,
        appointment.timeSlot
      );

      // Update appointment with Meet link
      appointment.googleMeetLink = meetLink;
      await appointment.save();

      return meetLink;
    } catch (error) {
      console.error("Failed to generate Google Meet link:", error);
      throw new BadRequestException("Failed to generate Google Meet link");
    }
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

    // Update status to canceled
    appointment.status = "canceled"
    appointment.cancellationReason = cancellationReason
    await appointment.save()

    // ✅ Slot is now automatically available again because we check for status != "canceled"

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

    // ✅ CHECK IF NEW SLOT IS AVAILABLE
    const isNewSlotAvailable = await this.checkSlotAvailability(
      newDate,
      newTimeSlot,
      appointment.consultationType
    );

    if (!isNewSlotAvailable) {
      throw new BadRequestException(
        "The new time slot is not available. Please choose another time."
      );
    }

    // Update appointment
    appointment.date = new Date(newDate)
    appointment.timeSlot = newTimeSlot
    
    // If it's a virtual consultation with existing Meet link, regenerate it
    if (appointment.consultationType === "virtual" && appointment.googleMeetLink) {
      try {
        const meetLink = await this.googleMeetService.generateMeetLink(newDate, newTimeSlot);
        appointment.googleMeetLink = meetLink;
      } catch (error) {
        console.error("Failed to regenerate Google Meet link:", error);
        // Don't throw - just log the error
      }
    }

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