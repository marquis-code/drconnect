import { NestFactory } from "@nestjs/core"
import { getModelToken } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { AppModule } from "../app.module"
import { ConsultationPlan } from "../schemas/consultation-plan.schema"
import {
  ConsultationMode,
  ConsultationType,
  MentalHealthSubType,
} from "../schemas/shared-enums"

const DEFAULT_AVAILABLE_DAYS = [1, 2, 3, 4, 5, 6]
const DEFAULT_TIME_RANGE = "08:00-20:00"
const DEFAULT_EMERGENCY_DAYS = [0, 1, 2, 3, 4, 5, 6]
const DEFAULT_EMERGENCY_TIME_RANGE = "00:00-23:59"

const PREP_INSTRUCTIONS: Record<string, string> = {
  [ConsultationType.FIRST_CONTACT]:
    "Please have your medical history and current medications list ready",
  [ConsultationType.FOLLOW_UP]:
    "Please have notes from your previous consultation ready",
  [ConsultationType.ROUTINE_CHECKUP]:
    "Please note any health concerns or changes you'd like to discuss",
  [ConsultationType.MEDICAL_REVIEW]:
    "Please have your treatment records and any questions about your current treatment ready",
  [ConsultationType.LAB_RESULT_REVIEW]:
    "Have your lab results and any related medical documents ready",
  [ConsultationType.PRESCRIPTION_REFILL]:
    "Have your current medication details and pharmacy information ready",
  [ConsultationType.EMERGENCY]:
    "Be ready to discuss urgent symptoms and any immediate concerns",
  [ConsultationType.MENTAL_HEALTH]:
    "Be ready to discuss your mental health concerns in a safe, confidential environment",
  [ConsultationType.PEDIATRIC]:
    "Have your child's medical history, vaccination records, and current symptoms documented",
  [ConsultationType.GERIATRIC]:
    "Have medical history, current medications, and recent health changes documented",
  [ConsultationType.NUTRITION_COUNSELING]:
    "Prepare information about your current diet, health goals, and any dietary restrictions",
  [ConsultationType.WELLNESS_CONSULTATION]:
    "Prepare questions about your health goals and lifestyle habits",
  [ConsultationType.SPIRITUALITY_COUNSELING]:
    "Be ready to discuss your spiritual concerns and how they relate to your health journey",
  [ConsultationType.PREMARITAL_COUNSELING]:
    "Both partners should be present. Prepare questions about health, family planning, and genetic considerations",
  [ConsultationType.MARRIAGE_RELATIONSHIP_COUNSELING]:
    "Both partners should be in a private, quiet location. Prepare to discuss relationship challenges openly",
  [ConsultationType.SICK_NOTE]:
    "Have your treatment records and employer requirements ready",
  [ConsultationType.REFERRAL]:
    "Have your medical records and reason for referral ready",
}

const TYPE_TAGS: Record<string, string[]> = {
  [ConsultationType.FIRST_CONTACT]: ["new-patient", "initial"],
  [ConsultationType.FOLLOW_UP]: ["follow-up", "existing-patient"],
  [ConsultationType.ROUTINE_CHECKUP]: ["checkup", "routine", "preventive"],
  [ConsultationType.MEDICAL_REVIEW]: ["review", "existing-patient", "treatment"],
  [ConsultationType.LAB_RESULT_REVIEW]: ["lab-results", "review", "diagnosis"],
  [ConsultationType.PRESCRIPTION_REFILL]: ["prescription", "refill", "medication"],
  [ConsultationType.EMERGENCY]: ["urgent", "emergency", "priority"],
  [ConsultationType.MENTAL_HEALTH]: ["mental-health", "therapy", "counseling"],
  [ConsultationType.PEDIATRIC]: ["pediatric", "children", "prescription"],
  [ConsultationType.GERIATRIC]: ["geriatric", "elderly", "prescription"],
  [ConsultationType.NUTRITION_COUNSELING]: ["nutrition", "diet", "counseling"],
  [ConsultationType.WELLNESS_CONSULTATION]: ["wellness", "preventive", "health"],
  [ConsultationType.SPIRITUALITY_COUNSELING]: ["spirituality", "counseling", "healing", "prayers"],
  [ConsultationType.PREMARITAL_COUNSELING]: ["premarital", "counseling", "couples"],
  [ConsultationType.MARRIAGE_RELATIONSHIP_COUNSELING]: ["marriage", "relationship", "counseling", "sex-therapy"],
  [ConsultationType.SICK_NOTE]: ["sick-note", "certificate", "medical-leave"],
  [ConsultationType.REFERRAL]: ["referral", "specialist"],
}

const SPECIAL_CONDITIONS_SICK_NOTE =
  "Only for patients who received treatment from Doctors Dey online or onsite from Doctors Dey's Diagonal Therapy Clinics."

const normalizeKey = (plan: ConsultationPlan) => {
  const safe = (value?: string | null) => (value || "").trim().toLowerCase()
  const bool = (value?: boolean | null) => (value ? "1" : "0")
  return [
    plan.consultationType,
    plan.duration,
    plan.price,
    plan.consultationCategory,
    safe(plan.specialtyRequired),
    safe(plan.mentalHealthSubType),
    bool(plan.includesPrescription),
    bool(plan.isGroupTherapy),
    bool(plan.isCouplesTherapy),
  ].join("|")
}

const planScore = (plan: ConsultationPlan) => {
  let score = 0
  if (plan.availableDays && plan.availableDays.length > 0) score += 2
  if (plan.availableTimeRange) score += 2
  if (plan.consultationModes && plan.consultationModes.length > 1) score += 2
  if (plan.tags && plan.tags.length > 0) score += 1
  if (plan.preparationInstructions) score += 2
  if (plan.minAdvanceBookingHours !== undefined && plan.minAdvanceBookingHours !== null)
    score += 1
  if (plan.maxAdvanceBookingHours !== undefined && plan.maxAdvanceBookingHours !== null)
    score += 1
  if (plan.requiresPreApproval !== undefined && plan.requiresPreApproval !== null) score += 1
  if (plan.isNewPatientOnly !== undefined && plan.isNewPatientOnly !== null) score += 1
  if (plan.isExistingPatientOnly !== undefined && plan.isExistingPatientOnly !== null) score += 1
  return score
}

const applyDefaults = (plan: ConsultationPlan) => {
  const updated: Partial<ConsultationPlan> = {}

  const isEmergency = plan.consultationType === ConsultationType.EMERGENCY
  const isMentalHealth = plan.consultationType === ConsultationType.MENTAL_HEALTH
  const isPremarital = plan.consultationType === ConsultationType.PREMARITAL_COUNSELING
  const isMarriage = plan.consultationType === ConsultationType.MARRIAGE_RELATIONSHIP_COUNSELING

  if (!plan.availableDays || plan.availableDays.length === 0) {
    updated.availableDays = isEmergency ? DEFAULT_EMERGENCY_DAYS : DEFAULT_AVAILABLE_DAYS
  }

  if (!plan.availableTimeRange) {
    updated.availableTimeRange = isEmergency
      ? DEFAULT_EMERGENCY_TIME_RANGE
      : DEFAULT_TIME_RANGE
  }

  if (!plan.consultationModes || plan.consultationModes.length === 0) {
    updated.consultationModes = [ConsultationMode.VIDEO, ConsultationMode.VOICE]
  }

  if (!plan.tags || plan.tags.length === 0) {
    updated.tags = TYPE_TAGS[plan.consultationType] || []
  }

  if (!plan.preparationInstructions) {
    updated.preparationInstructions = PREP_INSTRUCTIONS[plan.consultationType] || null
  }

  if (plan.minAdvanceBookingHours === null || plan.minAdvanceBookingHours === undefined) {
    updated.minAdvanceBookingHours = isEmergency ? 0 : 2
  }

  if (plan.maxAdvanceBookingHours === null || plan.maxAdvanceBookingHours === undefined) {
    updated.maxAdvanceBookingHours = 720
  }

  if (plan.requiresPreApproval === null || plan.requiresPreApproval === undefined) {
    updated.requiresPreApproval = false
  }

  if (plan.isNewPatientOnly === null || plan.isNewPatientOnly === undefined) {
    updated.isNewPatientOnly = plan.consultationType === ConsultationType.FIRST_CONTACT
  }

  if (plan.isExistingPatientOnly === null || plan.isExistingPatientOnly === undefined) {
    const existingOnlyTypes = new Set([
      ConsultationType.FOLLOW_UP,
      ConsultationType.MEDICAL_REVIEW,
      ConsultationType.PRESCRIPTION_REFILL,
      ConsultationType.SICK_NOTE,
    ])
    updated.isExistingPatientOnly = existingOnlyTypes.has(plan.consultationType)
  }

  if (plan.includesPrescription === null || plan.includesPrescription === undefined) {
    const prescriptionTypes = new Set([
      ConsultationType.PEDIATRIC,
      ConsultationType.GERIATRIC,
      ConsultationType.PRESCRIPTION_REFILL,
    ])
    updated.includesPrescription = prescriptionTypes.has(plan.consultationType)
  }

  if (isMentalHealth) {
    if (plan.mentalHealthSubType === MentalHealthSubType.DEPRESSION_TREATMENT) {
      updated.includesPrescription = true
    }
    if (plan.mentalHealthSubType === MentalHealthSubType.ANXIETY_TREATMENT) {
      updated.includesPrescription = true
    }
  }

  if (plan.isPriority === null || plan.isPriority === undefined) {
    updated.isPriority = isEmergency
  }

  if (plan.isCouplesTherapy === null || plan.isCouplesTherapy === undefined) {
    updated.isCouplesTherapy = isPremarital || isMarriage
  }

  if (plan.isGroupTherapy === null || plan.isGroupTherapy === undefined) {
    updated.isGroupTherapy =
      plan.mentalHealthSubType === MentalHealthSubType.FAMILY_GROUP_THERAPY
  }

  if (plan.specialConditions === null || plan.specialConditions === undefined) {
    if (plan.consultationType === ConsultationType.SICK_NOTE) {
      updated.specialConditions = SPECIAL_CONDITIONS_SICK_NOTE
    }
  }

  return updated
}

async function cleanup() {
  const app = await NestFactory.createApplicationContext(AppModule)
  try {
    const model = app.get<Model<ConsultationPlan>>(getModelToken(ConsultationPlan.name))
    const plans = await model.find().exec()

    const groups = new Map<string, ConsultationPlan[]>()
    for (const plan of plans) {
      const key = normalizeKey(plan)
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key)!.push(plan)
    }

    const idsToDelete: string[] = []
    let updatedCount = 0

    for (const [, group] of groups) {
      const sorted = group
        .slice()
        .sort((a, b) => planScore(b) - planScore(a))
      const keeper = sorted[0]
      const duplicates = sorted.slice(1)

      if (duplicates.length > 0) {
        idsToDelete.push(...duplicates.map((plan) => plan._id.toString()))
      }

      const defaults = applyDefaults(keeper)
      if (Object.keys(defaults).length > 0) {
        await model.updateOne({ _id: keeper._id }, { $set: defaults }).exec()
        updatedCount++
      }
    }

    if (idsToDelete.length > 0) {
      await model.deleteMany({ _id: { $in: idsToDelete } }).exec()
    }

    console.log(
      `✅ Cleanup complete. Updated ${updatedCount} plans. Removed ${idsToDelete.length} duplicates.`
    )
  } catch (error) {
    console.error("❌ Failed to cleanup consultation plans:", error)
    process.exitCode = 1
  } finally {
    await app.close()
  }
}

cleanup()
