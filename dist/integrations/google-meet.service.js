"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var GoogleMeetService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleMeetService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let GoogleMeetService = GoogleMeetService_1 = class GoogleMeetService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(GoogleMeetService_1.name);
        this.clientId = this.configService.get('GOOGLE_CLIENT_ID');
        this.clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
        this.refreshToken = this.configService.get('GOOGLE_REFRESH_TOKEN');
        if (!this.clientId || !this.clientSecret || !this.refreshToken) {
            this.logger.error('Missing required Google OAuth credentials');
            throw new Error('Google OAuth credentials are not properly configured');
        }
        this.logger.log('Google Meet Service initialized successfully');
    }
    async getAccessToken() {
        var _a, _b, _c;
        try {
            const url = "https://oauth2.googleapis.com/token";
            const params = new URLSearchParams({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                refresh_token: this.refreshToken,
                grant_type: "refresh_token",
            });
            this.logger.debug('Requesting new access token from Google');
            const res = await axios_1.default.post(url, params.toString(), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            });
            this.logger.debug('Access token obtained successfully');
            return res.data.access_token;
        }
        catch (error) {
            this.logger.error('Failed to get access token:', ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            if (((_c = (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error) === 'invalid_grant') {
                throw new Error('Invalid refresh token. Please regenerate your Google OAuth credentials.');
            }
            throw new Error(`Failed to obtain access token: ${error.message}`);
        }
    }
    async generateMeetLink(date, timeSlot) {
        var _a, _b, _c, _d, _e, _f;
        try {
            this.logger.log(`Generating Google Meet link for ${date} at ${timeSlot}`);
            const accessToken = await this.getAccessToken();
            const [startTime, endTime] = timeSlot.split(" - ");
            if (!startTime || !endTime) {
                throw new Error(`Invalid time slot format: ${timeSlot}. Expected format: "HH:MM - HH:MM"`);
            }
            const event = {
                summary: "Doctor Dey Consultation",
                description: "Online medical consultation via Doctor Dey",
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
                        requestId: `doctordey-${Date.now()}`,
                        conferenceSolutionKey: {
                            type: "hangoutsMeet"
                        },
                    },
                },
            };
            this.logger.debug('Creating calendar event with conference data');
            const response = await axios_1.default.post("https://www.googleapis.com/calendar/v3/calendars/primary/events", event, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                params: {
                    conferenceDataVersion: 1,
                    sendUpdates: 'none'
                },
            });
            const meetLink = (_c = (_b = (_a = response.data.conferenceData) === null || _a === void 0 ? void 0 : _a.entryPoints) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.uri;
            if (!meetLink) {
                this.logger.error('No Meet link in response:', response.data);
                throw new Error('Google Calendar event created but no Meet link was generated');
            }
            this.logger.log(`✅ Google Meet link generated successfully: ${meetLink}`);
            return meetLink;
        }
        catch (error) {
            this.logger.error("❌ Error generating Google Meet link:", ((_d = error === null || error === void 0 ? void 0 : error.response) === null || _d === void 0 ? void 0 : _d.data) || error.message);
            if (((_e = error === null || error === void 0 ? void 0 : error.response) === null || _e === void 0 ? void 0 : _e.status) === 401) {
                throw new Error('Authentication failed. Please check your Google OAuth credentials.');
            }
            if (((_f = error === null || error === void 0 ? void 0 : error.response) === null || _f === void 0 ? void 0 : _f.status) === 403) {
                throw new Error('Insufficient permissions. Ensure Google Calendar API is enabled.');
            }
            throw new Error(`Failed to generate Google Meet link: ${error.message}`);
        }
    }
};
exports.GoogleMeetService = GoogleMeetService;
exports.GoogleMeetService = GoogleMeetService = GoogleMeetService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GoogleMeetService);
//# sourceMappingURL=google-meet.service.js.map