import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import { User } from "src/schemas/user.schema";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { NotificationService } from "../notifications/notification.service";
export declare class AuthService {
    private userModel;
    private jwtService;
    private notificationService;
    constructor(userModel: Model<User>, jwtService: JwtService, notificationService: NotificationService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        userId: unknown;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: unknown;
            name: string;
            email: string;
            role: string;
        };
    }>;
    googleLogin(profile: any): Promise<{
        access_token: string;
        user: {
            id: unknown;
            name: string;
            email: string;
            role: string;
        };
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateProfile(userId: string, updateData: any): Promise<import("mongoose").Document<unknown, {}, User, {}, {}> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
