"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultationPlansModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const consultation_plans_service_1 = require("./consultation-plans.service");
const consultation_plans_controller_1 = require("./consultation-plans.controller");
const consultation_plan_schema_1 = require("../schemas/consultation-plan.schema");
let ConsultationPlansModule = class ConsultationPlansModule {
};
exports.ConsultationPlansModule = ConsultationPlansModule;
exports.ConsultationPlansModule = ConsultationPlansModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: consultation_plan_schema_1.ConsultationPlan.name, schema: consultation_plan_schema_1.ConsultationPlanSchema }
            ]),
        ],
        providers: [consultation_plans_service_1.ConsultationPlansService],
        controllers: [consultation_plans_controller_1.ConsultationPlansController],
        exports: [consultation_plans_service_1.ConsultationPlansService],
    })
], ConsultationPlansModule);
//# sourceMappingURL=consultation-plans.module.js.map