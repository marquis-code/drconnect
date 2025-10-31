export declare class PaystackService {
    private baseUrl;
    private secretKey;
    initializePayment(data: any): Promise<any>;
    verifyPayment(reference: string): Promise<any>;
    getPaymentDetails(reference: string): Promise<any>;
}
