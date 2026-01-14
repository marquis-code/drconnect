// import { Controller, Post, Get, Body, UseGuards, Req, Res, Param } from "@nestjs/common"
// import { AuthService } from "./auth.service"
// import { RegisterDto } from "./dto/register.dto"
// import { LoginDto } from "./dto/login.dto"
// import { ForgotPasswordDto } from "./dto/forgot-password.dto"
// import { ResetPasswordDto } from "./dto/reset-password.dto"
// import { JwtAuthGuard } from "./guards/jwt.guard"
// import { GoogleAuthGuard } from "./guards/google.guard"
// import { CurrentUser } from "./decorators/current-user.decorator"
// import { Request, Response } from "express"

// @Controller("auth")
// export class AuthController {
//   constructor(private authService: AuthService) {}

//   @Post('register')
//   async register(@Body() registerDto: RegisterDto) {
//     return this.authService.register(registerDto)
//   }

//   @Post('login')
//   async login(@Body() loginDto: LoginDto) {
//     return this.authService.login(loginDto)
//   }

//   @Get("google")
//   @UseGuards(GoogleAuthGuard)
//   async googleAuth() {}

//   @Get("google/callback")
//   @UseGuards(GoogleAuthGuard)
//   async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
//     const result = await this.authService.googleLogin(req.user)
//     res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${result.access_token}`)
//   }

//   @Post('forgot-password')
//   async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
//     return this.authService.forgotPassword(forgotPasswordDto)
//   }

//   @Post('reset-password')
//   async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
//     return this.authService.resetPassword(resetPasswordDto)
//   }

//   @Get('verify-email/:token')
//   async verifyEmail(@Param('token') token: string) {
//     return this.authService.verifyEmail(token)
//   }

//   @Get('profile')
//   @UseGuards(JwtAuthGuard)
//   async getProfile(@CurrentUser() user: any) {
//     return this.authService.getProfile(user.userId)
//   }

//   @Post("profile/update")
//   @UseGuards(JwtAuthGuard)
//   async updateProfile(@CurrentUser() user: any, @Body() updateData: any) {
//     return this.authService.updateProfile(user.userId, updateData)
//   }
// }

// src/auth/auth.controller.ts
import { 
  Controller, 
  Post, 
  Get, 
  Patch,
  Body, 
  UseGuards, 
  Req, 
  Res, 
  Param,
  Query
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { RegisterDto } from "./dto/register.dto"
import { LoginDto } from "./dto/login.dto"
import { ForgotPasswordDto } from "./dto/forgot-password.dto"
import { ResetPasswordDto } from "./dto/reset-password.dto"
import { UpdateProfileDto } from "./dto/update-profile.dto"
import { JwtAuthGuard } from "./guards/jwt.guard"
import { GoogleAuthGuard } from "./guards/google.guard"
import { RolesGuard } from "./guards/roles.guard"
import { Roles } from "./decorators/roles.decorator"
import { CurrentUser } from "./decorators/current-user.decorator"
import { Request, Response } from "express"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Get("google")
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.googleLogin(req.user)
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${result.access_token}`)
  }

  @Post("forgot-password")
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto)
  }

  @Post("reset-password")
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto)
  }

  @Get("verify-email/:token")
  async verifyEmail(@Param("token") token: string) {
    return this.authService.verifyEmail(token)
  }

  @Post("resend-verification")
  async resendVerification(@Body("email") email: string) {
    return this.authService.resendVerificationEmail(email)
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.userId)
  }

  @Patch("profile")
  @UseGuards(JwtAuthGuard)
  async updateProfile(@CurrentUser() user: any, @Body() updateData: UpdateProfileDto) {
    return this.authService.updateProfile(user.userId, updateData)
  }

  @Get("doctors")
  @UseGuards(JwtAuthGuard)
  async getAllDoctors() {
    return this.authService.getAllDoctors()
  }

  @Get("doctors/search")
  @UseGuards(JwtAuthGuard)
  async searchDoctors(
    @Query("q") query: string,
    @Query("specialization") specialization: string
  ) {
    return this.authService.searchDoctors(query, specialization)
  }

  @Get("doctors/:id")
  @UseGuards(JwtAuthGuard)
  async getDoctorById(@Param("id") id: string) {
    return this.authService.getDoctorById(id)
  }
}