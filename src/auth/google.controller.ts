import { Controller, Get, Query } from "@nestjs/common";
import axios from "axios";

@Controller("auth/google")
export class GoogleAuthController {
  @Get("callback")
  async googleCallback(@Query("code") code: string) {
    try {
      const url = "https://oauth2.googleapis.com/token";

      const { data } = await axios.post(
        url,
        {
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_CALLBACK_URL,
          grant_type: "authorization_code",
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ GOOGLE TOKENS:", data);

      return {
        message: "Google OAuth success",
        tokens: data,
      };
    } catch (err) {
      console.error("❌ Google OAuth Error:", err.response?.data || err.message);
      return err.response?.data || err.message;
    }
  }
}
