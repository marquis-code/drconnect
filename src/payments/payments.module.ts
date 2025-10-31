import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { PaymentsService } from "./payments.service"
import { PaymentsController } from "./payments.controller"
import { Transaction, TransactionSchema } from "src/schemas/transaction.schema"
import { Appointment, AppointmentSchema } from "src/schemas/appointment.schema"
import { User, UserSchema } from "src/schemas/user.schema"
import { PaystackModule } from "src/integrations/paystack.module"
import { MonoModule } from "src/integrations/mono.module"
import { NotificationModule } from "src/notifications/notification.module"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: User.name, schema: UserSchema },
    ]),
    PaystackModule,
    MonoModule,
    NotificationModule,
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
