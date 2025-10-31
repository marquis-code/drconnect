import { type Model } from "mongoose";
import { Transaction } from "src/schemas/transaction.schema";
import { Appointment } from "src/schemas/appointment.schema";
import { User } from "src/schemas/user.schema";
import { InitiatePaymentDto } from "./dto/initiate-payment.dto";
import { PaystackService } from "src/integrations/paystack.service";
import { MonoService } from "src/integrations/mono.service";
import { NotificationService } from "src/notifications/notification.service";
export declare class PaymentsService {
    private transactionModel;
    private appointmentModel;
    private userModel;
    private paystackService;
    private monoService;
    private notificationService;
    constructor(transactionModel: Model<Transaction>, appointmentModel: Model<Appointment>, userModel: Model<User>, paystackService: PaystackService, monoService: MonoService, notificationService: NotificationService);
    initiatePayment(userId: string, initiatePaymentDto: InitiatePaymentDto): Promise<any>;
    verifyPayment(transactionRef: string, paymentMethod: string): Promise<{
        status: string;
        message: string;
        appointment: import("mongoose").Document<unknown, {}, Appointment, {}, {}> & Appointment & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
        transaction: import("mongoose").Document<unknown, {}, Transaction, {}, {}> & Transaction & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    } | {
        status: string;
        message: string;
        transaction: import("mongoose").Document<unknown, {}, Transaction, {}, {}> & Transaction & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
        appointment?: undefined;
    }>;
    getTransactionHistory(userId: string): Promise<(import("mongoose").Document<unknown, {}, Transaction, {}, {}> & Transaction & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAllTransactions(): Promise<(import("mongoose").Document<unknown, {}, Transaction, {}, {}> & Transaction & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getTransactionById(transactionId: string): Promise<import("mongoose").Document<unknown, {}, Transaction, {}, {}> & Transaction & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getMonoTransactionHistory(page?: number, startDate?: string, endDate?: string): Promise<{
        status: string;
        data: any;
    }>;
}
