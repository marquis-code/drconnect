export declare enum UserRole {
    USER = "user",
    PATIENT = "patient",
    DOCTOR = "doctor",
    ADMIN = "admin"
}
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: UserRole;
    specialization?: string;
    licenseNumber?: string;
    qualification?: string;
    bio?: string;
}
