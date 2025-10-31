import { Document } from "mongoose";
export declare class User extends Document {
    name: string;
    email: string;
    phone: string;
    password: string | null;
    authProvider: string;
    googleId?: string;
    role: string;
    emailVerified: boolean;
    verificationToken: string | null;
    resetToken: string | null;
    resetTokenExpiry: Date | null;
    profilePicture: string | null;
    bio: string | null;
    isActive: boolean;
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
