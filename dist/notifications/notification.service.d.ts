export declare class NotificationService {
    private emailTransporter;
    private twilioClient;
    constructor();
    sendVerificationEmail(email: string, token: string): Promise<void>;
    sendPasswordResetEmail(email: string, token: string): Promise<void>;
    sendBookingConfirmation(email: string, appointmentData: any): Promise<void>;
    sendPaymentConfirmation(email: string, transactionData: any): Promise<void>;
    sendAppointmentReminder(email: string, appointmentData: any): Promise<void>;
    sendSMS(phoneNumber: string, message: string): Promise<void>;
    sendBookingConfirmationSMS(phoneNumber: string, appointmentData: any): Promise<void>;
    sendAppointmentReminderSMS(phoneNumber: string, appointmentData: any): Promise<void>;
}
