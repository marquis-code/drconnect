// import { Injectable } from "@nestjs/common"
// import { PassportStrategy } from "@nestjs/passport"
// import { Strategy, type VerifyCallback } from "passport-google-oauth20"
// import { googleOAuthConfig } from "src/config/google-oauth.config"

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     super({
//       clientID: googleOAuthConfig.clientID,
//       clientSecret: googleOAuthConfig.clientSecret,
//       callbackURL: googleOAuthConfig.callbackURL,
//     })
//   }

//   async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
//     const { name, emails, photos } = profile
//     const user = {
//       email: emails[0].value,
//       firstName: name.givenName,
//       lastName: name.familyName,
//       picture: photos[0].value,
//       googleId: profile.id,
//       accessToken,
//     }
//     done(null, user)
//   }
// }


import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy, type VerifyCallback } from "passport-google-oauth20"

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    const clientID = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const callbackURL = process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/auth/google/callback"

    if (!clientID || !clientSecret) {
      throw new InternalServerErrorException("Google OAuth credentials are not configured")
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ["email", "profile"],
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      googleId: profile.id,
      accessToken,
    }
    done(null, user)
  }
}