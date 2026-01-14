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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
        const { email, password, name, phone, role, specialization, licenseNumber, qualification, bio } = registerDto;
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new common_1.ConflictException("Email already registered");
        }
        if (role === user_schema_1.UserRole.DOCTOR) {
            if (!specialization || !licenseNumber) {
                throw new common_1.BadRequestException("Specialization and license number are required for doctor registration");
            }
        }
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const user = new this.userModel({
            name,
            email,
            phone,
            password,
            verificationToken,
            authProvider: user_schema_1.AuthProvider.EMAIL,
            role: role !== null && role !== void 0 ? role : user_schema_1.UserRole.PATIENT,
            specialization,
            licenseNumber,
            qualification,
            bio,
            emailVerified: false,
        });
        await user.save();
        try {
            await this.notificationService.sendVerificationEmail(email, verificationToken);
        }
        catch (error) {
            console.error("Failed to send verification email:", error);
        }
        return {
            message: "Registration successful. Please verify your email.",
            userId: user._id,
            role: user.role,
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
                specialization: user.specialization,
                profilePicture: user.profilePicture,
            },
        };
    }
    async googleLogin(profile) {
        let user = await this.userModel.findOne({ googleId: profile.googleId });
        if (!user) {
            user = await this.userModel.findOne({ email: profile.email });
            if (user) {
                user.googleId = profile.googleId;
                user.authProvider = user_schema_1.AuthProvider.GOOGLE;
                user.profilePicture = profile.picture;
                user.emailVerified = true;
            }
            else {
                user = new this.userModel({
                    name: `${profile.firstName} ${profile.lastName}`,
                    email: profile.email,
                    phone: "",
                    googleId: profile.googleId,
                    authProvider: user_schema_1.AuthProvider.GOOGLE,
                    emailVerified: true,
                    profilePicture: profile.picture,
                    role: user_schema_1.UserRole.PATIENT,
                });
            }
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
                specialization: user.specialization,
                profilePicture: user.profilePicture,
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
        return {
            message: "Email verified successfully",
            userId: user._id
        };
    }
    async resendVerificationEmail(email) {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.BadRequestException("User not found");
        }
        if (user.emailVerified) {
            throw new common_1.BadRequestException("Email is already verified");
        }
        const verificationToken = crypto.randomBytes(32).toString("hex");
        user.verificationToken = verificationToken;
        await user.save();
        await this.notificationService.sendVerificationEmail(email, verificationToken);
        return { message: "Verification email sent" };
    }
    async forgotPassword(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            return { message: "If that email exists, a password reset link has been sent" };
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpiry = new Date(Date.now() + 3600000);
        await user.save();
        try {
            await this.notificationService.sendPasswordResetEmail(email, resetToken);
        }
        catch (error) {
            console.error("Failed to send password reset email:", error);
        }
        return { message: "If that email exists, a password reset link has been sent" };
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
        const user = await this.userModel
            .findById(userId)
            .select("-password -resetToken -resetTokenExpiry -verificationToken");
        if (!user) {
            throw new common_1.BadRequestException("User not found");
        }
        return user;
    }
    async updateProfile(userId, updateData) {
        const { email } = updateData, safeUpdateData = __rest(updateData, ["email"]);
        if (email) {
            const existingUser = await this.userModel.findOne({
                email,
                _id: { $ne: userId }
            });
            if (existingUser) {
                throw new common_1.ConflictException("Email already in use");
            }
            const verificationToken = crypto.randomBytes(32).toString("hex");
            safeUpdateData['emailVerified'] = false;
            safeUpdateData['verificationToken'] = verificationToken;
            safeUpdateData['email'] = email;
            try {
                await this.notificationService.sendVerificationEmail(email, verificationToken);
            }
            catch (error) {
                console.error("Failed to send verification email:", error);
            }
        }
        const user = await this.userModel.findByIdAndUpdate(userId, safeUpdateData, { new: true }).select("-password -resetToken -resetTokenExpiry -verificationToken");
        if (!user) {
            throw new common_1.BadRequestException("User not found");
        }
        return user;
    }
    async getAllDoctors() {
        return this.userModel
            .find({ role: "doctor" })
            .select("-password -resetToken -resetTokenExpiry -verificationToken")
            .sort({ name: 1 });
    }
    async getDoctorById(doctorId) {
        const doctor = await this.userModel
            .findOne({ _id: doctorId, role: "doctor" })
            .select("-password -resetToken -resetTokenExpiry -verificationToken");
        if (!doctor) {
            throw new common_1.BadRequestException("Doctor not found");
        }
        return doctor;
    }
    async searchDoctors(query, specialization) {
        const filter = { role: "doctor" };
        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: "i" } },
                { specialization: { $regex: query, $options: "i" } },
                { bio: { $regex: query, $options: "i" } }
            ];
        }
        if (specialization) {
            filter.specialization = { $regex: specialization, $options: "i" };
        }
        return this.userModel
            .find(filter)
            .select("-password -resetToken -resetTokenExpiry -verificationToken")
            .sort({ name: 1 });
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