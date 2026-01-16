// import { Injectable, BadRequestException } from "@nestjs/common"
// import { InjectModel } from "@nestjs/mongoose"
// import { Model } from "mongoose"
// import { User } from "src/schemas/user.schema"
// import { Appointment } from "src/schemas/appointment.schema"
// import { Transaction } from "src/schemas/transaction.schema"
// import { Availability } from "src/schemas/availability.schema"
// import { Settings } from "src/schemas/settings.schema"

// @Injectable()
// export class AdminService {
//   constructor(
//     @InjectModel(User.name) private userModel: Model<User>,
//     @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
//     @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
//     @InjectModel(Availability.name) private availabilityModel: Model<Availability>,
//     @InjectModel(Settings.name) private settingsModel: Model<Settings>,
//   ) {}

//   async getDashboardStats() {
//     const totalUsers = await this.userModel.countDocuments({ role: "user" })
//     const totalAppointments = await this.appointmentModel.countDocuments()
//     const completedAppointments = await this.appointmentModel.countDocuments({ status: "completed" })
//     const totalRevenue = await this.transactionModel.aggregate([
//       { $match: { paymentStatus: "successful" } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ])

//     return {
//       totalUsers,
//       totalAppointments,
//       completedAppointments,
//       totalRevenue: totalRevenue[0]?.total || 0,
//     }
//   }

//   async getAllUsers(filter?: any) {
//     const query = filter || { role: "user" }
//     return this.userModel.find(query).select("-password -resetToken")
//   }

//   async getAllAppointments(filter?: any) {
//     const query = filter || {}
//     return this.appointmentModel.find(query).populate("userId", "name email phone")
//   }

//   async getAppointmentsByStatus(status: string) {
//     return this.appointmentModel.find({ status }).populate("userId", "name email phone")
//   }

//   async getAllTransactions() {
//     return this.transactionModel.find().populate("userId", "name email").populate("appointmentId")
//   }

//   async setAvailability(availabilityData: any) {
//     const { dayOfWeek, timeSlots, consultationType } = availabilityData

//     const existingAvailability = await this.availabilityModel.findOne({
//       dayOfWeek,
//       consultationType,
//     })

//     if (existingAvailability) {
//       existingAvailability.timeSlots = timeSlots
//       await existingAvailability.save()
//       return existingAvailability
//     }

//     const availability = new this.availabilityModel({
//       dayOfWeek,
//       timeSlots,
//       consultationType,
//       isAvailable: true,
//     })

//     await availability.save()
//     return availability
//   }

//   async getAvailability() {
//     return this.availabilityModel.find()
//   }

//   async getAvailabilityByDate(
//     dateString?: string, 
//     timeString?: string, 
//     consultationType?: string
//   ) {
//     // Use provided date or default to current date
//     const now = new Date()
//     const targetDate = dateString ? new Date(dateString) : now
    
//     // Get the day of week (0 = Sunday, 1 = Monday, etc.)
//     const dayOfWeek = targetDate.getDay()

//     // Format current time as HH:MM if no time string provided
//     const currentTimeString = timeString || 
//       `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

//     // Build query for availability
//     const availabilityQuery: any = {
//       dayOfWeek,
//       isAvailable: true,
//     }

//     // Add consultation type filter if provided
//     if (consultationType) {
//       if (!['physical', 'virtual'].includes(consultationType)) {
//         throw new BadRequestException('Invalid consultation type. Must be "physical" or "virtual"')
//       }
//       availabilityQuery.consultationType = consultationType
//     }

//     // Fetch availability for that specific day
//     const availability = await this.availabilityModel.find(availabilityQuery)

//     // Get booked appointments for that date
//     const startOfDay = new Date(targetDate)
//     startOfDay.setHours(0, 0, 0, 0)
    
//     const endOfDay = new Date(targetDate)
//     endOfDay.setHours(23, 59, 59, 999)

//     const appointmentQuery: any = {
//       date: {
//         $gte: startOfDay,
//         $lte: endOfDay,
//       },
//       status: { $ne: "canceled" },
//     }

//     // Add consultation type filter to appointment query if provided
//     if (consultationType) {
//       appointmentQuery.consultationType = consultationType
//     }

//     const bookedAppointments = await this.appointmentModel.find(appointmentQuery)

//     // Map to extract booked time slots and consultation types
//     const bookedSlots = bookedAppointments.map(apt => ({
//       timeSlot: apt.timeSlot,
//       consultationType: apt.consultationType,
//     }))

//     // If specific time is requested (or defaulting to current time)
//     if (timeString || !dateString) {
//       const checkTimeString = timeString || currentTimeString
      
//       const timeAvailability = availability.map(avail => {
//         const timeSlot = avail.timeSlots.find(slot => slot.startTime === checkTimeString)
        
//         if (!timeSlot) {
//           return {
//             consultationType: avail.consultationType,
//             isAvailable: false,
//             reason: 'Time slot not in schedule',
//           }
//         }

//         const isBooked = bookedSlots.some(
//           booked =>
//             booked.timeSlot === checkTimeString &&
//             booked.consultationType === avail.consultationType
//         )

//         return {
//           consultationType: avail.consultationType,
//           time: checkTimeString,
//           timeSlot,
//           isAvailable: !isBooked,
//           reason: isBooked ? 'Already booked' : null,
//         }
//       })

//       return {
//         date: targetDate.toISOString().split('T')[0],
//         dayOfWeek,
//         time: checkTimeString,
//         availability: timeAvailability,
//       }
//     }

//     // Filter out booked slots from available slots (when date is provided but no time)
//     const availableSlots = availability.map(avail => {
//       const availableTimeSlots = avail.timeSlots.map(slot => {
//         const isBooked = bookedSlots.some(
//           booked =>
//             booked.timeSlot === slot.startTime &&
//             booked.consultationType === avail.consultationType
//         )
        
//         return {
//           startTime: slot.startTime,
//           endTime: slot.endTime,
//           isAvailable: !isBooked,
//         }
//       })

//       return {
//         _id: avail._id,
//         dayOfWeek: avail.dayOfWeek,
//         consultationType: avail.consultationType,
//         isAvailable: avail.isAvailable,
//         timeSlots: availableTimeSlots,
//       }
//     })

//     return {
//       date: targetDate.toISOString().split('T')[0],
//       dayOfWeek,
//       availability: availableSlots,
//     }
//   }

//   async updateSettings(settingsData: any) {
//     let settings = await this.settingsModel.findOne()

//     if (!settings) {
//       settings = new this.settingsModel(settingsData)
//     } else {
//       Object.assign(settings, settingsData)
//     }

//     await settings.save()
//     return settings
//   }

//   async getSettings() {
//     let settings = await this.settingsModel.findOne()

//     if (!settings) {
//       settings = new this.settingsModel({
//         physicalConsultationFee: 5000,
//         virtualConsultationFee: 3000,
//         clinicLocation: "Lagos, Nigeria",
//         clinicLatitude: 6.5244,
//         clinicLongitude: 3.3792,
//         contactEmail: "info.doctordey@gmail.com",
//         contactPhone: "+2348034080064",
//       })
//       await settings.save()
//     }

//     return settings
//   }

//   async exportTransactions() {
//     return this.transactionModel.find().lean()
//   }

//   async exportAppointments() {
//     return this.appointmentModel.find().lean()
//   }
// }

import { Injectable, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { User, UserRole } from "src/schemas/user.schema"
import { Appointment } from "src/schemas/appointment.schema"
import { Transaction } from "src/schemas/transaction.schema"
import { Availability } from "src/schemas/availability.schema"
import { Settings } from "src/schemas/settings.schema"
import { 
  ConsultationType, 
  ConsultationMode, 
  ConsultationCategory,
  AppointmentStatus,
  PaymentStatus 
} from "src/schemas/shared-enums"

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(Availability.name) private availabilityModel: Model<Availability>,
    @InjectModel(Settings.name) private settingsModel: Model<Settings>,
  ) {}

  async getDashboardStats() {
    const totalPatients = await this.userModel.countDocuments({ role: UserRole.PATIENT })
    const totalDoctors = await this.userModel.countDocuments({ role: UserRole.DOCTOR })
    const totalAppointments = await this.appointmentModel.countDocuments()
    const completedAppointments = await this.appointmentModel.countDocuments({ 
      status: AppointmentStatus.COMPLETED 
    })
    const pendingAppointments = await this.appointmentModel.countDocuments({ 
      status: AppointmentStatus.BOOKED 
    })
    const totalRevenue = await this.transactionModel.aggregate([
      { $match: { paymentStatus: "successful" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    return {
      totalPatients,
      totalDoctors,
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      totalRevenue: totalRevenue[0]?.total || 0,
    }
  }

  async getAllUsers(filter?: any) {
    const query = filter || {}
    return this.userModel.find(query).select("-password -resetToken -verificationToken -resetTokenExpiry")
  }

  async getUsersByRole(role: UserRole) {
    return this.userModel
      .find({ role })
      .select("-password -resetToken -verificationToken -resetTokenExpiry")
      .sort({ createdAt: -1 })
  }

  async getAllDoctors() {
    return this.userModel
      .find({ role: UserRole.DOCTOR })
      .select("-password -resetToken -verificationToken -resetTokenExpiry")
      .sort({ averageRating: -1 })
  }

  async verifyDoctor(doctorId: string, adminId: string) {
    const doctor = await this.userModel.findById(doctorId)

    if (!doctor) {
      throw new BadRequestException("Doctor not found")
    }

    if (doctor.role !== UserRole.DOCTOR) {
      throw new BadRequestException("User is not a doctor")
    }

    doctor.isVerified = true
    doctor.verifiedAt = new Date()
    doctor.verifiedBy = adminId
    await doctor.save()

    return doctor
  }

  async getAllAppointments(filter?: any) {
    const query = filter || {}
    return this.appointmentModel
      .find(query)
      .populate("userId", "name email phone")
      .populate("doctorId", "name email specialization")
      .populate("planId", "name consultationType duration price")
      .sort({ date: -1 })
  }

  async getAppointmentsByStatus(status: AppointmentStatus) {
    return this.appointmentModel
      .find({ status })
      .populate("userId", "name email phone")
      .populate("doctorId", "name email specialization")
      .populate("planId", "name consultationType duration price")
      .sort({ date: -1 })
  }

  async getAllTransactions() {
    return this.transactionModel
      .find()
      .populate("userId", "name email")
      .populate("appointmentId")
      .sort({ createdAt: -1 })
  }

  async setAvailability(availabilityData: any) {
    const { 
      dayOfWeek, 
      timeSlots, 
      consultationCategory,
      doctorId,
      allowedConsultationTypes,
      allowedConsultationModes,
      location,
      maxConcurrentAppointments,
      slotDuration,
      bufferTime
    } = availabilityData

    const query: any = {
      dayOfWeek,
      consultationCategory,
    }

    // If doctor-specific availability
    if (doctorId) {
      query.doctorId = doctorId
    }

    const existingAvailability = await this.availabilityModel.findOne(query)

    if (existingAvailability) {
      existingAvailability.timeSlots = timeSlots
      if (allowedConsultationTypes) {
        existingAvailability.allowedConsultationTypes = allowedConsultationTypes
      }
      if (allowedConsultationModes) {
        existingAvailability.allowedConsultationModes = allowedConsultationModes
      }
      if (location) existingAvailability.location = location
      if (maxConcurrentAppointments) {
        existingAvailability.maxConcurrentAppointments = maxConcurrentAppointments
      }
      if (slotDuration) existingAvailability.slotDuration = slotDuration
      if (bufferTime !== undefined) existingAvailability.bufferTime = bufferTime
      
      await existingAvailability.save()
      return existingAvailability
    }

    const availability = new this.availabilityModel({
      dayOfWeek,
      timeSlots,
      consultationCategory,
      doctorId: doctorId || undefined,
      allowedConsultationTypes: allowedConsultationTypes || [],
      allowedConsultationModes: allowedConsultationModes || [],
      location,
      maxConcurrentAppointments: maxConcurrentAppointments || 1,
      slotDuration: slotDuration || 30,
      bufferTime: bufferTime || 0,
      isAvailable: true,
      isRecurring: true,
    })

    await availability.save()
    return availability
  }

  async getAvailability(doctorId?: string) {
    const query: any = {}
    
    if (doctorId) {
      query.doctorId = doctorId
    }

    return this.availabilityModel.find(query).populate("doctorId", "name specialization")
  }

  async getAvailabilityByDate(
    dateString?: string, 
    timeString?: string, 
    consultationCategory?: ConsultationCategory,
    doctorId?: string
  ) {
    const now = new Date()
    const targetDate = dateString ? new Date(dateString) : now
    const dayOfWeek = targetDate.getDay()

    const currentTimeString = timeString || 
      `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    // Build query for availability
    const availabilityQuery: any = {
      dayOfWeek,
      isAvailable: true,
    }

    if (consultationCategory) {
      if (!Object.values(ConsultationCategory).includes(consultationCategory)) {
        throw new BadRequestException(
          `Invalid consultation category. Must be one of: ${Object.values(ConsultationCategory).join(", ")}`
        )
      }
      availabilityQuery.consultationCategory = consultationCategory
    }

    if (doctorId) {
      availabilityQuery.doctorId = doctorId
    }

    const availability = await this.availabilityModel.find(availabilityQuery)

    // Get booked appointments for that date
    const startOfDay = new Date(targetDate)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(targetDate)
    endOfDay.setHours(23, 59, 59, 999)

    const appointmentQuery: any = {
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: { 
        $nin: [AppointmentStatus.CANCELED, AppointmentStatus.NO_SHOW] 
      },
    }

    if (consultationCategory) {
      appointmentQuery.consultationCategory = consultationCategory
    }

    if (doctorId) {
      appointmentQuery.doctorId = doctorId
    }

    const bookedAppointments = await this.appointmentModel.find(appointmentQuery)

    const bookedSlots = bookedAppointments.map(apt => ({
      timeSlot: apt.timeSlot,
      consultationCategory: apt.consultationCategory,
      doctorId: apt.doctorId?.toString(),
    }))

    // If specific time is requested
    if (timeString || !dateString) {
      const checkTimeString = timeString || currentTimeString
      
      const timeAvailability = availability.map(avail => {
        const timeSlot = avail.timeSlots.find(slot => slot.startTime === checkTimeString)
        
        if (!timeSlot) {
          return {
            consultationCategory: avail.consultationCategory,
            doctorId: avail.doctorId,
            isAvailable: false,
            reason: 'Time slot not in schedule',
          }
        }

        const isBooked = bookedSlots.some(
          booked =>
            booked.timeSlot === checkTimeString &&
            booked.consultationCategory === avail.consultationCategory &&
            (!avail.doctorId || booked.doctorId === avail.doctorId?.toString())
        )

        return {
          consultationCategory: avail.consultationCategory,
          doctorId: avail.doctorId,
          time: checkTimeString,
          timeSlot,
          isAvailable: !isBooked,
          reason: isBooked ? 'Already booked' : null,
        }
      })

      return {
        date: targetDate.toISOString().split('T')[0],
        dayOfWeek,
        time: checkTimeString,
        availability: timeAvailability,
      }
    }

    // Filter out booked slots from available slots
    const availableSlots = availability.map(avail => {
      const availableTimeSlots = avail.timeSlots.map(slot => {
        const isBooked = bookedSlots.some(
          booked =>
            booked.timeSlot === slot.startTime &&
            booked.consultationCategory === avail.consultationCategory &&
            (!avail.doctorId || booked.doctorId === avail.doctorId?.toString())
        )
        
        return {
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable: !isBooked,
        }
      })

      return {
        _id: avail._id,
        dayOfWeek: avail.dayOfWeek,
        consultationCategory: avail.consultationCategory,
        doctorId: avail.doctorId,
        isAvailable: avail.isAvailable,
        allowedConsultationTypes: avail.allowedConsultationTypes,
        allowedConsultationModes: avail.allowedConsultationModes,
        location: avail.location,
        maxConcurrentAppointments: avail.maxConcurrentAppointments,
        slotDuration: avail.slotDuration,
        bufferTime: avail.bufferTime,
        timeSlots: availableTimeSlots,
      }
    })

    return {
      date: targetDate.toISOString().split('T')[0],
      dayOfWeek,
      availability: availableSlots,
    }
  }

  async updateSettings(settingsData: any) {
    let settings = await this.settingsModel.findOne()

    if (!settings) {
      settings = new this.settingsModel(settingsData)
    } else {
      Object.assign(settings, settingsData)
    }

    await settings.save()
    return settings
  }

  async getSettings() {
    let settings = await this.settingsModel.findOne()

    if (!settings) {
      settings = new this.settingsModel({
        physicalConsultationFee: 5000,
        virtualConsultationFee: 3000,
        clinicLocation: "Lagos, Nigeria",
        clinicLatitude: 6.5244,
        clinicLongitude: 3.3792,
        contactEmail: "info.doctordey@gmail.com",
        contactPhone: "+2348034080064",
      })
      await settings.save()
    }

    return settings
  }

  async exportTransactions() {
    return this.transactionModel.find().lean()
  }

  async exportAppointments() {
    return this.appointmentModel
      .find()
      .populate("userId", "name email phone")
      .populate("doctorId", "name email specialization")
      .populate("planId", "name consultationType duration price")
      .lean()
  }
}