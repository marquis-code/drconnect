export declare class PaystackService {
    private baseUrl;
    private secretKey;
    initializePayment(data: {
        email: string;
        amount: number;
        reference: string;
        callback_url?: string;
        metadata?: any;
    }): Promise<any>;
    verifyPayment(reference: string): Promise<any>;
    getPaymentDetails(reference: string): Promise<any>;
}
