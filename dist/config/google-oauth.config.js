"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleOAuthConfig = void 0;
exports.googleOAuthConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3001/auth/google/callback",
};
//# sourceMappingURL=google-oauth.config.js.map