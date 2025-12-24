import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from "@nestjs/config"
import { ThrottlerModule } from "@nestjs/throttler"
import { AuthModule } from "./auth/auth.module"
import { GoogleAuthController } from "./auth/google.controller";
import { AppointmentsModule } from "./appointments/appointments.module"
import { PaymentsModule } from "./payments/payments.module"
import { AdminModule } from "./admin/admin.module"
import { NotificationModule } from "./notifications/notification.module"
import { ThrottlerGuard } from '@nestjs/throttler';
import { EnquiryModule } from "./enquiry/enquiry.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('✅ MongoDB connected successfully')
            console.log(`📍 Database: ${connection.name}`)
            console.log(`🔗 Host: ${connection.host}:${connection.port}`)
          })
          
          connection.on('error', (error: any) => {
            console.error('❌ MongoDB connection error:', error.message)
          })
          
          connection.on('disconnected', () => {
            console.log('⚠️  MongoDB disconnected')
          })
          
          return connection
        },
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    AuthModule,
    AppointmentsModule,
    PaymentsModule,
    AdminModule,
    NotificationModule,
    EnquiryModule,
  ],
   controllers: [GoogleAuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}