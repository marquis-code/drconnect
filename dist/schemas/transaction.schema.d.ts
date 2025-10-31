import { Document, Types, Schema as MongooseSchema } from "mongoose";
export declare class Transaction extends Document {
    userId: Types.ObjectId;
    appointmentId: Types.ObjectId;
    amount: number;
    paymentMethod: string;
    transactionRef: string;
    paymentStatus: string;
    paystackReference: string | null;
    monoReference: string | null;
    metadata: Record<string, any> | null;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const TransactionSchema: MongooseSchema<Transaction, import("mongoose").Model<Transaction, any, any, any, Document<unknown, any, Transaction, any, {}> & Transaction & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Transaction, Document<unknown, {}, import("mongoose").FlatRecord<Transaction>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Transaction> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
