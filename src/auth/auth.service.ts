// import { Injectable, BadRequestException, UnauthorizedException, ConflictException } from "@nestjs/common"
// import { InjectModel } from "@nestjs/mongoose"
// import { JwtService } from "@nestjs/jwt"
// import { Model } from "mongoose"
// import { User } from "src/schemas/user.schema"
// import { RegisterDto } from "./dto/register.dto"
// import { LoginDto } from "./dto/login.dto"
// import { ForgotPasswordDto } from "./dto/forgot-password.dto"
// import { ResetPasswordDto } from "./dto/reset-password.dto"
// import { NotificationService } from "../notifications/notification.service"
// import * as crypto from "crypto"

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectModel(User.name) private userModel: Model<User>,
//     private jwtService: JwtService,
//     private notificationService: NotificationService,
//   ) {}

//   async register(registerDto: RegisterDto) {
//   const { email, password, name, phone, role } = registerDto

//   const existingUser = await this.userModel.findOne({ email })
//   if (existingUser) {
//     throw new ConflictException("Email already registered")
//   }

//   const verificationToken = crypto.randomBytes(32).toString("hex")

//   const user = new this.userModel({
//     name,
//     email,
//     phone,
//     password,
//     verificationToken,
//     authProvider: "email",
//     role: role ?? "user", // ✅ set default role if not provided
//   })

//   await user.save()

//   // Send verification email
//   // await this.notificationService.sendVerificationEmail(email, verificationToken)

//   return {
//     message: "Registration successful. Please verify your email.",
//     userId: user._id,
//   }
// }


//   async login(loginDto: LoginDto) {
//     const { email, password } = loginDto

//     const user = await this.userModel.findOne({ email })
//     if (!user) {
//       throw new UnauthorizedException("Invalid credentials")
//     }

//     const isPasswordValid = await user.comparePassword(password)
//     if (!isPasswordValid) {
//       throw new UnauthorizedException("Invalid credentials")
//     }

//     if (!user.emailVerified) {
//       throw new BadRequestException("Please verify your email first")
//     }

//     const token = this.jwtService.sign({
//       sub: user._id,
//       email: user.email,
//       role: user.role,
//     })

//     return {
//       access_token: token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     }
//   }

//   async googleLogin(profile: any) {
//     let user = await this.userModel.findOne({ googleId: profile.googleId })

//     if (!user) {
//       user = new this.userModel({
//         name: `${profile.firstName} ${profile.lastName}`,
//         email: profile.email,
//         phone: "",
//         googleId: profile.googleId,
//         authProvider: "google",
//         emailVerified: true,
//         profilePicture: profile.picture,
//       })
//       await user.save()
//     }

//     const token = this.jwtService.sign({
//       sub: user._id,
//       email: user.email,
//       role: user.role,
//     })

//     return {
//       access_token: token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     }
//   }

//   async verifyEmail(token: string) {
//     const user = await this.userModel.findOne({ verificationToken: token })

//     if (!user) {
//       throw new BadRequestException("Invalid verification token")
//     }

//     user.emailVerified = true
//     user.verificationToken = null
//     await user.save()

//     return { message: "Email verified successfully" }
//   }

//   async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
//     const { email } = forgotPasswordDto

//     const user = await this.userModel.findOne({ email })
//     if (!user) {
//       throw new BadRequestException("User not found")
//     }

//     const resetToken = crypto.randomBytes(32).toString("hex")
//     user.resetToken = resetToken
//     user.resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour
//     await user.save()

//     await this.notificationService.sendPasswordResetEmail(email, resetToken)

//     return { message: "Password reset email sent" }
//   }

//   async resetPassword(resetPasswordDto: ResetPasswordDto) {
//     const { token, newPassword } = resetPasswordDto

//     const user = await this.userModel.findOne({
//       resetToken: token,
//       resetTokenExpiry: { $gt: new Date() },
//     })

//     if (!user) {
//       throw new BadRequestException("Invalid or expired reset token")
//     }

//     user.password = newPassword
//     user.resetToken = null
//     user.resetTokenExpiry = null
//     await user.save()

//     return { message: "Password reset successfully" }
//   }

//   async getProfile(userId: string) {
//     const user = await this.userModel.findById(userId).select("-password -resetToken")
//     if (!user) {
//       throw new BadRequestException("User not found")
//     }
//     return user
//   }

//   async updateProfile(userId: string, updateData: any) {
//     const user = await this.userModel.findByIdAndUpdate(userId, updateData, { new: true })
//     return user
//   }
// }

// src/auth/auth.service.ts
import { 
  Injectable, 
  BadRequestException, 
  UnauthorizedException, 
  ConflictException 
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
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private notificationService: NotificationService,
  ) {}

  // async register(registerDto: RegisterDto) {
  //   const { 
  //     email, 
  //     password, 
  //     name, 
  //     phone, 
  //     role,
  //     specialization,
  //     licenseNumber,
  //     qualification,
  //     bio
  //   } = registerDto

  //   const existingUser = await this.userModel.findOne({ email })
  //   if (existingUser) {
  //     throw new ConflictException("Email already registered")
  //   }

  //   // For doctor registration, validate required fields
  //   if (role === "doctor") {
  //     if (!specialization || !licenseNumber) {
  //       throw new BadRequestException(
  //         "Specialization and license number are required for doctor registration"
  //       )
  //     }
  //   }

  //   const verificationToken = crypto.randomBytes(32).toString("hex")

  //   const user = new this.userModel({
  //     name,
  //     email,
  //     phone,
  //     password,
  //     verificationToken,
  //     authProvider: "email",
  //     role: role ?? "patient", // Default to patient instead of user
  //     specialization,
  //     licenseNumber,
  //     qualification,
  //     bio,
  //     emailVerified: false, // Require email verification
  //   })

  //   await user.save()

  //   // Send verification email
  //   try {
  //     await this.notificationService.sendVerificationEmail(email, verificationToken)
  //   } catch (error) {
  //     console.error("Failed to send verification email:", error)
  //     // Don't fail registration if email fails
  //   }

  //   return {
  //     message: "Registration successful. Please verify your email.",
  //     userId: user._id,
  //     role: user.role,
  //   }
  // }

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
    emailVerified: false, // Require email verification
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

  // async googleLogin(profile: any) {
  //   let user = await this.userModel.findOne({ googleId: profile.googleId })

  //   if (!user) {
  //     // Check if email already exists
  //     user = await this.userModel.findOne({ email: profile.email })
      
  //     if (user) {
  //       // Link Google account to existing user
  //       user.googleId = profile.googleId
  //       user.authProvider = "google"
  //       user.profilePicture = profile.picture
  //       user.emailVerified = true
  //     } else {
  //       // Create new user
  //       user = new this.userModel({
  //         name: `${profile.firstName} ${profile.lastName}`,
  //         email: profile.email,
  //         phone: "",
  //         googleId: profile.googleId,
  //         authProvider: "google",
  //         emailVerified: true,
  //         profilePicture: profile.picture,
  //         role: "patient", // Default role for Google sign-up
  //       })
  //     }
      
  //     await user.save()
  //   }

  //   const token = this.jwtService.sign({
  //     sub: user._id,
  //     email: user.email,
  //     role: user.role,
  //   })

  //   return {
  //     access_token: token,
  //     user: {
  //       id: user._id,
  //       name: user.name,
  //       email: user.email,
  //       role: user.role,
  //       specialization: user.specialization,
  //       profilePicture: user.profilePicture,
  //     },
  //   }
  // }

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
      safeUpdateData['emailVerified'] = false
      safeUpdateData['verificationToken'] = verificationToken
      safeUpdateData['email'] = email
      
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
  }

  async getDoctorById(doctorId: string) {
    const doctor = await this.userModel
      .findOne({ _id: doctorId, role: "doctor" })
      .select("-password -resetToken -resetTokenExpiry -verificationToken")
    
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
  }
}