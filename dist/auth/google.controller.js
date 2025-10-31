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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let GoogleAuthController = class GoogleAuthController {
    async googleCallback(code) {
        var _a, _b;
        try {
            const url = "https://oauth2.googleapis.com/token";
            const { data } = await axios_1.default.post(url, {
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_CALLBACK_URL,
                grant_type: "authorization_code",
            }, { headers: { "Content-Type": "application/json" } });
            console.log("✅ GOOGLE TOKENS:", data);
            return {
                message: "Google OAuth success",
                tokens: data,
            };
        }
        catch (err) {
            console.error("❌ Google OAuth Error:", ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
            return ((_b = err.response) === null || _b === void 0 ? void 0 : _b.data) || err.message;
        }
    }
};
exports.GoogleAuthController = GoogleAuthController;
__decorate([
    (0, common_1.Get)("callback"),
    __param(0, (0, common_1.Query)("code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GoogleAuthController.prototype, "googleCallback", null);
exports.GoogleAuthController = GoogleAuthController = __decorate([
    (0, common_1.Controller)("auth/google")
], GoogleAuthController);
//# sourceMappingURL=google.controller.js.map