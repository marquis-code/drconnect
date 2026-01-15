
// import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common"
// import { InjectModel } from "@nestjs/mongoose"
// import { type Model, Types } from "mongoose"
// import { Appointment } from "src/schemas/appointment.schema"
// import { ConsultationPlansService } from "../consultation-plans/consultation-plans.service"
// import { CreateAppointmentDto } from "./dto/create-appointment.dto"
// import { RescheduleAppointmentDto } from "./dto/reschedule-appointment.dto"
// import { GoogleMeetService } from "src/integrations/google-meet.service"

// @Injectable()
// export class AppointmentsService {
//   constructor(
//     @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
//     private googleMeetService: GoogleMeetService,
//     private consultationPlansService: ConsultationPlansService,
//   ) {}

//   async createAppointment(userId: string, createAppointmentDto: CreateAppointmentDto) {
//   const { planId, consultationType, consultationMode, date, timeSlot, location, price, duration } = createAppointmentDto

//   // Validate plan if provided
//   if (planId) {
//     const plan = await this.consultationPlansService.getPlanById(planId)
    
//     // Check if plan is available for the selected date/time
//     const isAvailable = await this.consultationPlansService.isPlanAvailableForDateTime(
//       planId,
//       new Date(date),
//       timeSlot
//     )

//     if (!isAvailable) {
//       throw new BadRequestException(
//         "This consultation plan is not available for the selected date and time"
//       )
//     }

//     // Validate consultation type matches plan
//     if (plan.consultationType !== consultationType) {
//       throw new BadRequestException(
//         `Consultation type must be ${plan.consultationType} for this plan`
//       )
//     }

//     // Validate consultation mode if specified
//     if (consultationMode && !plan.consultationModes.includes(consultationMode)) {
//       throw new BadRequestException(
//         `Consultation mode ${consultationMode} is not available for this plan`
//       )
//     }
//   }

//   // Check if slot is already booked
//   const isSlotAvailable = await this.checkSlotAvailability(
//     date,
//     timeSlot,
//     consultationType
//   )

//   if (!isSlotAvailable) {
//     throw new BadRequestException(
//       `This time slot is no longer available for ${consultationType} consultation. Please choose another time.`
//     )
//   }

//   const appointment = new this.appointmentModel({
//     userId: new Types.ObjectId(userId),
//     planId: planId ? new Types.ObjectId(planId) : undefined,
//     consultationType,
//     consultationMode: consultationMode || "video",
//     date: new Date(date),
//     timeSlot,
//     location,
//     price,
//     duration: duration || 30, // Default 30 minutes if not specified
//     paymentStatus: "pending",
//     status: "booked",
//   })

//   await appointment.save()

//   return appointment
// }

//   // async createAppointment(userId: string, createAppointmentDto: CreateAppointmentDto) {
//   //   const { consultationType, consultationMode, date, timeSlot, location, price } = createAppointmentDto

//   //   // ✅ CHECK IF SLOT IS ALREADY BOOKED
//   //   const isSlotAvailable = await this.checkSlotAvailability(
//   //     date,
//   //     timeSlot,
//   //     consultationType
//   //   );

//   //   if (!isSlotAvailable) {
//   //     throw new BadRequestException(
//   //       `This time slot is no longer available for ${consultationType} consultation. Please choose another time.`
//   //     );
//   //   }

//   //   const appointment = new this.appointmentModel({
//   //     userId: new Types.ObjectId(userId),
//   //     consultationType,
//   //     consultationMode: consultationMode || "video",
//   //     date: new Date(date),
//   //     timeSlot,
//   //     location,
//   //     price,
//   //     paymentStatus: "pending",
//   //     status: "booked",
//   //   })

//   //   await appointment.save()

//   //   return appointment
//   // }

//   // ✅ Check if slot is available
//   async checkSlotAvailability(
//     date: string,
//     timeSlot: string,
//     consultationType: string
//   ): Promise<boolean> {
//     const targetDate = new Date(date);
//     const startOfDay = new Date(targetDate);
//     startOfDay.setHours(0, 0, 0, 0);
    
//     const endOfDay = new Date(targetDate);
//     endOfDay.setHours(23, 59, 59, 999);

//     // Check for existing appointments at this time slot
//     const existingAppointment = await this.appointmentModel.findOne({
//       date: {
//         $gte: startOfDay,
//         $lte: endOfDay,
//       },
//       timeSlot,
//       consultationType,
//       status: { $nin: ["canceled", "completed"] }, // Exclude canceled/completed
//     });

//     return !existingAppointment; // Available if no existing appointment found
//   }

//   // ✅ Generate Google Meet link after payment
//   async generateMeetLinkAfterPayment(appointmentId: string): Promise<string> {
//     const appointment = await this.appointmentModel.findById(appointmentId);

//     if (!appointment) {
//       throw new NotFoundException("Appointment not found");
//     }

//     if (appointment.paymentStatus !== "successful") {
//       throw new BadRequestException("Payment must be successful before generating Meet link");
//     }

//     if (appointment.consultationType !== "virtual") {
//       throw new BadRequestException("Google Meet link is only for virtual consultations");
//     }

//     // Generate Google Meet link
//     try {
//       const dateString = appointment.date.toISOString().split('T')[0];
//       const meetLink = await this.googleMeetService.generateMeetLink(
//         dateString,
//         appointment.timeSlot
//       );

//       // Update appointment with Meet link
//       appointment.googleMeetLink = meetLink;
//       await appointment.save();

//       return meetLink;
//     } catch (error) {
//       console.error("Failed to generate Google Meet link:", error);
//       throw new BadRequestException("Failed to generate Google Meet link");
//     }
//   }

//   async getAppointments(userId: string, role: string) {
//     const query: any = {}

//     if (role === "user") {
//       query.userId = new Types.ObjectId(userId)
//     }

//     const appointments = await this.appointmentModel.find(query).populate("userId", "name email phone")
//     return appointments
//   }

//   async getAppointmentById(appointmentId: string) {
//     const appointment = await this.appointmentModel.findById(appointmentId).populate("userId", "name email phone")

//     if (!appointment) {
//       throw new NotFoundException("Appointment not found")
//     }

//     return appointment
//   }

//   async cancelAppointment(appointmentId: string, cancellationReason: string) {
//     const appointment = await this.appointmentModel.findById(appointmentId)

//     if (!appointment) {
//       throw new NotFoundException("Appointment not found")
//     }

//     if (appointment.status === "canceled") {
//       throw new BadRequestException("Appointment is already canceled")
//     }

//     // Update status to canceled
//     appointment.status = "canceled"
//     appointment.cancellationReason = cancellationReason
//     await appointment.save()

//     // ✅ Slot is now automatically available again because we check for status != "canceled"

//     return appointment
//   }

//   async rescheduleAppointment(appointmentId: string, rescheduleDto: RescheduleAppointmentDto) {
//     const { newDate, newTimeSlot } = rescheduleDto

//     const appointment = await this.appointmentModel.findById(appointmentId)

//     if (!appointment) {
//       throw new NotFoundException("Appointment not found")
//     }

//     if (appointment.status === "canceled") {
//       throw new BadRequestException("Cannot reschedule a canceled appointment")
//     }

//     // ✅ CHECK IF NEW SLOT IS AVAILABLE
//     const isNewSlotAvailable = await this.checkSlotAvailability(
//       newDate,
//       newTimeSlot,
//       appointment.consultationType
//     );

//     if (!isNewSlotAvailable) {
//       throw new BadRequestException(
//         "The new time slot is not available. Please choose another time."
//       );
//     }

//     // Update appointment
//     appointment.date = new Date(newDate)
//     appointment.timeSlot = newTimeSlot
    
//     // If it's a virtual consultation with existing Meet link, regenerate it
//     if (appointment.consultationType === "virtual" && appointment.googleMeetLink) {
//       try {
//         const meetLink = await this.googleMeetService.generateMeetLink(newDate, newTimeSlot);
//         appointment.googleMeetLink = meetLink;
//       } catch (error) {
//         console.error("Failed to regenerate Google Meet link:", error);
//         // Don't throw - just log the error
//       }
//     }

//     await appointment.save()

//     return appointment
//   }

//   async completeAppointment(appointmentId: string) {
//     const appointment = await this.appointmentModel.findByIdAndUpdate(
//       appointmentId,
//       { status: "completed" },
//       { new: true },
//     )

//     if (!appointment) {
//       throw new NotFoundException("Appointment not found")
//     }

//     return appointment
//   }

//   async getUpcomingAppointments() {
//     const now = new Date()
//     return this.appointmentModel.find({
//       date: { $gte: now },
//       status: "booked",
//     })
//   }
// }


// src/appointments/appointments.service.ts
import { 
  Injectable, 
  BadRequestException, 
  NotFoundException,
  ForbiddenException 
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { type Model, Types } from "mongoose"
import { Appointment, AppointmentStatus, PaymentStatus } from "src/schemas/appointment.schema"
import { ConsultationPlansService } from "../consultation-plans/consultation-plans.service"
import { CreateAppointmentDto } from "./dto/create-appointment.dto"
import { UpdateAppointmentDto } from "./dto/update-appointment.dto"
import { RescheduleAppointmentDto } from "./dto/reschedule-appointment.dto"
import { CompleteAppointmentDto } from "./dto/complete-appointment.dto"
import { QueryAppointmentsDto } from "./dto/query-appointments.dto"
import { GoogleMeetService } from "src/integrations/google-meet.service"

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    private googleMeetService: GoogleMeetService,
    private consultationPlansService: ConsultationPlansService,
  ) {}

  async createAppointment(userId: string, createAppointmentDto: CreateAppointmentDto) {
  const { 
    planId, 
    doctorId,
    consultationType, 
    consultationCategory,
    consultationMode, 
    date, 
    timeSlot, 
    location, 
    price, 
    duration,
    patientNotes,
    chiefComplaint,
    symptoms,
    previousAppointmentId
  } = createAppointmentDto

  // Validate plan
  const plan = await this.consultationPlansService.getPlanById(planId)
  
  // Parse date string to UTC date without timezone conversion
  const appointmentDate = new Date(date + 'T00:00:00Z')
  
  // Calculate the actual scheduled start time
  const scheduledStartTime = this.calculateScheduledStartTime(date, timeSlot)
  
  console.log('Creating appointment:', {
    userId,
    planId,
    date,
    timeSlot,
    appointmentDate: appointmentDate.toISOString(),
    scheduledStartTime: scheduledStartTime.toISOString()
  })
  
  // Check if plan is available for the selected date/time
  const isAvailable = await this.consultationPlansService.isPlanAvailableForDateTime(
    planId,
    appointmentDate,
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

  // Validate consultation category matches plan
  if (plan.consultationCategory !== consultationCategory) {
    throw new BadRequestException(
      `Consultation category must be ${plan.consultationCategory} for this plan`
    )
  }

  // Validate consultation mode
  if (!plan.consultationModes.includes(consultationMode)) {
    throw new BadRequestException(
      `Consultation mode ${consultationMode} is not available for this plan`
    )
  }

  // Check patient eligibility
  if (plan.isNewPatientOnly) {
    const existingAppointments = await this.appointmentModel.countDocuments({
      userId: new Types.ObjectId(userId),
      status: { $in: [AppointmentStatus.COMPLETED] }
    })
    
    if (existingAppointments > 0) {
      throw new BadRequestException("This plan is only available for new patients")
    }
  }

  if (plan.isExistingPatientOnly) {
  const existingAppointments = await this.appointmentModel.countDocuments({
    userId: new Types.ObjectId(userId),
    status: { $in: [AppointmentStatus.COMPLETED] }
  })
  
  if (existingAppointments === 0) {
    throw new BadRequestException({
      message: "This plan is only available for existing patients",
      hint: "Complete your first appointment to access this plan",
      planName: plan.name
    })
  }
}

  // if (plan.isExistingPatientOnly) {
  //   const existingAppointments = await this.appointmentModel.countDocuments({
  //     userId: new Types.ObjectId(userId),
  //     status: { $in: [AppointmentStatus.COMPLETED] }
  //   })
    
  //   if (existingAppointments === 0) {
  //     throw new BadRequestException("This plan is only available for existing patients")
  //   }
  // }

  // Additional advance booking validation (redundant check for safety)
  const now = new Date()
  const hoursDifference = (scheduledStartTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  console.log('Advance booking check:', {
    hoursDifference,
    minRequired: plan.minAdvanceBookingHours,
    maxAllowed: plan.maxAdvanceBookingHours
  })
  
  if (hoursDifference < plan.minAdvanceBookingHours) {
    throw new BadRequestException(
      `This appointment must be booked at least ${plan.minAdvanceBookingHours} hours in advance. Current difference: ${hoursDifference.toFixed(2)} hours`
    )
  }

  if (hoursDifference > plan.maxAdvanceBookingHours) {
    throw new BadRequestException(
      `This appointment cannot be booked more than ${plan.maxAdvanceBookingHours} hours in advance. Current difference: ${hoursDifference.toFixed(2)} hours`
    )
  }

  // Check if slot is already booked
  const isSlotAvailable = await this.checkSlotAvailability(
    date,
    timeSlot,
    consultationType,
    doctorId
  )

  if (!isSlotAvailable) {
    throw new BadRequestException(
      `This time slot is no longer available. Please choose another time.`
    )
  }

  const appointment = new this.appointmentModel({
    userId: new Types.ObjectId(userId),
    doctorId: doctorId ? new Types.ObjectId(doctorId) : undefined,
    planId: new Types.ObjectId(planId),
    consultationType,
    consultationCategory,
    consultationMode,
    date: appointmentDate,
    timeSlot,
    duration,
    location,
    price,
    patientNotes,
    chiefComplaint,
    symptoms,
    previousAppointmentId: previousAppointmentId ? new Types.ObjectId(previousAppointmentId) : undefined,
    paymentStatus: PaymentStatus.PENDING,
    status: AppointmentStatus.BOOKED,
    scheduledStartTime
  })

  await appointment.save()

  // If this is a follow-up, link it to previous appointment
  if (previousAppointmentId) {
    await this.appointmentModel.findByIdAndUpdate(
      previousAppointmentId,
      { nextAppointmentId: appointment._id }
    )
  }

  console.log('Appointment created successfully:', appointment._id)

  return appointment
}

//   async createAppointment(userId: string, createAppointmentDto: CreateAppointmentDto) {
//   const { 
//     planId, 
//     doctorId,
//     consultationType, 
//     consultationCategory,
//     consultationMode, 
//     date, 
//     timeSlot, 
//     location, 
//     price, 
//     duration,
//     patientNotes,
//     chiefComplaint,
//     symptoms,
//     previousAppointmentId
//   } = createAppointmentDto

//   // Validate plan
//   const plan = await this.consultationPlansService.getPlanById(planId)
  
//   // Calculate the actual appointment datetime
//   const scheduledStartTime = this.calculateScheduledStartTime(date, timeSlot)
  
//   // Check if plan is available for the selected date/time
//   const appointmentDate = new Date(date + 'T00:00:00Z')
//   const isAvailable = await this.consultationPlansService.isPlanAvailableForDateTime(
//     planId,
//     appointmentDate,
//     timeSlot
//   )

//   if (!isAvailable) {
//     throw new BadRequestException(
//       "This consultation plan is not available for the selected date and time"
//     )
//   }

//   // Validate consultation type matches plan
//   if (plan.consultationType !== consultationType) {
//     throw new BadRequestException(
//       `Consultation type must be ${plan.consultationType} for this plan`
//     )
//   }

//   // Validate consultation category matches plan
//   if (plan.consultationCategory !== consultationCategory) {
//     throw new BadRequestException(
//       `Consultation category must be ${plan.consultationCategory} for this plan`
//     )
//   }

//   // Validate consultation mode
//   if (!plan.consultationModes.includes(consultationMode)) {
//     throw new BadRequestException(
//       `Consultation mode ${consultationMode} is not available for this plan`
//     )
//   }

//   // Check patient eligibility
//   if (plan.isNewPatientOnly) {
//     const existingAppointments = await this.appointmentModel.countDocuments({
//       userId: new Types.ObjectId(userId),
//       status: { $in: [AppointmentStatus.COMPLETED] }
//     })
    
//     if (existingAppointments > 0) {
//       throw new BadRequestException("This plan is only available for new patients")
//     }
//   }

//   if (plan.isExistingPatientOnly) {
//     const existingAppointments = await this.appointmentModel.countDocuments({
//       userId: new Types.ObjectId(userId),
//       status: { $in: [AppointmentStatus.COMPLETED] }
//     })
    
//     if (existingAppointments === 0) {
//       throw new BadRequestException("This plan is only available for existing patients")
//     }
//   }

//   // Check minimum advance booking using the actual scheduled time
//   const now = new Date()
//   const hoursDifference = (scheduledStartTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  
//   if (hoursDifference < plan.minAdvanceBookingHours) {
//     throw new BadRequestException(
//       `This appointment must be booked at least ${plan.minAdvanceBookingHours} hours in advance. Time difference: ${hoursDifference.toFixed(2)} hours`
//     )
//   }

//   if (hoursDifference > plan.maxAdvanceBookingHours) {
//     throw new BadRequestException(
//       `This appointment cannot be booked more than ${plan.maxAdvanceBookingHours} hours in advance`
//     )
//   }

//   // Check if slot is already booked
//   const isSlotAvailable = await this.checkSlotAvailability(
//     date,
//     timeSlot,
//     consultationType,
//     doctorId
//   )

//   if (!isSlotAvailable) {
//     throw new BadRequestException(
//       `This time slot is no longer available. Please choose another time.`
//     )
//   }

//   const appointment = new this.appointmentModel({
//     userId: new Types.ObjectId(userId),
//     doctorId: doctorId ? new Types.ObjectId(doctorId) : undefined,
//     planId: new Types.ObjectId(planId),
//     consultationType,
//     consultationCategory,
//     consultationMode,
//     date: appointmentDate,
//     timeSlot,
//     duration,
//     location,
//     price,
//     patientNotes,
//     chiefComplaint,
//     symptoms,
//     previousAppointmentId: previousAppointmentId ? new Types.ObjectId(previousAppointmentId) : undefined,
//     paymentStatus: PaymentStatus.PENDING,
//     status: AppointmentStatus.BOOKED,
//     scheduledStartTime
//   })

//   await appointment.save()

//   // If this is a follow-up, link it to previous appointment
//   if (previousAppointmentId) {
//     await this.appointmentModel.findByIdAndUpdate(
//       previousAppointmentId,
//       { nextAppointmentId: appointment._id }
//     )
//   }

//   return appointment
// }

  // async createAppointment(userId: string, createAppointmentDto: CreateAppointmentDto) {
  //   const { 
  //     planId, 
  //     doctorId,
  //     consultationType, 
  //     consultationCategory,
  //     consultationMode, 
  //     date, 
  //     timeSlot, 
  //     location, 
  //     price, 
  //     duration,
  //     patientNotes,
  //     chiefComplaint,
  //     symptoms,
  //     previousAppointmentId
  //   } = createAppointmentDto

  //   // Validate plan
  //   const plan = await this.consultationPlansService.getPlanById(planId)
    
  //   // Check if plan is available for the selected date/time
  //   const isAvailable = await this.consultationPlansService.isPlanAvailableForDateTime(
  //     planId,
  //     new Date(date),
  //     timeSlot
  //   )

  //   if (!isAvailable) {
  //     throw new BadRequestException(
  //       "This consultation plan is not available for the selected date and time"
  //     )
  //   }

  //   // Validate consultation type matches plan
  //   if (plan.consultationType !== consultationType) {
  //     throw new BadRequestException(
  //       `Consultation type must be ${plan.consultationType} for this plan`
  //     )
  //   }

  //   // Validate consultation category matches plan
  //   if (plan.consultationCategory !== consultationCategory) {
  //     throw new BadRequestException(
  //       `Consultation category must be ${plan.consultationCategory} for this plan`
  //     )
  //   }

  //   // Validate consultation mode
  //   if (!plan.consultationModes.includes(consultationMode)) {
  //     throw new BadRequestException(
  //       `Consultation mode ${consultationMode} is not available for this plan`
  //     )
  //   }

  //   // Check patient eligibility
  //   if (plan.isNewPatientOnly) {
  //     const existingAppointments = await this.appointmentModel.countDocuments({
  //       userId: new Types.ObjectId(userId),
  //       status: { $in: [AppointmentStatus.COMPLETED] }
  //     })
      
  //     if (existingAppointments > 0) {
  //       throw new BadRequestException("This plan is only available for new patients")
  //     }
  //   }

  //   if (plan.isExistingPatientOnly) {
  //     const existingAppointments = await this.appointmentModel.countDocuments({
  //       userId: new Types.ObjectId(userId),
  //       status: { $in: [AppointmentStatus.COMPLETED] }
  //     })
      
  //     if (existingAppointments === 0) {
  //       throw new BadRequestException("This plan is only available for existing patients")
  //     }
  //   }

  //   // Check minimum advance booking
  //   const appointmentDate = new Date(date)
  //   const now = new Date()
  //   const hoursDifference = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    
  //   if (hoursDifference < plan.minAdvanceBookingHours) {
  //     throw new BadRequestException(
  //       `This appointment must be booked at least ${plan.minAdvanceBookingHours} hours in advance`
  //     )
  //   }

  //   if (hoursDifference > plan.maxAdvanceBookingHours) {
  //     throw new BadRequestException(
  //       `This appointment cannot be booked more than ${plan.maxAdvanceBookingHours} hours in advance`
  //     )
  //   }

  //   // Check if slot is already booked
  //   const isSlotAvailable = await this.checkSlotAvailability(
  //     date,
  //     timeSlot,
  //     consultationType,
  //     doctorId
  //   )

  //   if (!isSlotAvailable) {
  //     throw new BadRequestException(
  //       `This time slot is no longer available. Please choose another time.`
  //     )
  //   }

  //   const appointment = new this.appointmentModel({
  //     userId: new Types.ObjectId(userId),
  //     doctorId: doctorId ? new Types.ObjectId(doctorId) : undefined,
  //     planId: new Types.ObjectId(planId),
  //     consultationType,
  //     consultationCategory,
  //     consultationMode,
  //     date: new Date(date),
  //     timeSlot,
  //     duration,
  //     location,
  //     price,
  //     patientNotes,
  //     chiefComplaint,
  //     symptoms,
  //     previousAppointmentId: previousAppointmentId ? new Types.ObjectId(previousAppointmentId) : undefined,
  //     paymentStatus: PaymentStatus.PENDING,
  //     status: AppointmentStatus.BOOKED,
  //     scheduledStartTime: this.calculateScheduledStartTime(date, timeSlot)
  //   })

  //   await appointment.save()

  //   // If this is a follow-up, link it to previous appointment
  //   if (previousAppointmentId) {
  //     await this.appointmentModel.findByIdAndUpdate(
  //       previousAppointmentId,
  //       { nextAppointmentId: appointment._id }
  //     )
  //   }

  //   return appointment
  // }

//   async createAppointment(userId: string, createAppointmentDto: CreateAppointmentDto) {
//   const { 
//     planId, 
//     doctorId,
//     consultationType, 
//     consultationCategory,
//     consultationMode, 
//     date, 
//     timeSlot, 
//     location, 
//     price, 
//     duration,
//     patientNotes,
//     chiefComplaint,
//     symptoms,
//     previousAppointmentId
//   } = createAppointmentDto

//   // Validate plan
//   const plan = await this.consultationPlansService.getPlanById(planId)
  
//   // Parse date string to UTC date without timezone conversion
//   const appointmentDate = new Date(date + 'T00:00:00Z')
  
//   // Check if plan is available for the selected date/time
//   const isAvailable = await this.consultationPlansService.isPlanAvailableForDateTime(
//     planId,
//     appointmentDate,
//     timeSlot
//   )

//   if (!isAvailable) {
//     throw new BadRequestException(
//       "This consultation plan is not available for the selected date and time"
//     )
//   }

//   // Validate consultation type matches plan
//   if (plan.consultationType !== consultationType) {
//     throw new BadRequestException(
//       `Consultation type must be ${plan.consultationType} for this plan`
//     )
//   }

//   // Validate consultation category matches plan
//   if (plan.consultationCategory !== consultationCategory) {
//     throw new BadRequestException(
//       `Consultation category must be ${plan.consultationCategory} for this plan`
//     )
//   }

//   // Validate consultation mode
//   if (!plan.consultationModes.includes(consultationMode)) {
//     throw new BadRequestException(
//       `Consultation mode ${consultationMode} is not available for this plan`
//     )
//   }

//   // Check patient eligibility
//   if (plan.isNewPatientOnly) {
//     const existingAppointments = await this.appointmentModel.countDocuments({
//       userId: new Types.ObjectId(userId),
//       status: { $in: [AppointmentStatus.COMPLETED] }
//     })
    
//     if (existingAppointments > 0) {
//       throw new BadRequestException("This plan is only available for new patients")
//     }
//   }

//   if (plan.isExistingPatientOnly) {
//     const existingAppointments = await this.appointmentModel.countDocuments({
//       userId: new Types.ObjectId(userId),
//       status: { $in: [AppointmentStatus.COMPLETED] }
//     })
    
//     if (existingAppointments === 0) {
//       throw new BadRequestException("This plan is only available for existing patients")
//     }
//   }

//   // Check minimum advance booking
//   const now = new Date()
//   const hoursDifference = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60)
  
//   if (hoursDifference < plan.minAdvanceBookingHours) {
//     throw new BadRequestException(
//       `This appointment must be booked at least ${plan.minAdvanceBookingHours} hours in advance`
//     )
//   }

//   if (hoursDifference > plan.maxAdvanceBookingHours) {
//     throw new BadRequestException(
//       `This appointment cannot be booked more than ${plan.maxAdvanceBookingHours} hours in advance`
//     )
//   }

//   // Check if slot is already booked
//   const isSlotAvailable = await this.checkSlotAvailability(
//     date,
//     timeSlot,
//     consultationType,
//     doctorId
//   )

//   if (!isSlotAvailable) {
//     throw new BadRequestException(
//       `This time slot is no longer available. Please choose another time.`
//     )
//   }

//   const appointment = new this.appointmentModel({
//     userId: new Types.ObjectId(userId),
//     doctorId: doctorId ? new Types.ObjectId(doctorId) : undefined,
//     planId: new Types.ObjectId(planId),
//     consultationType,
//     consultationCategory,
//     consultationMode,
//     date: appointmentDate,
//     timeSlot,
//     duration,
//     location,
//     price,
//     patientNotes,
//     chiefComplaint,
//     symptoms,
//     previousAppointmentId: previousAppointmentId ? new Types.ObjectId(previousAppointmentId) : undefined,
//     paymentStatus: PaymentStatus.PENDING,
//     status: AppointmentStatus.BOOKED,
//     scheduledStartTime: this.calculateScheduledStartTime(date, timeSlot)
//   })

//   await appointment.save()

//   // If this is a follow-up, link it to previous appointment
//   if (previousAppointmentId) {
//     await this.appointmentModel.findByIdAndUpdate(
//       previousAppointmentId,
//       { nextAppointmentId: appointment._id }
//     )
//   }

//   return appointment
// }

  // private calculateScheduledStartTime(date: string, timeSlot: string): Date {
  //   const [startTime] = timeSlot.split('-')
  //   const [hours, minutes] = startTime.split(':').map(Number)
  //   const scheduledDate = new Date(date)
  //   scheduledDate.setHours(hours, minutes, 0, 0)
  //   return scheduledDate
  // }

  private calculateScheduledStartTime(date: string, timeSlot: string): Date {
  const [startTime] = timeSlot.split('-')
  const [hours, minutes] = startTime.split(':').map(Number)
  const scheduledDate = new Date(date + 'T00:00:00Z')
  scheduledDate.setUTCHours(hours, minutes, 0, 0)
  return scheduledDate
}

  // async checkSlotAvailability(
  //   date: string,
  //   timeSlot: string,
  //   consultationType: string,
  //   doctorId?: string
  // ): Promise<boolean> {
  //   const targetDate = new Date(date)
  //   const startOfDay = new Date(targetDate)
  //   startOfDay.setHours(0, 0, 0, 0)
    
  //   const endOfDay = new Date(targetDate)
  //   endOfDay.setHours(23, 59, 59, 999)

  //   const query: any = {
  //     date: {
  //       $gte: startOfDay,
  //       $lte: endOfDay,
  //     },
  //     timeSlot,
  //     consultationType,
  //     status: { 
  //       $nin: [AppointmentStatus.CANCELED, AppointmentStatus.NO_SHOW] 
  //     },
  //   }

  //   // If doctor is specified, check their availability
  //   if (doctorId) {
  //     query.doctorId = new Types.ObjectId(doctorId)
  //   }

  //   const existingAppointment = await this.appointmentModel.findOne(query)

  //   return !existingAppointment
  // }

  async checkSlotAvailability(
  date: string,
  timeSlot: string,
  consultationType: string,
  doctorId?: string
): Promise<boolean> {
  // Parse date string as UTC
  const targetDate = new Date(date + 'T00:00:00Z')
  const startOfDay = new Date(targetDate)
  startOfDay.setUTCHours(0, 0, 0, 0)
  
  const endOfDay = new Date(targetDate)
  endOfDay.setUTCHours(23, 59, 59, 999)

  const query: any = {
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    timeSlot,
    consultationType,
    status: { 
      $nin: [AppointmentStatus.CANCELED, AppointmentStatus.NO_SHOW] 
    },
  }

  // If doctor is specified, check their availability
  if (doctorId) {
    query.doctorId = new Types.ObjectId(doctorId)
  }

  const existingAppointment = await this.appointmentModel.findOne(query)

  return !existingAppointment
}

  async generateMeetLinkAfterPayment(appointmentId: string): Promise<string> {
    const appointment = await this.appointmentModel.findById(appointmentId)

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }

    if (appointment.paymentStatus !== PaymentStatus.SUCCESSFUL) {
      throw new BadRequestException("Payment must be successful before generating Meet link")
    }

    if (appointment.consultationCategory !== "virtual") {
      throw new BadRequestException("Google Meet link is only for virtual consultations")
    }

    try {
      const dateString = appointment.date.toISOString().split('T')[0]
      const meetLink = await this.googleMeetService.generateMeetLink(
        dateString,
        appointment.timeSlot
      )

      appointment.googleMeetLink = meetLink
      await appointment.save()

      return meetLink
    } catch (error) {
      console.error("Failed to generate Google Meet link:", error)
      throw new BadRequestException("Failed to generate Google Meet link")
    }
  }

  async getPatientStatus(userId: string) {
  const completedAppointments = await this.appointmentModel.countDocuments({
    userId: new Types.ObjectId(userId),
    status: { $in: [AppointmentStatus.COMPLETED] }
  })
  
  return {
    isNewPatient: completedAppointments === 0,
    isExistingPatient: completedAppointments > 0,
    completedAppointments
  }
}

  async getAppointments(userId: string, role: string, queryDto: QueryAppointmentsDto) {
    const query: any = {}

    // Role-based filtering
    if (role === "user" || role === "patient") {
      query.userId = new Types.ObjectId(userId)
    } else if (role === "doctor") {
      query.doctorId = new Types.ObjectId(userId)
    }

    // Apply filters from query DTO
    if (queryDto.status) {
      query.status = queryDto.status
    }

    if (queryDto.consultationType) {
      query.consultationType = queryDto.consultationType
    }

    if (queryDto.paymentStatus) {
      query.paymentStatus = queryDto.paymentStatus
    }

    if (queryDto.dateFrom || queryDto.dateTo) {
      query.date = {}
      if (queryDto.dateFrom) {
        query.date.$gte = new Date(queryDto.dateFrom)
      }
      if (queryDto.dateTo) {
        query.date.$lte = new Date(queryDto.dateTo)
      }
    }

    if (queryDto.searchTerm) {
      query.$or = [
        { patientNotes: { $regex: queryDto.searchTerm, $options: 'i' } },
        { chiefComplaint: { $regex: queryDto.searchTerm, $options: 'i' } },
        { diagnosis: { $regex: queryDto.searchTerm, $options: 'i' } }
      ]
    }

    const appointments = await this.appointmentModel
      .find(query)
      .populate("userId", "name email phone")
      .populate("doctorId", "name email specialization")
      .populate("planId", "name consultationType duration price")
      .sort({ date: -1, scheduledStartTime: -1 })

    return appointments
  }

  async getUserUpcomingAppointments(userId: string) {
    const now = new Date()
    
    return this.appointmentModel
      .find({
        userId: new Types.ObjectId(userId),
        date: { $gte: now },
        status: { 
          $in: [AppointmentStatus.BOOKED, AppointmentStatus.CONFIRMED] 
        }
      })
      .populate("doctorId", "name email specialization")
      .populate("planId", "name consultationType duration")
      .sort({ date: 1, scheduledStartTime: 1 })
  }

  async getUserPastAppointments(userId: string) {
    const now = new Date()
    
    return this.appointmentModel
      .find({
        userId: new Types.ObjectId(userId),
        $or: [
          { date: { $lt: now } },
          { status: { $in: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELED] } }
        ]
      })
      .populate("doctorId", "name email specialization")
      .populate("planId", "name consultationType duration")
      .sort({ date: -1, scheduledStartTime: -1 })
  }

  async getAppointmentById(appointmentId: string, userId: string, role: string) {
    const appointment = await this.appointmentModel
      .findById(appointmentId)
      .populate("userId", "name email phone")
      .populate("doctorId", "name email specialization")
      .populate("planId")
      .populate("previousAppointmentId")
      .populate("nextAppointmentId")

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }

    // Check authorization
    if (role === "user" || role === "patient") {
      if (appointment.userId._id.toString() !== userId) {
        throw new ForbiddenException("You can only view your own appointments")
      }
    } else if (role === "doctor") {
      if (appointment.doctorId && appointment.doctorId._id.toString() !== userId) {
        throw new ForbiddenException("You can only view your assigned appointments")
      }
    }

    return appointment
  }

  async updateAppointment(
    appointmentId: string, 
    updateDto: UpdateAppointmentDto,
    userId: string,
    role: string
  ) {
    const appointment = await this.appointmentModel.findById(appointmentId)

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }

    // Check authorization
    if (role === "doctor") {
      if (!appointment.doctorId || appointment.doctorId.toString() !== userId) {
        throw new ForbiddenException("You can only update your assigned appointments")
      }
    }

    Object.assign(appointment, updateDto)
    await appointment.save()

    return appointment
  }

  async cancelAppointment(
    appointmentId: string, 
    cancellationReason: string,
    canceledBy: string,
    userId: string,
    role: string
  ) {
    const appointment = await this.appointmentModel.findById(appointmentId)

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }

    if (appointment.status === AppointmentStatus.CANCELED) {
      throw new BadRequestException("Appointment is already canceled")
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException("Cannot cancel a completed appointment")
    }

    // Check authorization
    if (role === "user" || role === "patient") {
      if (appointment.userId.toString() !== userId) {
        throw new ForbiddenException("You can only cancel your own appointments")
      }
    }

    appointment.status = AppointmentStatus.CANCELED
    appointment.cancellationReason = cancellationReason
    appointment.canceledBy = canceledBy
    appointment.canceledAt = new Date()
    await appointment.save()

    return appointment
  }

  // async rescheduleAppointment(
  //   appointmentId: string, 
  //   rescheduleDto: RescheduleAppointmentDto,
  //   userId: string,
  //   role: string
  // ) {
  //   const { newDate, newTimeSlot } = rescheduleDto

  //   const appointment = await this.appointmentModel.findById(appointmentId)

  //   if (!appointment) {
  //     throw new NotFoundException("Appointment not found")
  //   }

  //   if (appointment.status === AppointmentStatus.CANCELED) {
  //     throw new BadRequestException("Cannot reschedule a canceled appointment")
  //   }

  //   if (appointment.status === AppointmentStatus.COMPLETED) {
  //     throw new BadRequestException("Cannot reschedule a completed appointment")
  //   }

  //   // Check authorization
  //   if (role === "user" || role === "patient") {
  //     if (appointment.userId.toString() !== userId) {
  //       throw new ForbiddenException("You can only reschedule your own appointments")
  //     }
  //   }

  //   // Check if new slot is available
  //   const isNewSlotAvailable = await this.checkSlotAvailability(
  //     newDate,
  //     newTimeSlot,
  //     appointment.consultationType,
  //     appointment.doctorId?.toString()
  //   )

  //   if (!isNewSlotAvailable) {
  //     throw new BadRequestException(
  //       "The new time slot is not available. Please choose another time."
  //     )
  //   }

  //   // Update appointment
  //   appointment.date = new Date(newDate)
  //   appointment.timeSlot = newTimeSlot
  //   appointment.scheduledStartTime = this.calculateScheduledStartTime(newDate, newTimeSlot)
  //   appointment.status = AppointmentStatus.RESCHEDULED
    
  //   // Regenerate Meet link for virtual consultations
  //   if (appointment.consultationCategory === "virtual" && appointment.googleMeetLink) {
  //     try {
  //       const meetLink = await this.googleMeetService.generateMeetLink(newDate, newTimeSlot)
  //       appointment.googleMeetLink = meetLink
  //     } catch (error) {
  //       console.error("Failed to regenerate Google Meet link:", error)
  //     }
  //   }

  //   await appointment.save()

  //   return appointment
  // }

  async rescheduleAppointment(
  appointmentId: string, 
  rescheduleDto: RescheduleAppointmentDto,
  userId: string,
  role: string
) {
  const { newDate, newTimeSlot } = rescheduleDto

  const appointment = await this.appointmentModel.findById(appointmentId)

  if (!appointment) {
    throw new NotFoundException("Appointment not found")
  }

  if (appointment.status === AppointmentStatus.CANCELED) {
    throw new BadRequestException("Cannot reschedule a canceled appointment")
  }

  if (appointment.status === AppointmentStatus.COMPLETED) {
    throw new BadRequestException("Cannot reschedule a completed appointment")
  }

  // Check authorization
  if (role === "user" || role === "patient") {
    if (appointment.userId.toString() !== userId) {
      throw new ForbiddenException("You can only reschedule your own appointments")
    }
  }

  // Check if new slot is available
  const isNewSlotAvailable = await this.checkSlotAvailability(
    newDate,
    newTimeSlot,
    appointment.consultationType,
    appointment.doctorId?.toString()
  )

  if (!isNewSlotAvailable) {
    throw new BadRequestException(
      "The new time slot is not available. Please choose another time."
    )
  }

  // Parse new date as UTC
  const newAppointmentDate = new Date(newDate + 'T00:00:00Z')

  // Update appointment
  appointment.date = newAppointmentDate
  appointment.timeSlot = newTimeSlot
  appointment.scheduledStartTime = this.calculateScheduledStartTime(newDate, newTimeSlot)
  appointment.status = AppointmentStatus.RESCHEDULED
  
  // Regenerate Meet link for virtual consultations
  if (appointment.consultationCategory === "virtual" && appointment.googleMeetLink) {
    try {
      const meetLink = await this.googleMeetService.generateMeetLink(newDate, newTimeSlot)
      appointment.googleMeetLink = meetLink
    } catch (error) {
      console.error("Failed to regenerate Google Meet link:", error)
    }
  }

  await appointment.save()

  return appointment
}

  async completeAppointment(
    appointmentId: string, 
    completeDto: CompleteAppointmentDto,
    doctorId: string
  ) {
    const appointment = await this.appointmentModel.findById(appointmentId)

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }

    if (!appointment.doctorId || appointment.doctorId.toString() !== doctorId) {
      throw new ForbiddenException("You can only complete your assigned appointments")
    }

    appointment.status = AppointmentStatus.COMPLETED
    appointment.doctorNotes = completeDto.doctorNotes
    appointment.diagnosis = completeDto.diagnosis
    appointment.prescription = completeDto.prescription
    appointment.attachments = completeDto.attachments || []
    appointment.followUpRequired = completeDto.followUpRequired
    appointment.followUpDate = completeDto.followUpDate ? new Date(completeDto.followUpDate) : undefined
    appointment.actualEndTime = new Date()

    await appointment.save()

    return appointment
  }

  async checkInAppointment(appointmentId: string, userId: string) {
    const appointment = await this.appointmentModel.findById(appointmentId)

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }

    if (appointment.userId.toString() !== userId) {
      throw new ForbiddenException("You can only check in to your own appointments")
    }

    appointment.checkedInAt = new Date()
    await appointment.save()

    return appointment
  }

  async startAppointment(appointmentId: string, doctorId: string) {
    const appointment = await this.appointmentModel.findById(appointmentId)

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }

    if (!appointment.doctorId || appointment.doctorId.toString() !== doctorId) {
      throw new ForbiddenException("You can only start your assigned appointments")
    }

    appointment.status = AppointmentStatus.IN_PROGRESS
    appointment.actualStartTime = new Date()
    await appointment.save()

    return appointment
  }

  async confirmAppointment(appointmentId: string) {
    const appointment = await this.appointmentModel.findById(appointmentId)

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }

    appointment.status = AppointmentStatus.CONFIRMED
    await appointment.save()

    return appointment
  }

  async rateAppointment(
    appointmentId: string, 
    rating: number, 
    feedback: string | undefined,
    userId: string,
    role: string
  ) {
    const appointment = await this.appointmentModel.findById(appointmentId)

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }

    if (appointment.status !== AppointmentStatus.COMPLETED) {
      throw new BadRequestException("Can only rate completed appointments")
    }

    if (role === "user" || role === "patient") {
      if (appointment.userId.toString() !== userId) {
        throw new ForbiddenException("You can only rate your own appointments")
      }
      appointment.patientRating = rating
      appointment.patientFeedback = feedback
    } else if (role === "doctor") {
      if (!appointment.doctorId || appointment.doctorId.toString() !== userId) {
        throw new ForbiddenException("You can only rate your assigned appointments")
      }
      appointment.doctorRating = rating
      appointment.doctorFeedback = feedback
    }

    await appointment.save()

    return appointment
  }

  async getMeetLink(appointmentId: string, userId: string, role: string) {
    const appointment = await this.appointmentModel.findById(appointmentId)

    if (!appointment) {
      throw new NotFoundException("Appointment not found")
    }

    // Check authorization
    if (role === "user" || role === "patient") {
      if (appointment.userId.toString() !== userId) {
        throw new ForbiddenException("Access denied")
      }
    } else if (role === "doctor") {
      if (!appointment.doctorId || appointment.doctorId.toString() !== userId) {
        throw new ForbiddenException("Access denied")
      }
    }

    if (!appointment.googleMeetLink) {
      throw new NotFoundException("Meet link not generated yet")
    }

    return { meetLink: appointment.googleMeetLink }
  }

  async getAppointmentStatistics(userId: string, role: string) {
    const query: any = {}

    if (role === "user" || role === "patient") {
      query.userId = new Types.ObjectId(userId)
    } else if (role === "doctor") {
      query.doctorId = new Types.ObjectId(userId)
    }

    const [total, completed, canceled, upcoming] = await Promise.all([
      this.appointmentModel.countDocuments(query),
      this.appointmentModel.countDocuments({ 
        ...query, 
        status: AppointmentStatus.COMPLETED 
      }),
      this.appointmentModel.countDocuments({ 
        ...query, 
        status: AppointmentStatus.CANCELED 
      }),
      this.appointmentModel.countDocuments({ 
        ...query, 
        date: { $gte: new Date() },
        status: { $in: [AppointmentStatus.BOOKED, AppointmentStatus.CONFIRMED] }
      })
    ])

    return {
      total,
      completed,
      canceled,
      upcoming,
      completionRate: total > 0 ? ((completed / total) * 100).toFixed(2) : 0
    }
  }

  async getUpcomingAppointments() {
    const now = new Date()
    return this.appointmentModel.find({
      date: { $gte: now },
      status: { $in: [AppointmentStatus.BOOKED, AppointmentStatus.CONFIRMED] },
    })
  }
}