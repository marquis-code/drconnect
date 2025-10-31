"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const admin_service_1 = require("./admin.service");
const admin_controller_1 = require("./admin.controller");
const user_schema_1 = require("../schemas/user.schema");
const public_controller_1 = require("./public.controller");
const appointment_schema_1 = require("../schemas/appointment.schema");
const transaction_schema_1 = require("../schemas/transaction.schema");
const availability_schema_1 = require("../schemas/availability.schema");
const settings_schema_1 = require("../schemas/settings.schema");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: appointment_schema_1.Appointment.name, schema: appointment_schema_1.AppointmentSchema },
                { name: transaction_schema_1.Transaction.name, schema: transaction_schema_1.TransactionSchema },
                { name: availability_schema_1.Availability.name, schema: availability_schema_1.AvailabilitySchema },
                { name: settings_schema_1.Settings.name, schema: settings_schema_1.SettingsSchema },
            ]),
        ],
        providers: [admin_service_1.AdminService],
        controllers: [admin_controller_1.AdminController, public_controller_1.PublicController],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map