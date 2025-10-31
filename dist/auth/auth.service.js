"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
const notification_service_1 = require("../notifications/notification.service");
const crypto = __importStar(require("crypto"));
let AuthService = class AuthService {
    constructor(userModel, jwtService, notificationService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.notificationService = notificationService;
    }
    async register(registerDto) {
        const { email, password, name, phone } = registerDto;
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new common_1.ConflictException("Email already registered");
        }
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const user = new this.userModel({
            name,
            email,
            phone,
            password,
            verificationToken,
            authProvider: "email",
        });
        await user.save();
        return {
            message: "Registration successful. Please verify your email.",
            userId: user._id,
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        if (!user.emailVerified) {
            throw new common_1.BadRequestException("Please verify your email first");
        }
        const token = this.jwtService.sign({
            sub: user._id,
            email: user.email,
            role: user.role,
        });
        return {
            access_token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
    async googleLogin(profile) {
        let user = await this.userModel.findOne({ googleId: profile.googleId });
        if (!user) {
            user = new this.userModel({
                name: `${profile.firstName} ${profile.lastName}`,
                email: profile.email,
                phone: "",
                googleId: profile.googleId,
                authProvider: "google",
                emailVerified: true,
                profilePicture: profile.picture,
            });
            await user.save();
        }
        const token = this.jwtService.sign({
            sub: user._id,
            email: user.email,
            role: user.role,
        });
        return {
            access_token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
    async verifyEmail(token) {
        const user = await this.userModel.findOne({ verificationToken: token });
        if (!user) {
            throw new common_1.BadRequestException("Invalid verification token");
        }
        user.emailVerified = true;
        user.verificationToken = null;
        await user.save();
        return { message: "Email verified successfully" };
    }
    async forgotPassword(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.BadRequestException("User not found");
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpiry = new Date(Date.now() + 3600000);
        await user.save();
        await this.notificationService.sendPasswordResetEmail(email, resetToken);
        return { message: "Password reset email sent" };
    }
    async resetPassword(resetPasswordDto) {
        const { token, newPassword } = resetPasswordDto;
        const user = await this.userModel.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() },
        });
        if (!user) {
            throw new common_1.BadRequestException("Invalid or expired reset token");
        }
        user.password = newPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();
        return { message: "Password reset successfully" };
    }
    async getProfile(userId) {
        const user = await this.userModel.findById(userId).select("-password -resetToken");
        if (!user) {
            throw new common_1.BadRequestException("User not found");
        }
        return user;
    }
    async updateProfile(userId, updateData) {
        const user = await this.userModel.findByIdAndUpdate(userId, updateData, { new: true });
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        notification_service_1.NotificationService])
], AuthService);
//# sourceMappingURL=auth.service.js.map