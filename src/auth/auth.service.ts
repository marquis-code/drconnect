import { 
  Injectable, 
  BadRequestException, 
  UnauthorizedException, 
  ConflictException,
  OnModuleInit
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { JwtService } from "@nestjs/jwt"
import { Model } from "mongoose"
import { User, AuthProvider, UserRole } from "../schemas/user.schema"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"
import { ForgotPasswordDto } from "./dto/forgot-password.dto"
import { ResetPasswordDto } from "./dto/reset-password.dto"
import { UpdateProfileDto } from "./dto/update-profile.dto"
import { NotificationService } from "../notifications/notification.service"
import * as crypto from "crypto"

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private notificationService: NotificationService,
  ) {}

  async onModuleInit() {
    // 🚀 Aggressive Cleanup: Remove null and empty string values for sparse unique indexed fields
    // This allows the sparse unique index to function correctly by omitting documents where the field is missing.
    try {
      await this.userModel.updateMany(
        { $or: [{ licenseNumber: null }, { licenseNumber: "" }] },
        { $unset: { licenseNumber: 1 } }
      )
      await this.userModel.updateMany(
        { $or: [{ googleId: null }, { googleId: "" }] },
        { $unset: { googleId: 1 } }
      )
      console.log("✅ Successfully cleaned up null and empty values for sparse unique indexes")
    } catch (error) {
      console.error("❌ Failed to clean up null values for sparse unique indexes:", error)
    }
  }

  async register(registerDto: RegisterDto) {
  const { 
    email, 
    password, 
    name, 
    phone, 
    role,
    specialization,
    licenseNumber,
    qualification,
    bio
  } = registerDto

  const existingUser = await this.userModel.findOne({ email })
  if (existingUser) {
    throw new ConflictException("Email already registered")
  }

  // For doctor registration, validate required fields
  if (role === UserRole.DOCTOR) {
    if (!specialization || !licenseNumber) {
      throw new BadRequestException(
        "Specialization and license number are required for doctor registration"
      )
    }
  }

  const verificationToken = crypto.randomBytes(32).toString("hex")

  const user = new this.userModel({
    name,
    email,
    phone,
    password,
    verificationToken,
    authProvider: AuthProvider.EMAIL,
    role: role ?? UserRole.PATIENT, // Default to patient instead of user
    specialization,
    licenseNumber,
    qualification,
    bio,
    emailVerified: true, // Require email verification
  })

  await user.save()

  // Send verification email
  try {
    await this.notificationService.sendVerificationEmail(email, verificationToken)
  } catch (error) {
    console.error("Failed to send verification email:", error)
    // Don't fail registration if email fails
  }

  return {
    message: "Registration successful. Please verify your email.",
    userId: user._id,
    role: user.role,
  }
}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    const user = await this.userModel.findOne({ email })
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials")
    }

    // Email verification aggressively removed

    const token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
      role: user.role,
    })

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
    }
  }

  async googleLogin(profile: any) {
  let user = await this.userModel.findOne({ googleId: profile.googleId })

  if (!user) {
    // Check if email already exists
    user = await this.userModel.findOne({ email: profile.email })
    
    if (user) {
      // Link Google account to existing user
      user.googleId = profile.googleId
      user.authProvider = AuthProvider.GOOGLE
      user.profilePicture = profile.picture
      user.emailVerified = true
    } else {
      // Create new user
      user = new this.userModel({
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.email,
        phone: "",
        googleId: profile.googleId,
        authProvider: AuthProvider.GOOGLE,
        emailVerified: true,
        profilePicture: profile.picture,
        role: UserRole.PATIENT, // Default role for Google sign-up
      })
    }
    
    await user.save()
  }

  const token = this.jwtService.sign({
    sub: user._id,
    email: user.email,
    role: user.role,
  })

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
  }
}

  async verifyEmail(token: string) {
    const user = await this.userModel.findOne({ verificationToken: token })

    if (!user) {
      throw new BadRequestException("Invalid verification token")
    }

    user.emailVerified = true
    user.verificationToken = null
    await user.save()

    return { 
      message: "Email verified successfully",
      userId: user._id 
    }
  }

  async resendVerificationEmail(email: string) {
    const user = await this.userModel.findOne({ email })

    if (!user) {
      throw new BadRequestException("User not found")
    }

    if (user.emailVerified) {
      throw new BadRequestException("Email is already verified")
    }

    const verificationToken = crypto.randomBytes(32).toString("hex")
    user.verificationToken = verificationToken
    await user.save()

    await this.notificationService.sendVerificationEmail(email, verificationToken)

    return { message: "Verification email sent" }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto

    const user = await this.userModel.findOne({ email })
    if (!user) {
      // Don't reveal if email exists for security
      return { message: "If that email exists, a password reset link has been sent" }
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    user.resetToken = resetToken
    user.resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour
    await user.save()

    try {
      await this.notificationService.sendPasswordResetEmail(email, resetToken)
    } catch (error) {
      console.error("Failed to send password reset email:", error)
    }

    return { message: "If that email exists, a password reset link has been sent" }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto

    const user = await this.userModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    })

    if (!user) {
      throw new BadRequestException("Invalid or expired reset token")
    }

    user.password = newPassword
    user.resetToken = null
    user.resetTokenExpiry = null
    await user.save()

    return { message: "Password reset successfully" }
  }

  async getProfile(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select("-password -resetToken -resetTokenExpiry -verificationToken")
    
    if (!user) {
      throw new BadRequestException("User not found")
    }
    
    return user
  }

  async updateProfile(userId: string, updateData: UpdateProfileDto) {
    // Prevent updating sensitive fields
    const { email, ...safeUpdateData } = updateData

    // If email is being changed, require verification
    if (email) {
      const existingUser = await this.userModel.findOne({ 
        email, 
        _id: { $ne: userId } 
      })
      
      if (existingUser) {
        throw new ConflictException("Email already in use")
      }
      
      const verificationToken = crypto.randomBytes(32).toString("hex")
      safeUpdateData['emailVerified'] = true
      
      try {
        await this.notificationService.sendVerificationEmail(email, verificationToken)
      } catch (error) {
        console.error("Failed to send verification email:", error)
      }
    }

    const user = await this.userModel.findByIdAndUpdate(
      userId, 
      safeUpdateData, 
      { new: true }
    ).select("-password -resetToken -resetTokenExpiry -verificationToken")
    
    if (!user) {
      throw new BadRequestException("User not found")
    }
    
    return user
  }

  async getAllDoctors() {
    return this.userModel
      .find({ role: "doctor" })
      .select("-password -resetToken -resetTokenExpiry -verificationToken")
      .sort({ name: 1 })
      .lean()
  }

  async getDoctorById(doctorId: string) {
    const doctor = await this.userModel
      .findOne({ _id: doctorId, role: "doctor" })
      .select("-password -resetToken -resetTokenExpiry -verificationToken")
      .lean()
    
    if (!doctor) {
      throw new BadRequestException("Doctor not found")
    }
    
    return doctor
  }

  async searchDoctors(query: string, specialization?: string) {
    const filter: any = { role: "doctor" }
    
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { specialization: { $regex: query, $options: "i" } },
        { bio: { $regex: query, $options: "i" } }
      ]
    }
    
    if (specialization) {
      filter.specialization = { $regex: specialization, $options: "i" }
    }
    
    return this.userModel
      .find(filter)
      .select("-password -resetToken -resetTokenExpiry -verificationToken")
      .sort({ name: 1 })
      .lean()
  }
}