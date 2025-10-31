import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AdminService } from "./admin.service"
import { AdminController } from "./admin.controller"
import { User, UserSchema } from "src/schemas/user.schema"
import { Appointment, AppointmentSchema } from "src/schemas/appointment.schema"
import { Transaction, TransactionSchema } from "src/schemas/transaction.schema"
import { Availability, AvailabilitySchema } from "src/schemas/availability.schema"
import { Settings, SettingsSchema } from "src/schemas/settings.schema"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: Availability.name, schema: AvailabilitySchema },
      { name: Settings.name, schema: SettingsSchema },
    ]),
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
