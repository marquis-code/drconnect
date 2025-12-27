"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedPlansCommand = void 0;
const nest_commander_1 = require("nest-commander");
const consultation_plans_service_1 = require("../consultation-plans/consultation-plans.service");
let SeedPlansCommand = class SeedPlansCommand extends nest_commander_1.CommandRunner {
    constructor(plansService) {
        super();
        this.plansService = plansService;
    }
    async run() {
        const plans = [
            {
                name: "Virtual Consultation - 20 Minutes",
                description: "Quick virtual consultation session for follow-ups or brief medical inquiries",
                consultationType: "virtual",
                duration: 20,
                price: 30000,
                availableDays: [0, 1, 2, 3, 4, 5, 6],
                consultationModes: ["voice", "video"],
                isActive: true,
                sortOrder: 1,
            },
            {
                name: "Virtual Consultation - 10 Minutes",
                description: "Brief virtual consultation for quick medical questions",
                consultationType: "virtual",
                duration: 10,
                price: 20000,
                availableDays: [0, 1, 2, 3, 4, 5, 6],
                consultationModes: ["voice", "video"],
                isActive: true,
                sortOrder: 2,
            },
            {
                name: "Virtual Consultation - 30 Minutes",
                description: "Extended virtual consultation for comprehensive medical discussions",
                consultationType: "virtual",
                duration: 30,
                price: 50000,
                availableDays: [0, 1, 2, 3, 4, 5, 6],
                consultationModes: ["voice", "video"],
                isActive: true,
                sortOrder: 3,
            },
            {
                name: "Physical Consultation - Saturday",
                description: "In-person consultation at the clinic on Saturday (9 AM - 5 PM)",
                consultationType: "physical",
                duration: 30,
                price: 100000,
                availableDays: [6],
                availableTimeRange: "09:00-17:00",
                consultationModes: ["video"],
                isActive: true,
                sortOrder: 4,
            },
            {
                name: "Physical Consultation - Thursday",
                description: "In-person consultation at the clinic on Thursday (9 AM - 5 PM)",
                consultationType: "physical",
                duration: 30,
                price: 100000,
                availableDays: [4],
                availableTimeRange: "09:00-17:00",
                consultationModes: ["video"],
                isActive: true,
                sortOrder: 5,
            },
        ];
        console.log('🌱 Starting to seed consultation plans...');
        for (const plan of plans) {
            try {
                const created = await this.plansService.createPlan(plan);
                console.log(`✅ Created: ${created.name}`);
            }
            catch (error) {
                console.error(`❌ Failed to create ${plan.name}:`, error.message);
            }
        }
        console.log('🎉 Seeding completed!');
    }
};
exports.SeedPlansCommand = SeedPlansCommand;
exports.SeedPlansCommand = SeedPlansCommand = __decorate([
    (0, nest_commander_1.Command)({ name: 'seed:plans', description: 'Seed consultation plans' }),
    __metadata("design:paramtypes", [consultation_plans_service_1.ConsultationPlansService])
], SeedPlansCommand);
//# sourceMappingURL=seed-plans.command.js.map