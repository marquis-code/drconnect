import { PaymentsService } from "./payments.service";
import { InitiatePaymentDto } from "./dto/initiate-payment.dto";
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    initiatePayment(initiatePaymentDto: InitiatePaymentDto, user: any): Promise<any>;
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
    } | {
        status: string;
        message: string;
        transaction: import("mongoose").Document<unknown, {}, import("../schemas/transaction.schema").Transaction, {}, {}> & import("../schemas/transaction.schema").Transaction & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
        appointment?: undefined;
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
