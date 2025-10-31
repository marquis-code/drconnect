export declare class GoogleMeetService {
    private clientId;
    private clientSecret;
    private refreshToken;
    private getAccessToken;
    generateMeetLink(date: string, timeSlot: string): Promise<string>;
}
