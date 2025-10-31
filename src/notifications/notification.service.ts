import { Injectable } from "@nestjs/common"
import * as nodemailer from "nodemailer"
import { Twilio } from "twilio"

@Injectable()
export class NotificationService {
  private emailTransporter: nodemailer.Transporter
  private twilioClient: Twilio

  constructor() {
    // Initialize SendGrid transporter
    this.emailTransporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    })

    // Initialize Twilio
    this.twilioClient = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Verify Your DrConnect Account",
      html: `
        <h2>Welcome to DrConnect</h2>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>This link expires in 24 hours.</p>
      `,
    }

    await this.emailTransporter.sendMail(mailOptions)
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Reset Your DrConnect Password",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
      `,
    }

    await this.emailTransporter.sendMail(mailOptions)
  }

  async sendBookingConfirmation(email: string, appointmentData: any) {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Booking Confirmation - DrConnect",
      html: `
        <h2>Your Appointment is Confirmed</h2>
        <p><strong>Type:</strong> ${appointmentData.consultationType}</p>
        <p><strong>Date:</strong> ${appointmentData.date}</p>
        <p><strong>Time:</strong> ${appointmentData.timeSlot}</p>
        <p><strong>Price:</strong> ${appointmentData.price}</p>
        ${appointmentData.googleMeetLink ? `<p><strong>Meeting Link:</strong> <a href="${appointmentData.googleMeetLink}">Join Meeting</a></p>` : ""}
        ${appointmentData.location ? `<p><strong>Location:</strong> ${appointmentData.location}</p>` : ""}
      `,
    }

    await this.emailTransporter.sendMail(mailOptions)
  }

  async sendPaymentConfirmation(email: string, transactionData: any) {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Payment Confirmation - DrConnect",
      html: `
        <h2>Payment Received</h2>
        <p><strong>Amount:</strong> ${transactionData.amount}</p>
        <p><strong>Reference:</strong> ${transactionData.transactionRef}</p>
        <p><strong>Status:</strong> ${transactionData.paymentStatus}</p>
        <p>Thank you for your payment!</p>
      `,
    }

    await this.emailTransporter.sendMail(mailOptions)
  }

  async sendAppointmentReminder(email: string, appointmentData: any) {
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Appointment Reminder - DrConnect",
      html: `
        <h2>Appointment Reminder</h2>
        <p>Your appointment is scheduled for tomorrow at ${appointmentData.timeSlot}</p>
        <p><strong>Type:</strong> ${appointmentData.consultationType}</p>
        ${appointmentData.googleMeetLink ? `<p><strong>Meeting Link:</strong> <a href="${appointmentData.googleMeetLink}">Join Meeting</a></p>` : ""}
      `,
    }

    await this.emailTransporter.sendMail(mailOptions)
  }

  async sendSMS(phoneNumber: string, message: string) {
    await this.twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    })
  }

  async sendBookingConfirmationSMS(phoneNumber: string, appointmentData: any) {
    const message = `Your appointment is confirmed for ${appointmentData.date} at ${appointmentData.timeSlot}. Amount: ${appointmentData.price}. Thank you!`
    await this.sendSMS(phoneNumber, message)
  }

  async sendAppointmentReminderSMS(phoneNumber: string, appointmentData: any) {
    const message = `Reminder: Your appointment is tomorrow at ${appointmentData.timeSlot}. See you soon!`
    await this.sendSMS(phoneNumber, message)
  }
}
