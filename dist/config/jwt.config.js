"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
const jwtConfig = () => ({
    secret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
    signOptions: { expiresIn: "24h" },
});
exports.jwtConfig = jwtConfig;
//# sourceMappingURL=jwt.config.js.map