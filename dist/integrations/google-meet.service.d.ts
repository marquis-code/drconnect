import { ConfigService } from "@nestjs/config";
export declare class GoogleMeetService {
    private configService;
    private readonly logger;
    private readonly clientId;
    private readonly clientSecret;
    private readonly refreshToken;
    constructor(configService: ConfigService);
    private getAccessToken;
    generateMeetLink(date: string, timeSlot: string): Promise<string>;
}
