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
const compareFields = (expected, actual) => {
    const diffs = {};
    const fields = [
        "consultationType",
        "duration",
        "price",
        "consultationCategory",
        "specialtyRequired",
        "mentalHealthSubType",
        "includesPrescription",
        "isGroupTherapy",
        "isCouplesTherapy",
        "isPriority",
        "minAdvanceBookingHours",
        "isNewPatientOnly",
        "isExistingPatientOnly",
    ];
    for (const field of fields) {
        const expectedValue = expected[field];
        if (expectedValue === undefined || expectedValue === null)
            continue;
        if (expectedValue !== actual[field]) {
            diffs[field] = {
                expected: expectedValue,
                actual: actual[field],
            };
        }
    }
    return diffs;
};
async function verifyPlans() {
    var _a, _b;
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    try {
        const model = app.get((0, mongoose_1.getModelToken)(consultation_plan_schema_1.ConsultationPlan.name));
        const dbPlans = await model.find().lean().exec();
        const expectedByName = new Map(seed_plans_1.expectedPlans.map((plan) => [plan.name, plan]));
        const dbByName = new Map();
        for (const plan of dbPlans) {
            const list = (_a = dbByName.get(plan.name)) !== null && _a !== void 0 ? _a : [];
            list.push(plan);
            dbByName.set(plan.name, list);
        }
        const expectedNames = new Set(seed_plans_1.expectedPlans.map((plan) => plan.name));
        const dbNames = new Set(dbPlans.map((plan) => plan.name));
        const missing = [...expectedNames].filter((name) => !dbNames.has(name));
        const extras = [...dbNames].filter((name) => !expectedNames.has(name));
        const duplicateNames = [...dbByName.entries()]
            .filter(([, plans]) => plans.length > 1)
            .map(([name, plans]) => ({ name, count: plans.length }));
        const keyGroups = new Map();
        for (const plan of dbPlans) {
            const key = normalizeKey(plan);
            const list = (_b = keyGroups.get(key)) !== null && _b !== void 0 ? _b : [];
            list.push(plan);
            keyGroups.set(key, list);
        }
        const duplicateKeys = [...keyGroups.entries()]
            .filter(([, plans]) => plans.length > 1)
            .map(([key, plans]) => ({ key, names: plans.map((p) => p.name) }));
        const mismatches = [];
        for (const [name, expected] of expectedByName.entries()) {
            const dbMatch = dbByName.get(name);
            if (!dbMatch || dbMatch.length === 0)
                continue;
            const diffs = compareFields(expected, dbMatch[0]);
            if (Object.keys(diffs).length > 0) {
                mismatches.push({ name, diffs });
            }
        }
        const emergencyFive = "Emergency Calls - 5 mins";
        const hasEmergencyFive = dbNames.has(emergencyFive);
        console.log("\n📋 Consultation Plans Verification");
        console.log(`Total in DB: ${dbPlans.length}`);
        console.log(`Total expected: ${seed_plans_1.expectedPlans.length}`);
        if (!hasEmergencyFive) {
            console.log(`\n❌ Missing required plan: ${emergencyFive}`);
        }
        if (missing.length > 0) {
            console.log("\n❌ Missing plans:");
            missing.forEach((name) => console.log(`- ${name}`));
        }
        else {
            console.log("\n✅ No missing plans.");
        }
        if (extras.length > 0) {
            console.log("\n⚠️ Extra plans not in catalog:");
            extras.forEach((name) => console.log(`- ${name}`));
        }
        else {
            console.log("\n✅ No extra plans.");
        }
        if (duplicateNames.length > 0) {
            console.log("\n⚠️ Duplicate names found:");
            duplicateNames.forEach((item) => console.log(`- ${item.name} (x${item.count})`));
        }
        else {
            console.log("\n✅ No duplicate names.");
        }
        if (duplicateKeys.length > 0) {
            console.log("\n⚠️ Potential duplicates by key:");
            duplicateKeys.forEach((item) => {
                console.log(`- ${item.key}`);
                item.names.forEach((name) => console.log(`  • ${name}`));
            });
        }
        else {
            console.log("\n✅ No duplicate keys.");
        }
        if (mismatches.length > 0) {
            console.log("\n⚠️ Mismatched plan details:");
            mismatches.forEach((item) => {
                console.log(`- ${item.name}`);
                Object.entries(item.diffs).forEach(([field, diff]) => {
                    const detail = diff;
                    console.log(`  • ${field}: expected ${detail.expected} / actual ${detail.actual}`);
                });
            });
        }
        else {
            console.log("\n✅ All matching plans have correct details.");
        }
    }
    catch (error) {
        console.error("❌ Failed to verify consultation plans:", error);
        process.exitCode = 1;
    }
    finally {
        await app.close();
    }
}
if (require.main === module) {
    verifyPlans();
}
//# sourceMappingURL=verify-plans.js.map