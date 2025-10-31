export declare class InitiatePaymentDto {
    appointmentId: string;
    amount: number;
    paymentMethod: string;
    email: string;
    phone: string;
    address: string;
    customerName: string;
    bvn?: string;
    redirectUrl?: string;
    description?: string;
}
