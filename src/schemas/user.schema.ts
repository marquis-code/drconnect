// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
// import { Document } from "mongoose";
// import * as bcrypt from "bcryptjs";
// import { isValidPhoneNumber } from 'libphonenumber-js';

// @Schema({ timestamps: true })
// export class User extends Document {
//   @Prop({ required: true })
//   name: string;

//   @Prop({ required: true, unique: true })
//   email: string;

//   @Prop({ 
//     required: true,
//     validate: {
//       validator: function(value: string) {
//         // Validate phone number globally
//         return isValidPhoneNumber(value); // Checks the validity of the phone number globally
//       },
//       message: 'Phone number must be a valid phone number'
//     }
//   })
//   phone: string;

//   @Prop({ type: String, default: null })
//   password: string | null;

//   @Prop({ enum: ["email", "google"], default: "email" })
//   authProvider: string;

//   @Prop({ type: String, unique: true, sparse: true })
//   googleId?: string;

//   @Prop({ enum: ["user", "admin"], default: "user" })
//   role: string;

//   @Prop({ default: true })
//   emailVerified: boolean;

//   @Prop({ type: String, default: null })
//   verificationToken: string | null;

//   @Prop({ type: String, default: null })
//   resetToken: string | null;

//   @Prop({ type: Date, default: null })
//   resetTokenExpiry: Date | null;

//   @Prop({ type: String, default: null })
//   profilePicture: string | null;

//   @Prop({ type: String, default: null })
//   bio: string | null;

//   @Prop({ default: true })
//   isActive: boolean;

//   createdAt?: Date;
//   updatedAt?: Date;

//   // Type declaration for the method (will be added to schema below)
//   comparePassword: (password: string) => Promise<boolean>;
// }

// export const UserSchema = SchemaFactory.createForClass(User);

// // Pre-save hook to hash password - use regular function syntax
// UserSchema.pre("save", async function (next) {
//   // Only hash if password is modified and exists
//   if (!this.isModified("password") || !this.password) {
//     return next();
//   }

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error as Error);
//   }
// });

// // Add comparePassword method to schema
// UserSchema.methods.comparePassword = async function (
//   password: string
// ): Promise<boolean> {
//   if (!this.password) {
//     return false;
//   }
//   return bcrypt.compare(password, this.password);
// };


import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"
import * as bcrypt from "bcryptjs"
import { isValidPhoneNumber } from "libphonenumber-js"

export enum UserRole {
  USER = "user",
  PATIENT = "patient",
  DOCTOR = "doctor",
  ADMIN = "admin"
}

export enum AuthProvider {
  EMAIL = "email",
  GOOGLE = "google"
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other"
}

@Schema({ timestamps: true })
export class User extends Document {
  // Basic Information
  @Prop({ required: true })
  name: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({
    required: true,
    validate: {
      validator: function (value: string) {
        return isValidPhoneNumber(value)
      },
      message: "Phone number must be a valid phone number"
    }
  })
  phone: string

  @Prop({ type: String, default: null })
  password: string | null

  // Authentication
  @Prop({ 
    enum: Object.values(AuthProvider), 
    default: AuthProvider.EMAIL 
  })
  authProvider: AuthProvider

  @Prop({ type: String, unique: true, sparse: true })
  googleId?: string

  @Prop({ 
    enum: Object.values(UserRole), 
    default: UserRole.PATIENT 
  })
  role: UserRole

  @Prop({ default: false })
  emailVerified: boolean

  @Prop({ type: String, default: null })
  verificationToken: string | null

  @Prop({ type: String, default: null })
  resetToken: string | null

  @Prop({ type: Date, default: null })
  resetTokenExpiry: Date | null

  // Profile Information
  @Prop({ type: String, default: null })
  profilePicture: string | null

  @Prop({ type: String, default: null })
  bio: string | null

  @Prop({ type: String, default: null })
  address: string | null

  @Prop({ type: Date, default: null })
  dateOfBirth: Date | null

  @Prop({ 
    enum: Object.values(Gender), 
    default: null 
  })
  gender: Gender | null

  @Prop({ type: [String], default: [] })
  languages: string[]

  // Doctor-Specific Fields
  @Prop({ type: String, default: null })
  specialization: string | null

  @Prop({ type: String, default: null, unique: true, sparse: true })
  licenseNumber: string | null

  @Prop({ type: String, default: null })
  qualification: string | null

  @Prop({ type: Number, default: null })
  yearsOfExperience: number | null

  @Prop({ type: String, default: null })
  hospitalAffiliation: string | null

  @Prop({ type: Number, default: null })
  consultationFee: number | null

  @Prop({ type: [String], default: [] })
  certifications: string[]

  @Prop({ type: [String], default: [] })
  awards: string[]

  // Patient-Specific Fields
  @Prop({ type: String, default: null })
  bloodGroup: string | null

  @Prop({ type: [String], default: [] })
  allergies: string[]

  @Prop({ type: [String], default: [] })
  chronicConditions: string[]

  @Prop({ type: [String], default: [] })
  currentMedications: string[]

  @Prop({ type: String, default: null })
  emergencyContactName: string | null

  @Prop({ type: String, default: null })
  emergencyContactPhone: string | null

  @Prop({ type: String, default: null })
  insuranceProvider: string | null

  @Prop({ type: String, default: null })
  insurancePolicyNumber: string | null

  // Ratings and Reviews (for doctors)
  @Prop({ type: Number, default: 0 })
  averageRating: number

  @Prop({ type: Number, default: 0 })
  totalReviews: number

  @Prop({ type: Number, default: 0 })
  totalConsultations: number

  // Account Status
  @Prop({ default: true })
  isActive: boolean

  @Prop({ default: false })
  isVerified: boolean // For doctor verification by admin

  @Prop({ type: Date, default: null })
  verifiedAt: Date | null

  @Prop({ type: String, default: null })
  verifiedBy: string | null // Admin ID who verified

  @Prop({ type: Date, default: null })
  lastLoginAt: Date | null

  // Preferences
  @Prop({ type: Boolean, default: true })
  emailNotifications: boolean

  @Prop({ type: Boolean, default: true })
  smsNotifications: boolean

  @Prop({ type: Boolean, default: false })
  pushNotifications: boolean

  // Metadata
  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>

  createdAt?: Date
  updatedAt?: Date

  // Type declaration for methods
  comparePassword: (password: string) => Promise<boolean>
}

export const UserSchema = SchemaFactory.createForClass(User)

// Pre-save hook to hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Pre-save hook to update verification status
UserSchema.pre("save", function (next) {
  // Auto-set isVerified for non-doctor roles
  if (this.role !== UserRole.DOCTOR && !this.isVerified) {
    this.isVerified = true
  }
  next()
})

// Compare password method
UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  if (!this.password) {
    return false
  }
  return bcrypt.compare(password, this.password)
}

// Virtual for full age calculation
UserSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null
  const today = new Date()
  const birthDate = new Date(this.dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
})

// Indexes for performance
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1, isActive: 1 })
UserSchema.index({ specialization: 1 }, { sparse: true })
UserSchema.index({ licenseNumber: 1 }, { sparse: true })
UserSchema.index({ averageRating: -1 }, { sparse: true })
UserSchema.index({ name: "text", specialization: "text", bio: "text" })

// Enable virtuals in JSON
UserSchema.set("toJSON", { virtuals: true })
UserSchema.set("toObject", { virtuals: true })