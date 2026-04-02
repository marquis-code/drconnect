import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { Request, Response } from "express";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        userId: import("mongoose").Types.ObjectId;
        role: import("../schemas/user.schema").UserRole;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            role: import("../schemas/user.schema").UserRole;
            specialization: string;
            profilePicture: string;
        };
    }>;
    googleAuth(): Promise<void>;
    googleAuthCallback(req: Request, res: Response): Promise<void>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
        userId: import("mongoose").Types.ObjectId;
    }>;
    resendVerification(email: string): Promise<{
        message: string;
    }>;
    getProfile(user: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/user.schema").User, {}, {}> & import("../schemas/user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateProfile(user: any, updateData: UpdateProfileDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/user.schema").User, {}, {}> & import("../schemas/user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllDoctors(): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/user.schema").User, {}, {}> & import("../schemas/user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    searchDoctors(query: string, specialization: string): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/user.schema").User, {}, {}> & import("../schemas/user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getDoctorById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../schemas/user.schema").User, {}, {}> & import("../schemas/user.schema").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
