import { NestFactory } from "@nestjs/core"
import { getModelToken } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { AppModule } from "../app.module"
import { ConsultationPlan } from "../schemas/consultation-plan.schema"
import { CreateConsultationPlanDto } from "../consultation-plans/dto/create-consultation-plan.dto"
import { expectedPlans } from "./seed-plans"

const normalize = (value?: string | null) => (value ?? "").trim().toLowerCase()

const normalizeKey = (plan: {
  consultationType?: string
  duration?: number
  price?: number
  consultationCategory?: string
  specialtyRequired?: string | null
  mentalHealthSubType?: string | null
  includesPrescription?: boolean
  isGroupTherapy?: boolean
  isCouplesTherapy?: boolean
}) =>
  [
    plan.consultationType ?? "",
    plan.duration ?? 0,
    plan.price ?? 0,
    plan.consultationCategory ?? "",
    normalize(plan.specialtyRequired),
    normalize(plan.mentalHealthSubType),
    plan.includesPrescription ? "1" : "0",
    plan.isGroupTherapy ? "1" : "0",
    plan.isCouplesTherapy ? "1" : "0",
  ].join("|")

const compareFields = (
  expected: CreateConsultationPlanDto,
  actual: ConsultationPlan
): Record<string, { expected: unknown; actual: unknown }> => {
  const diffs: Record<string, { expected: unknown; actual: unknown }> = {}
  const fields: (keyof CreateConsultationPlanDto)[] = [
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
  ]

  for (const field of fields) {
    const expectedValue = expected[field]
    if (expectedValue === undefined || expectedValue === null) continue
    if (expectedValue !== (actual as ConsultationPlan)[field]) {
      diffs[field] = {
        expected: expectedValue,
        actual: (actual as ConsultationPlan)[field],
      }
    }
  }

  return diffs
}

async function verifyPlans() {
  const app = await NestFactory.createApplicationContext(AppModule)
  try {
    const model = app.get<Model<ConsultationPlan>>(getModelToken(ConsultationPlan.name))
    const dbPlans = await model.find().lean().exec()

    const expectedByName = new Map(
      expectedPlans.map((plan) => [plan.name, plan])
    )

    const dbByName = new Map<string, ConsultationPlan[]>()
    for (const plan of dbPlans) {
      const list = dbByName.get(plan.name) ?? []
      list.push(plan as ConsultationPlan)
      dbByName.set(plan.name, list)
    }

    const expectedNames = new Set(expectedPlans.map((plan) => plan.name))
    const dbNames = new Set(dbPlans.map((plan) => plan.name))

    const missing = [...expectedNames].filter((name) => !dbNames.has(name))
    const extras = [...dbNames].filter((name) => !expectedNames.has(name))

    const duplicateNames = [...dbByName.entries()]
      .filter(([, plans]) => plans.length > 1)
      .map(([name, plans]) => ({ name, count: plans.length }))

    const keyGroups = new Map<string, ConsultationPlan[]>()
    for (const plan of dbPlans) {
      const key = normalizeKey(plan)
      const list = keyGroups.get(key) ?? []
      list.push(plan as ConsultationPlan)
      keyGroups.set(key, list)
    }

    const duplicateKeys = [...keyGroups.entries()]
      .filter(([, plans]) => plans.length > 1)
      .map(([key, plans]) => ({ key, names: plans.map((p) => p.name) }))

    const mismatches: Array<{ name: string; diffs: Record<string, unknown> }> = []
    for (const [name, expected] of expectedByName.entries()) {
      const dbMatch = dbByName.get(name)
      if (!dbMatch || dbMatch.length === 0) continue
      const diffs = compareFields(expected, dbMatch[0])
      if (Object.keys(diffs).length > 0) {
        mismatches.push({ name, diffs })
      }
    }

    const emergencyFive = "Emergency Calls - 5 mins"
    const hasEmergencyFive = dbNames.has(emergencyFive)

    console.log("\n📋 Consultation Plans Verification")
    console.log(`Total in DB: ${dbPlans.length}`)
    console.log(`Total expected: ${expectedPlans.length}`)

    if (!hasEmergencyFive) {
      console.log(`\n❌ Missing required plan: ${emergencyFive}`)
    }

    if (missing.length > 0) {
      console.log("\n❌ Missing plans:")
      missing.forEach((name) => console.log(`- ${name}`))
    } else {
      console.log("\n✅ No missing plans.")
    }

    if (extras.length > 0) {
      console.log("\n⚠️ Extra plans not in catalog:")
      extras.forEach((name) => console.log(`- ${name}`))
    } else {
      console.log("\n✅ No extra plans.")
    }

    if (duplicateNames.length > 0) {
      console.log("\n⚠️ Duplicate names found:")
      duplicateNames.forEach((item) => console.log(`- ${item.name} (x${item.count})`))
    } else {
      console.log("\n✅ No duplicate names.")
    }

    if (duplicateKeys.length > 0) {
      console.log("\n⚠️ Potential duplicates by key:")
      duplicateKeys.forEach((item) => {
        console.log(`- ${item.key}`)
        item.names.forEach((name) => console.log(`  • ${name}`))
      })
    } else {
      console.log("\n✅ No duplicate keys.")
    }

    if (mismatches.length > 0) {
      console.log("\n⚠️ Mismatched plan details:")
      mismatches.forEach((item) => {
        console.log(`- ${item.name}`)
        Object.entries(item.diffs).forEach(([field, diff]) => {
          const detail = diff as { expected: unknown; actual: unknown }
          console.log(`  • ${field}: expected ${detail.expected} / actual ${detail.actual}`)
        })
      })
    } else {
      console.log("\n✅ All matching plans have correct details.")
    }
  } catch (error) {
    console.error("❌ Failed to verify consultation plans:", error)
    process.exitCode = 1
  } finally {
    await app.close()
  }
}

if (require.main === module) {
  verifyPlans()
}
