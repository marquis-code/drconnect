import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { PaymentsService } from "./payments.service";
import { InitiatePaymentDto } from "./dto/initiate-payment.dto";
export declare class PaymentsController {
    private paymentsService;
    private configService;
    private readonly logger;
    constructor(paymentsService: PaymentsService, configService: ConfigService);
    initiatePayment(initiatePaymentDto: InitiatePaymentDto, user: any): Promise<any>;
    paystackCallback(reference: string, trxref: string, res: Response): Promise<void>;
    monoCallback(reference: string, res: Response): Promise<void>;
    verifyPayment(reference: string, method: string): Promise<{
        status: string;
        message: string;
        appointment: import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
        transaction: import("mongoose").Document<unknown, {}, import("../schemas/transaction.schema").Transaction, {}, {}> & import("../schemas/transaction.schema").Transaction & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
        alreadyProcessed: boolean;
        meetLink?: undefined;
    } | {
        status: string;
        message: string;
        appointment: import("mongoose").Document<unknown, {}, import("../schemas/appointment.schema").Appointment, {}, {}> & import("../schemas/appointment.schema").Appointment & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
        transaction: import("mongoose").Document<unknown, {}, import("../schemas/transaction.schema").Transaction, {}, {}> & import("../schemas/transaction.schema").Transaction & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
        meetLink: any;
        alreadyProcessed?: undefined;
    } | {
        status: string;
        message: any;
        transaction: import("mongoose").Document<unknown, {}, import("../schemas/transaction.schema").Transaction, {}, {}> & import("../schemas/transaction.schema").Transaction & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
        appointment?: undefined;
        alreadyProcessed?: undefined;
        meetLink?: undefined;
    }>;
    getTransactionHistory(user: any): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/transaction.schema").Transaction, {}, {}> & import("../schemas/transaction.schema").Transaction & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getAllTransactions(): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/transaction.schema").Transaction, {}, {}> & import("../schemas/transaction.schema").Transaction & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getMonoTransactionHistory(page?: number, startDate?: string, endDate?: string): Promise<{
        status: string;
        data: any;
    }>;
    getTransactionById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/transaction.schema").Transaction, {}, {}> & import("../schemas/transaction.schema").Transaction & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
