import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { MongooseModule } from "@nestjs/mongoose"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { GoogleStrategy } from "./strategies/google.strategy"
import { User, UserSchema } from "src/schemas/user.schema"
import { jwtConfig } from "src/config/jwt.config"
import { NotificationModule } from "src/notifications/notification.module"

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: jwtConfig,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotificationModule,
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
