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

const buildUpdate = (plan: CreateConsultationPlanDto) => {
  const fields: (keyof CreateConsultationPlanDto)[] = [
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
  ]

  const update: Partial<CreateConsultationPlanDto> = {}
  for (const field of fields) {
    const value = plan[field]
    if (value !== undefined) {
      update[field] = value
    }
  }
  return update
}

async function syncPlans() {
  const app = await NestFactory.createApplicationContext(AppModule)
  try {
    const model = app.get<Model<ConsultationPlan>>(getModelToken(ConsultationPlan.name))
    const dbPlans = await model.find().exec()

    const byName = new Map(dbPlans.map((plan) => [plan.name, plan]))
    const byKey = new Map<string, ConsultationPlan[]>()
    for (const plan of dbPlans) {
      const key = normalizeKey(plan)
      const list = byKey.get(key) ?? []
      list.push(plan)
      byKey.set(key, list)
    }

    const matchedIds = new Set<string>()
    let created = 0
    let updated = 0
    let renamed = 0

    for (const expected of expectedPlans) {
      let target = byName.get(expected.name)
      if (target && matchedIds.has(target._id.toString())) {
        target = undefined
      }
      const expectedKey = normalizeKey(expected)

      if (!target) {
        const keyMatches = byKey.get(expectedKey)
        if (keyMatches && keyMatches.length > 0) {
          target = keyMatches.find((plan) => !matchedIds.has(plan._id.toString()))
        }
      }

      if (target) {
        const update = buildUpdate(expected)
        if (target.name !== expected.name) {
          renamed++
        }
        await model.updateOne({ _id: target._id }, { $set: update }).exec()
        matchedIds.add(target._id.toString())
        updated++
      } else {
        await model.create(expected)
        created++
      }
    }

    const expectedNames = new Set(expectedPlans.map((plan) => plan.name))
    const extras = dbPlans.filter(
      (plan) => !matchedIds.has(plan._id.toString()) && !expectedNames.has(plan.name)
    )

    console.log("\n✅ Consultation plans sync complete.")
    console.log(`Updated: ${updated}`)
    console.log(`Renamed: ${renamed}`)
    console.log(`Created: ${created}`)

    if (extras.length > 0) {
      console.log("\n⚠️ Extra plans not in catalog (left unchanged):")
      extras.forEach((plan) => console.log(`- ${plan.name}`))
    }
  } catch (error) {
    console.error("❌ Failed to sync consultation plans:", error)
    process.exitCode = 1
  } finally {
    await app.close()
  }
}

if (require.main === module) {
  syncPlans()
}
