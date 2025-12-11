import { Injectable, BadRequestException, UnauthorizedException, ConflictException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { JwtService } from "@nestjs/jwt"
import { Model } from "mongoose"
import { User } from "src/schemas/user.schema"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"
import { ForgotPasswordDto } from "./dto/forgot-password.dto"
import { ResetPasswordDto } from "./dto/reset-password.dto"
import { NotificationService } from "../notifications/notification.service"
import * as crypto from "crypto"

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private notificationService: NotificationService,
  ) {}

  async register(registerDto: RegisterDto) {
  const { email, password, name, phone, role } = registerDto

  const existingUser = await this.userModel.findOne({ email })
  if (existingUser) {
    throw new ConflictException("Email already registered")
  }

  const verificationToken = crypto.randomBytes(32).toString("hex")

  const user = new this.userModel({
    name,
    email,
    phone,
    password,
    verificationToken,
    authProvider: "email",
    role: role ?? "user", // ✅ set default role if not provided
  })

  await user.save()

  // Send verification email
  // await this.notificationService.sendVerificationEmail(email, verificationToken)

  return {
    message: "Registration successful. Please verify your email.",
    userId: user._id,
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

    if (!user.emailVerified) {
      throw new BadRequestException("Please verify your email first")
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
      },
    }
  }

  async googleLogin(profile: any) {
    let user = await this.userModel.findOne({ googleId: profile.googleId })

    if (!user) {
      user = new this.userModel({
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.email,
        phone: "",
        googleId: profile.googleId,
        authProvider: "google",
        emailVerified: true,
        profilePicture: profile.picture,
      })
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

    return { message: "Email verified successfully" }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto

    const user = await this.userModel.findOne({ email })
    if (!user) {
      throw new BadRequestException("User not found")
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    user.resetToken = resetToken
    user.resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour
    await user.save()

    await this.notificationService.sendPasswordResetEmail(email, resetToken)

    return { message: "Password reset email sent" }
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
    const user = await this.userModel.findById(userId).select("-password -resetToken")
    if (!user) {
      throw new BadRequestException("User not found")
    }
    return user
  }

  async updateProfile(userId: string, updateData: any) {
    const user = await this.userModel.findByIdAndUpdate(userId, updateData, { new: true })
    return user
  }
}