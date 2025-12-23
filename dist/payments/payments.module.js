"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const payments_service_1 = require("./payments.service");
const payments_controller_1 = require("./payments.controller");
const transaction_schema_1 = require("../schemas/transaction.schema");
const appointment_schema_1 = require("../schemas/appointment.schema");
const user_schema_1 = require("../schemas/user.schema");
const paystack_module_1 = require("../integrations/paystack.module");
const mono_module_1 = require("../integrations/mono.module");
const appointments_module_1 = require("../appointments/appointments.module");
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: transaction_schema_1.Transaction.name, schema: transaction_schema_1.TransactionSchema },
                { name: appointment_schema_1.Appointment.name, schema: appointment_schema_1.AppointmentSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
            paystack_module_1.PaystackModule,
            mono_module_1.MonoModule,
            appointments_module_1.AppointmentsModule,
        ],
        providers: [payments_service_1.PaymentsService],
        controllers: [payments_controller_1.PaymentsController],
        exports: [payments_service_1.PaymentsService],
    })
], PaymentsModule);
//# sourceMappingURL=payments.module.js.map