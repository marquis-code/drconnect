"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
const twilio_1 = require("twilio");
let NotificationService = class NotificationService {
    constructor() {
        this.emailTransporter = nodemailer.createTransport({
            host: "smtp.sendgrid.net",
            port: 587,
            auth: {
                user: "apikey",
                pass: process.env.SENDGRID_API_KEY,
            },
        });
        this.twilioClient = new twilio_1.Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
    async sendVerificationEmail(email, token) {
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;
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
        };
        await this.emailTransporter.sendMail(mailOptions);
    }
    async sendPasswordResetEmail(email, token) {
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
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
        };
        await this.emailTransporter.sendMail(mailOptions);
    }
    async sendBookingConfirmation(email, appointmentData) {
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
        };
        await this.emailTransporter.sendMail(mailOptions);
    }
    async sendPaymentConfirmation(email, transactionData) {
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
        };
        await this.emailTransporter.sendMail(mailOptions);
    }
    async sendAppointmentReminder(email, appointmentData) {
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
        };
        await this.emailTransporter.sendMail(mailOptions);
    }
    async sendSMS(phoneNumber, message) {
        await this.twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        });
    }
    async sendBookingConfirmationSMS(phoneNumber, appointmentData) {
        const message = `Your appointment is confirmed for ${appointmentData.date} at ${appointmentData.timeSlot}. Amount: ${appointmentData.price}. Thank you!`;
        await this.sendSMS(phoneNumber, message);
    }
    async sendAppointmentReminderSMS(phoneNumber, appointmentData) {
        const message = `Reminder: Your appointment is tomorrow at ${appointmentData.timeSlot}. See you soon!`;
        await this.sendSMS(phoneNumber, message);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], NotificationService);
//# sourceMappingURL=notification.service.js.map