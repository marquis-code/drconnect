interface MonoPaymentInitData {
    amount: number;
    type: string;
    method: string;
    description: string;
    reference: string;
    redirect_url: string;
    customer: {
        email: string;
        phone: string;
        address: string;
        name: string;
        identity: {
            type: string;
            number: string;
        };
    };
    meta?: Record<string, any>;
}
export declare class MonoService {
    private baseUrl;
    private secretKey;
    initializePayment(data: MonoPaymentInitData): Promise<{
        status: string;
        data: any;
    }>;
    verifyPayment(reference: string): Promise<{
        status: string;
        reference: any;
        amount: any;
        data: any;
    }>;
    getTransactionHistory(page?: number, startDate?: string, endDate?: string, status?: string): Promise<{
        status: string;
        data: any;
    }>;
    getPaymentStatus(reference: string): Promise<{
        status: any;
        reference: any;
        amount: any;
        data: any;
    }>;
}
export {};
