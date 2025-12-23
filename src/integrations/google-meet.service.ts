// // import { Injectable, Logger } from "@nestjs/common";
// // import { ConfigService } from "@nestjs/config";
// // import { google } from 'googleapis';

// // @Injectable()
// // export class GoogleMeetService {
// //   private readonly logger = new Logger(GoogleMeetService.name);
// //   private calendar;

// //   constructor(private configService: ConfigService) {
// //     const credentials = JSON.parse(
// //       this.configService.get<string>('GOOGLE_SERVICE_ACCOUNT_JSON')
// //     );

// //     const auth = new google.auth.GoogleAuth({
// //       credentials,
// //       scopes: ['https://www.googleapis.com/auth/calendar'],
// //     });

// //     this.calendar = google.calendar({ version: 'v3', auth });
// //     this.logger.log('Google Meet Service initialized successfully');
// //   }

// //   async generateMeetLink(date: string, timeSlot: string): Promise<string> {
// //     try {
// //       this.logger.log(`Generating Google Meet link for ${date} at ${timeSlot}`);
      
// //       const [startTime, endTime] = timeSlot.split(" - ");

// //       if (!startTime || !endTime) {
// //         throw new Error(`Invalid time slot format: ${timeSlot}`);
// //       }

// //       const event = {
// //         summary: "Doctor Dey Consultation",
// //         description: "Online medical consultation via Doctor Dey",
// //         start: {
// //           dateTime: `${date}T${startTime}:00`,
// //           timeZone: "Africa/Lagos",
// //         },
// //         end: {
// //           dateTime: `${date}T${endTime}:00`,
// //           timeZone: "Africa/Lagos",
// //         },
// //         conferenceData: {
// //           createRequest: {
// //             requestId: `doctordey-${Date.now()}`,
// //             conferenceSolutionKey: {
// //               type: "hangoutsMeet"
// //             },
// //           },
// //         },
// //       };

// //       const response = await this.calendar.events.insert({
// //         calendarId: 'primary',
// //         resource: event,
// //         conferenceDataVersion: 1,
// //         sendUpdates: 'none',
// //       });

// //       const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri;

// //       if (!meetLink) {
// //         throw new Error('No Meet link was generated');
// //       }

// //       this.logger.log(`✅ Google Meet link generated: ${meetLink}`);
// //       return meetLink;

// //     } catch (error) {
// //       this.logger.error("❌ Error generating Google Meet link:", error.message);
// //       throw new Error(`Failed to generate Google Meet link: ${error.message}`);
// //     }
// //   }
// // }

// import { Injectable, Logger } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { google } from 'googleapis';

// @Injectable()
// export class GoogleMeetService {
//   private readonly logger = new Logger(GoogleMeetService.name);
//   private calendar;

//   constructor(private configService: ConfigService) {
//     const credentials = JSON.parse(
//       this.configService.get<string>('GOOGLE_SERVICE_ACCOUNT_JSON')
//     );

//     const auth = new google.auth.GoogleAuth({
//       credentials,
//       scopes: ['https://www.googleapis.com/auth/calendar'],
//     });

//     this.calendar = google.calendar({ version: 'v3', auth });
//     this.logger.log('Google Meet Service initialized successfully');
//   }

//   // async generateMeetLink(date: string, timeSlot: string): Promise<string> {
//   //   try {
//   //     this.logger.log(`Generating Google Meet link for ${date} at ${timeSlot}`);
      
//   //     const [startTime, endTime] = timeSlot.split(" - ");

//   //     if (!startTime || !endTime) {
//   //       throw new Error(`Invalid time slot format: ${timeSlot}`);
//   //     }

//   //     const event = {
//   //       summary: "Doctor Dey Consultation",
//   //       description: "Online medical consultation via Doctor Dey",
//   //       start: {
//   //         dateTime: `${date}T${startTime}:00`,
//   //         timeZone: "Africa/Lagos",
//   //       },
//   //       end: {
//   //         dateTime: `${date}T${endTime}:00`,
//   //         timeZone: "Africa/Lagos",
//   //       },
//   //       conferenceData: {
//   //         createRequest: {
//   //           requestId: `doctordey-${Date.now()}`,
//   //           conferenceSolutionKey: {
//   //             type: "hangoutsMeet"
//   //           },
//   //         },
//   //       },
//   //     };

//   //     this.logger.debug('Creating calendar event with conference data');

//   //     const response = await this.calendar.events.insert({
//   //       calendarId: 'info.doctordey@gmail.com', // Use explicit email instead of 'primary'
//   //       resource: event,
//   //       conferenceDataVersion: 1,
//   //       sendUpdates: 'none',
//   //     });

//   //     const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri;

//   //     if (!meetLink) {
//   //       this.logger.error('No Meet link in response:', JSON.stringify(response.data, null, 2));
//   //       throw new Error('Google Calendar event created but no Meet link was generated');
//   //     }

//   //     this.logger.log(`✅ Google Meet link generated: ${meetLink}`);
//   //     return meetLink;

//   //   } catch (error) {
//   //     this.logger.error("❌ Error generating Google Meet link:", error.message);
      
//   //     // Log the full error for debugging
//   //     if (error.response?.data) {
//   //       this.logger.error('API Error Details:', JSON.stringify(error.response.data, null, 2));
//   //     }

//   //     throw new Error(`Failed to generate Google Meet link: ${error.message}`);
//   //   }
//   // }
//   async generateMeetLink(date: string, timeSlot: string): Promise<string> {
//   try {
//     this.logger.log(`Generating Google Meet link for ${date} at ${timeSlot}`);
    
//     const [startTime, endTime] = timeSlot.split(" - ");

//     if (!startTime || !endTime) {
//       throw new Error(`Invalid time slot format: ${timeSlot}`);
//     }

//     // Step 1: Create event without conference data
//     const event = {
//       summary: "Doctor Dey Consultation",
//       description: "Online medical consultation via Doctor Dey",
//       start: {
//         dateTime: `${date}T${startTime}:00`,
//         timeZone: "Africa/Lagos",
//       },
//       end: {
//         dateTime: `${date}T${endTime}:00`,
//         timeZone: "Africa/Lagos",
//       },
//     };

//     this.logger.debug('Creating calendar event');

//     const createResponse = await this.calendar.events.insert({
//       calendarId: 'info.doctordey@gmail.com',
//       resource: event,
//       sendUpdates: 'none',
//     });

//     const eventId = createResponse.data.id;

//     // Step 2: Patch event to add conference data
//     this.logger.debug('Adding Google Meet to event');

//     const patchResponse = await this.calendar.events.patch({
//       calendarId: 'info.doctordey@gmail.com',
//       eventId: eventId,
//       conferenceDataVersion: 1,
//       resource: {
//         conferenceData: {
//           createRequest: {
//             requestId: `doctordey-${Date.now()}`,
//             conferenceSolutionKey: {
//               type: "hangoutsMeet"
//             },
//           },
//         },
//       },
//     });

//     const meetLink = patchResponse.data.conferenceData?.entryPoints?.[0]?.uri;

//     if (!meetLink) {
//       this.logger.error('No Meet link generated');
//       throw new Error('Google Calendar event created but no Meet link was generated');
//     }

//     this.logger.log(`✅ Google Meet link generated: ${meetLink}`);
//     return meetLink;

//   } catch (error) {
//     this.logger.error("❌ Error generating Google Meet link:", error.message);
    
//     if (error.response?.data) {
//       this.logger.error('API Error Details:', JSON.stringify(error.response.data, null, 2));
//     }

//     throw new Error(`Failed to generate Google Meet link: ${error.message}`);
//   }
// }
// }

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

@Injectable()
export class GoogleMeetService {
  private readonly logger = new Logger(GoogleMeetService.name);
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly refreshToken: string;

  constructor(private configService: ConfigService) {
    this.clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    this.refreshToken = this.configService.get<string>('GOOGLE_REFRESH_TOKEN');

    if (!this.clientId || !this.clientSecret || !this.refreshToken) {
      this.logger.error('Missing required Google OAuth credentials');
      throw new Error('Google OAuth credentials are not properly configured');
    }

    this.logger.log('Google Meet Service initialized successfully');
  }

  private async getAccessToken(): Promise<string> {
    try {
      const url = "https://oauth2.googleapis.com/token";

      const params = new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: this.refreshToken,
        grant_type: "refresh_token",
      });

      this.logger.debug('Requesting new access token from Google');

      const res = await axios.post(url, params.toString(), {
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded" 
        },
      });

      this.logger.debug('Access token obtained successfully');
      return res.data.access_token;
    } catch (error) {
      this.logger.error('Failed to get access token:', error?.response?.data || error.message);
      
      if (error?.response?.data?.error === 'invalid_grant') {
        throw new Error(
          'Invalid refresh token. Please regenerate your Google OAuth credentials.'
        );
      }
      
      throw new Error(`Failed to obtain access token: ${error.message}`);
    }
  }

  async generateMeetLink(date: string, timeSlot: string): Promise<string> {
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

      const response = await axios.post(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        event,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          params: { 
            conferenceDataVersion: 1,
            sendUpdates: 'none'
          },
        },
      );

      const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri;

      if (!meetLink) {
        this.logger.error('No Meet link in response:', response.data);
        throw new Error('Google Calendar event created but no Meet link was generated');
      }

      this.logger.log(`✅ Google Meet link generated successfully: ${meetLink}`);
      return meetLink;

    } catch (error) {
      this.logger.error(
        "❌ Error generating Google Meet link:", 
        error?.response?.data || error.message
      );

      if (error?.response?.status === 401) {
        throw new Error('Authentication failed. Please check your Google OAuth credentials.');
      }

      if (error?.response?.status === 403) {
        throw new Error('Insufficient permissions. Ensure Google Calendar API is enabled.');
      }

      throw new Error(`Failed to generate Google Meet link: ${error.message}`);
    }
  }
}