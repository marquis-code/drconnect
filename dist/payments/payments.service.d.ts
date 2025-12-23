import { type Model } from "mongoose";
import { Transaction } from "src/schemas/transaction.schema";
import { Appointment } from "src/schemas/appointment.schema";
import { User } from "src/schemas/user.schema";
import { InitiatePaymentDto } from "./dto/initiate-payment.dto";
import { PaystackService } from "src/integrations/paystack.service";
import { MonoService } from "src/integrations/mono.service";
import { AppointmentsService } from "src/appointments/appointments.service";
export declare class PaymentsService {
    private transactionModel;
    private appointmentModel;
    private userModel;
    private paystackService;
    private monoService;
    private appointmentsService;
    constructor(transactionModel: Model<Transaction>, appointmentModel: Model<Appointment>, userModel: Model<User>, paystackService: PaystackService, monoService: MonoService, appointmentsService: AppointmentsService);
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
        alreadyProcessed: boolean;
        meetLink?: undefined;
    } | {
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
        meetLink: any;
        alreadyProcessed?: undefined;
    } | {
        status: string;
        message: any;
        transaction: import("mongoose").Document<unknown, {}, Transaction, {}, {}> & Transaction & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
        appointment?: undefined;
        alreadyProcessed?: undefined;
        meetLink?: undefined;
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
