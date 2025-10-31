"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleMeetService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let GoogleMeetService = class GoogleMeetService {
    constructor() {
        this.clientId = process.env.GOOGLE_CLIENT_ID;
        this.clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        this.refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    }
    async getAccessToken() {
        const url = "https://oauth2.googleapis.com/token";
        const data = {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            refresh_token: this.refreshToken,
            grant_type: "refresh_token",
        };
        const res = await axios_1.default.post(url, data, {
            headers: { "Content-Type": "application/json" },
        });
        return res.data.access_token;
    }
    async generateMeetLink(date, timeSlot) {
        var _a;
        try {
            const accessToken = await this.getAccessToken();
            const [startTime, endTime] = timeSlot.split(" - ");
            const event = {
                summary: "DrConnect Consultation",
                start: {
                    dateTime: `${date}T${startTime}:00`,
                    timeZone: "Africa/Lagos",
                },
                end: {
                    dateTime: `${date}T${endTime}:00`,
                    timeZone: "Africa/Lagos",
                },
                conferenceData: {
                    createRequest: {
                        requestId: `${Date.now()}`,
                        conferenceSolutionKey: {
                            type: "hangoutsMeet"
                        },
                    },
                },
            };
            const response = await axios_1.default.post("https://www.googleapis.com/calendar/v3/calendars/primary/events", event, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                params: { conferenceDataVersion: 1 },
            });
            return response.data.conferenceData.entryPoints[0].uri;
        }
        catch (error) {
            console.error("❌ Error generating Google Meet link:", ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error);
            throw new Error("Failed to generate Google Meet link");
        }
    }
};
exports.GoogleMeetService = GoogleMeetService;
exports.GoogleMeetService = GoogleMeetService = __decorate([
    (0, common_1.Injectable)()
], GoogleMeetService);
//# sourceMappingURL=google-meet.service.js.map