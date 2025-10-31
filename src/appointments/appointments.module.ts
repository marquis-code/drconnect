import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AppointmentsService } from "./appointments.service"
import { AppointmentsController } from "./appointments.controller"
import { Appointment, AppointmentSchema } from "src/schemas/appointment.schema"
import { NotificationModule } from "src/notifications/notification.module"
import { GoogleMeetModule } from "src/integrations/google-meet.module"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }]),
    NotificationModule,
    GoogleMeetModule,
  ],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
