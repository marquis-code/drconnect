import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as bcrypt from "bcryptjs";
import { isValidPhoneNumber } from 'libphonenumber-js';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ 
    required: true,
    validate: {
      validator: function(value: string) {
        // Validate phone number globally
        return isValidPhoneNumber(value); // Checks the validity of the phone number globally
      },
      message: 'Phone number must be a valid phone number'
    }
  })
  phone: string;

  @Prop({ type: String, default: null })
  password: string | null;

  @Prop({ enum: ["email", "google"], default: "email" })
  authProvider: string;

  @Prop({ type: String, unique: true, sparse: true })
  googleId?: string;

  @Prop({ enum: ["user", "admin"], default: "user" })
  role: string;

  @Prop({ default: true })
  emailVerified: boolean;

  @Prop({ type: String, default: null })
  verificationToken: string | null;

  @Prop({ type: String, default: null })
  resetToken: string | null;

  @Prop({ type: Date, default: null })
  resetTokenExpiry: Date | null;

  @Prop({ type: String, default: null })
  profilePicture: string | null;

  @Prop({ type: String, default: null })
  bio: string | null;

  @Prop({ default: true })
  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;

  // Type declaration for the method (will be added to schema below)
  comparePassword: (password: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save hook to hash password - use regular function syntax
UserSchema.pre("save", async function (next) {
  // Only hash if password is modified and exists
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Add comparePassword method to schema
UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(password, this.password);
};
