
import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class GoogleMeetService {
  private clientId = process.env.GOOGLE_CLIENT_ID;
  private clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  private refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  private async getAccessToken(): Promise<string> {
    const url = "https://oauth2.googleapis.com/token";

    const data = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: this.refreshToken,
      grant_type: "refresh_token",
    };

    const res = await axios.post(url, data, {
      headers: { "Content-Type": "application/json" },
    });

    return res.data.access_token;
  }

  // async generateMeetLink(): Promise<string> {
  //   try {
  //     const accessToken = await this.getAccessToken();

  //     const response = await axios.post(
  //       "https://www.googleapis.com/calendar/v3/calendars/primary/events",
  //       {
  //         summary: "DrConnect Consultation",
  //         conferenceData: {
  //           createRequest: {
  //             requestId: `${Date.now()}`,
  //             conferenceSolutionKey: {
  //               key: "hangoutsMeet",
  //             },
  //           },
  //         },
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           "Content-Type": "application/json",
  //         },
  //         params: { conferenceDataVersion: 1 },
  //       },
  //     );

  //     return response.data.conferenceData.entryPoints[0].uri;
  //   } catch (error) {
  //     console.error("❌ Error generating Google Meet link", error?.response?.data || error);
  //     throw new Error("Failed to generate Google Meet link");
  //   }
  // }
  async generateMeetLink(date: string, timeSlot: string): Promise<string> {
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

    const response = await axios.post(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      event,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: { conferenceDataVersion: 1 },
      },
    );

    return response.data.conferenceData.entryPoints[0].uri;

  } catch (error) {
    console.error("❌ Error generating Google Meet link:", error?.response?.data || error);
    throw new Error("Failed to generate Google Meet link");
  }
}

}
