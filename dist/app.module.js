"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const auth_module_1 = require("./auth/auth.module");
const google_controller_1 = require("./auth/google.controller");
const appointments_module_1 = require("./appointments/appointments.module");
const payments_module_1 = require("./payments/payments.module");
const admin_module_1 = require("./admin/admin.module");
const notification_module_1 = require("./notifications/notification.module");
const throttler_2 = require("@nestjs/throttler");
const enquiry_module_1 = require("./enquiry/enquiry.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env'
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    uri: configService.get("MONGODB_URI"),
                    connectionFactory: (connection) => {
                        connection.on('connected', () => {
                            console.log('✅ MongoDB connected successfully');
                            console.log(`📍 Database: ${connection.name}`);
                            console.log(`🔗 Host: ${connection.host}:${connection.port}`);
                        });
                        connection.on('error', (error) => {
                            console.error('❌ MongoDB connection error:', error.message);
                        });
                        connection.on('disconnected', () => {
                            console.log('⚠️  MongoDB disconnected');
                        });
                        return connection;
                    },
                }),
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 10,
                },
            ]),
            auth_module_1.AuthModule,
            appointments_module_1.AppointmentsModule,
            payments_module_1.PaymentsModule,
            admin_module_1.AdminModule,
            notification_module_1.NotificationModule,
            enquiry_module_1.EnquiryModule,
        ],
        controllers: [google_controller_1.GoogleAuthController],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_2.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map