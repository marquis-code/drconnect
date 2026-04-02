"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const mongoose_1 = require("@nestjs/mongoose");
const app_module_1 = require("../app.module");
const consultation_plan_schema_1 = require("../schemas/consultation-plan.schema");
const seed_plans_1 = require("./seed-plans");
const normalize = (value) => (value !== null && value !== void 0 ? value : "").trim().toLowerCase();
const normalizeKey = (plan) => {
    var _a, _b, _c, _d;
    return [
        (_a = plan.consultationType) !== null && _a !== void 0 ? _a : "",
        (_b = plan.duration) !== null && _b !== void 0 ? _b : 0,
        (_c = plan.price) !== null && _c !== void 0 ? _c : 0,
        (_d = plan.consultationCategory) !== null && _d !== void 0 ? _d : "",
        normalize(plan.specialtyRequired),
        normalize(plan.mentalHealthSubType),
        plan.includesPrescription ? "1" : "0",
        plan.isGroupTherapy ? "1" : "0",
        plan.isCouplesTherapy ? "1" : "0",
    ].join("|");
};
const buildUpdate = (plan) => {
    const fields = [
        "name",
        "description",
        "consultationType",
        "consultationCategory",
        "duration",
        "price",
        "consultationModes",
        "tags",
        "requiresPreApproval",
        "preparationInstructions",
        "minAdvanceBookingHours",
        "maxAdvanceBookingHours",
        "isNewPatientOnly",
        "isExistingPatientOnly",
        "specialtyRequired",
        "mentalHealthSubType",
        "includesPrescription",
        "isPriority",
        "isCouplesTherapy",
        "isGroupTherapy",
        "specialConditions",
        "availableDays",
        "availableTimeRange",
        "sortOrder",
    ];
    const update = {};
    for (const field of fields) {
        const value = plan[field];
        if (value !== undefined) {
            update[field] = value;
        }
    }
    return update;
};
async function syncPlans() {
    var _a;
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    try {
        const model = app.get((0, mongoose_1.getModelToken)(consultation_plan_schema_1.ConsultationPlan.name));
        const dbPlans = await model.find().exec();
        const byName = new Map(dbPlans.map((plan) => [plan.name, plan]));
        const byKey = new Map();
        for (const plan of dbPlans) {
            const key = normalizeKey(plan);
            const list = (_a = byKey.get(key)) !== null && _a !== void 0 ? _a : [];
            list.push(plan);
            byKey.set(key, list);
        }
        const matchedIds = new Set();
        let created = 0;
        let updated = 0;
        let renamed = 0;
        for (const expected of seed_plans_1.expectedPlans) {
            let target = byName.get(expected.name);
            if (target && matchedIds.has(target._id.toString())) {
                target = undefined;
            }
            const expectedKey = normalizeKey(expected);
            if (!target) {
                const keyMatches = byKey.get(expectedKey);
                if (keyMatches && keyMatches.length > 0) {
                    target = keyMatches.find((plan) => !matchedIds.has(plan._id.toString()));
                }
            }
            if (target) {
                const update = buildUpdate(expected);
                if (target.name !== expected.name) {
                    renamed++;
                }
                await model.updateOne({ _id: target._id }, { $set: update }).exec();
                matchedIds.add(target._id.toString());
                updated++;
            }
            else {
                await model.create(expected);
                created++;
            }
        }
        const expectedNames = new Set(seed_plans_1.expectedPlans.map((plan) => plan.name));
        const extras = dbPlans.filter((plan) => !matchedIds.has(plan._id.toString()) && !expectedNames.has(plan.name));
        console.log("\n✅ Consultation plans sync complete.");
        console.log(`Updated: ${updated}`);
        console.log(`Renamed: ${renamed}`);
        console.log(`Created: ${created}`);
        if (extras.length > 0) {
            console.log("\n⚠️ Extra plans not in catalog (left unchanged):");
            extras.forEach((plan) => console.log(`- ${plan.name}`));
        }
    }
    catch (error) {
        console.error("❌ Failed to sync consultation plans:", error);
        process.exitCode = 1;
    }
    finally {
        await app.close();
    }
}
if (require.main === module) {
    syncPlans();
}
//# sourceMappingURL=sync-plans.js.map