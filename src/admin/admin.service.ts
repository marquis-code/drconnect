import { Injectable, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { User } from "src/schemas/user.schema"
import { Appointment } from "src/schemas/appointment.schema"
import { Transaction } from "src/schemas/transaction.schema"
import { Availability } from "src/schemas/availability.schema"
import { Settings } from "src/schemas/settings.schema"

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
    const totalUsers = await this.userModel.countDocuments({ role: "user" })
    const totalAppointments = await this.appointmentModel.countDocuments()
    const completedAppointments = await this.appointmentModel.countDocuments({ status: "completed" })
    const totalRevenue = await this.transactionModel.aggregate([
      { $match: { paymentStatus: "successful" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    return {
      totalUsers,
      totalAppointments,
      completedAppointments,
      totalRevenue: totalRevenue[0]?.total || 0,
    }
  }

  async getAllUsers(filter?: any) {
    const query = filter || { role: "user" }
    return this.userModel.find(query).select("-password -resetToken")
  }

  async getAllAppointments(filter?: any) {
    const query = filter || {}
    return this.appointmentModel.find(query).populate("userId", "name email phone")
  }

  async getAppointmentsByStatus(status: string) {
    return this.appointmentModel.find({ status }).populate("userId", "name email phone")
  }

  async getAllTransactions() {
    return this.transactionModel.find().populate("userId", "name email").populate("appointmentId")
  }

  async setAvailability(availabilityData: any) {
    const { dayOfWeek, timeSlots, consultationType } = availabilityData

    const existingAvailability = await this.availabilityModel.findOne({
      dayOfWeek,
      consultationType,
    })

    if (existingAvailability) {
      existingAvailability.timeSlots = timeSlots
      await existingAvailability.save()
      return existingAvailability
    }

    const availability = new this.availabilityModel({
      dayOfWeek,
      timeSlots,
      consultationType,
      isAvailable: true,
    })

    await availability.save()
    return availability
  }

  async getAvailability() {
    return this.availabilityModel.find()
  }

  async getAvailabilityByDate(
    dateString?: string, 
    timeString?: string, 
    consultationType?: string
  ) {
    // Use provided date or default to current date
    const targetDate = dateString ? new Date(dateString) : new Date()
    
    // Get the day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = targetDate.getDay()

    // Build query for availability
    const availabilityQuery: any = {
      dayOfWeek,
      isAvailable: true,
    }

    // Add consultation type filter if provided
    if (consultationType) {
      if (!['physical', 'virtual'].includes(consultationType)) {
        throw new BadRequestException('Invalid consultation type. Must be "physical" or "virtual"')
      }
      availabilityQuery.consultationType = consultationType
    }

    // Fetch availability for that specific day
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
      status: { $ne: "canceled" },
    }

    // Add time filter if provided
    if (timeString) {
      appointmentQuery.timeSlot = timeString
    }

    const bookedAppointments = await this.appointmentModel.find(appointmentQuery)

    // Map to extract booked time slots and consultation types
    const bookedSlots = bookedAppointments.map(apt => ({
      timeSlot: apt.timeSlot,
      consultationType: apt.consultationType,
    }))

    // If specific time is requested, check if it's available
    if (timeString) {
      const timeAvailability = availability.map(avail => {
        const timeSlot = avail.timeSlots.find(slot => slot.startTime === timeString)
        
        if (!timeSlot) {
          return {
            consultationType: avail.consultationType,
            isAvailable: false,
            reason: 'Time slot not in schedule',
          }
        }

        const isBooked = bookedSlots.some(
          booked =>
            booked.timeSlot === timeString &&
            booked.consultationType === avail.consultationType
        )

        return {
          consultationType: avail.consultationType,
          time: timeString,
          timeSlot,
          isAvailable: !isBooked,
          reason: isBooked ? 'Already booked' : null,
        }
      })

      return {
        date: targetDate.toISOString().split('T')[0],
        dayOfWeek,
        time: timeString,
        availability: timeAvailability,
      }
    }

    // Filter out booked slots from available slots (when no specific time requested)
    const availableSlots = availability.map(avail => {
      const availableTimeSlots = avail.timeSlots.map(slot => {
        const isBooked = bookedSlots.some(
          booked =>
            booked.timeSlot === slot.startTime &&
            booked.consultationType === avail.consultationType
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
        consultationType: avail.consultationType,
        isAvailable: avail.isAvailable,
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
        contactEmail: "contact@drconnect.com",
        contactPhone: "+234800000000",
      })
      await settings.save()
    }

    return settings
  }

  async exportTransactions() {
    return this.transactionModel.find().lean()
  }

  async exportAppointments() {
    return this.appointmentModel.find().lean()
  }
}