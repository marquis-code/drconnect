import { Document } from "mongoose";
export declare enum UserRole {
    USER = "user",
    PATIENT = "patient",
    DOCTOR = "doctor",
    ADMIN = "admin"
}
export declare enum AuthProvider {
    EMAIL = "email",
    GOOGLE = "google"
}
export declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}
export declare class User extends Document {
    name: string;
    email: string;
    phone: string;
    password: string | null;
    authProvider: AuthProvider;
    googleId?: string;
    role: UserRole;
    emailVerified: boolean;
    verificationToken: string | null;
    resetToken: string | null;
    resetTokenExpiry: Date | null;
    profilePicture: string | null;
    bio: string | null;
    address: string | null;
    dateOfBirth: Date | null;
    gender: Gender | null;
    languages: string[];
    specialization: string | null;
    licenseNumber: string | null;
    qualification: string | null;
    yearsOfExperience: number | null;
    hospitalAffiliation: string | null;
    consultationFee: number | null;
    certifications: string[];
    awards: string[];
    bloodGroup: string | null;
    allergies: string[];
    chronicConditions: string[];
    currentMedications: string[];
    emergencyContactName: string | null;
    emergencyContactPhone: string | null;
    insuranceProvider: string | null;
    insurancePolicyNumber: string | null;
    averageRating: number;
    totalReviews: number;
    totalConsultations: number;
    isActive: boolean;
    isVerified: boolean;
    verifiedAt: Date | null;
    verifiedBy: string | null;
    lastLoginAt: Date | null;
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    metadata: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
    comparePassword: (password: string) => Promise<boolean>;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
