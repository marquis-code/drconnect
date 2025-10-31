import { Injectable } from "@nestjs/common"
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