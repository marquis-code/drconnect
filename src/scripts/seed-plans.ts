import { NestFactory } from "@nestjs/core"
import { getModelToken } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { AppModule } from "../app.module"
import { ConsultationPlan } from "../schemas/consultation-plan.schema"
import {
  ConsultationCategory,
  ConsultationMode,
  ConsultationType,
  MentalHealthSubType,
} from "../schemas/shared-enums"
import { CreateConsultationPlanDto } from "../consultation-plans/dto/create-consultation-plan.dto"

type PlanInput = Omit<
  CreateConsultationPlanDto,
  "consultationCategory" | "consultationModes" | "tags"
> &
  Partial<
    Pick<CreateConsultationPlanDto, "consultationCategory" | "consultationModes" | "tags">
  >

const withDefaults = (plan: PlanInput): CreateConsultationPlanDto => ({
  consultationCategory: ConsultationCategory.VIRTUAL,
  consultationModes: [ConsultationMode.VIDEO],
  tags: [],
  ...plan,
})

export const expectedPlans: CreateConsultationPlanDto[] = [
  // CATEGORY A — GENERAL CONSULTATIONS
  withDefaults({
    name: "First Contact - 5 mins",
    description: "Initial consultation for new patients (first contact).",
    consultationType: ConsultationType.FIRST_CONTACT,
    duration: 5,
    price: 10000,
    tags: ["category_a", "general", "first_contact"],
    isNewPatientOnly: true,
  }),
  withDefaults({
    name: "First Contact - 15 mins",
    description: "Initial consultation for new patients (first contact).",
    consultationType: ConsultationType.FIRST_CONTACT,
    duration: 15,
    price: 20000,
    tags: ["category_a", "general", "first_contact"],
    isNewPatientOnly: true,
  }),
  withDefaults({
    name: "First Contact - 20 mins",
    description: "Initial consultation for new patients (first contact).",
    consultationType: ConsultationType.FIRST_CONTACT,
    duration: 20,
    price: 25000,
    tags: ["category_a", "general", "first_contact"],
    isNewPatientOnly: true,
  }),
  withDefaults({
    name: "Routine Checkup / Follow Up - 5 mins",
    description: "Routine checkup or follow-up consultation.",
    consultationType: ConsultationType.ROUTINE_CHECKUP,
    duration: 5,
    price: 7000,
    tags: ["category_a", "general", "routine", "follow_up"],
  }),
  withDefaults({
    name: "Routine Checkup / Follow Up - 10 mins",
    description: "Routine checkup or follow-up consultation.",
    consultationType: ConsultationType.ROUTINE_CHECKUP,
    duration: 10,
    price: 12500,
    tags: ["category_a", "general", "routine", "follow_up"],
  }),
  withDefaults({
    name: "Routine Checkup / Follow Up - 15 mins",
    description: "Routine checkup or follow-up consultation.",
    consultationType: ConsultationType.ROUTINE_CHECKUP,
    duration: 15,
    price: 15000,
    tags: ["category_a", "general", "routine", "follow_up"],
  }),
  withDefaults({
    name: "Routine Checkup / Follow Up - 20 mins",
    description: "Routine checkup or follow-up consultation.",
    consultationType: ConsultationType.ROUTINE_CHECKUP,
    duration: 20,
    price: 20000,
    tags: ["category_a", "general", "routine", "follow_up"],
  }),
  withDefaults({
    name: "Medical Review - 5 mins",
    description: "Review for patients on active treatment.",
    consultationType: ConsultationType.MEDICAL_REVIEW,
    duration: 5,
    price: 7000,
    tags: ["category_a", "general", "medical_review"],
  }),
  withDefaults({
    name: "Medical Review - 10 mins",
    description: "Review for patients on active treatment.",
    consultationType: ConsultationType.MEDICAL_REVIEW,
    duration: 10,
    price: 12500,
    tags: ["category_a", "general", "medical_review"],
  }),
  withDefaults({
    name: "Medical Review - 15 mins",
    description: "Review for patients on active treatment.",
    consultationType: ConsultationType.MEDICAL_REVIEW,
    duration: 15,
    price: 15000,
    tags: ["category_a", "general", "medical_review"],
  }),
  withDefaults({
    name: "Laboratory Result Review - 5 mins",
    description: "Review of laboratory results.",
    consultationType: ConsultationType.LAB_RESULT_REVIEW,
    duration: 5,
    price: 7000,
    tags: ["category_a", "general", "lab_result_review"],
  }),
  withDefaults({
    name: "Laboratory Result Review - 10 mins",
    description: "Review of laboratory results.",
    consultationType: ConsultationType.LAB_RESULT_REVIEW,
    duration: 10,
    price: 12500,
    tags: ["category_a", "general", "lab_result_review"],
  }),
  withDefaults({
    name: "Prescription Refill - 3 mins",
    description: "Medication refill consultation.",
    consultationType: ConsultationType.PRESCRIPTION_REFILL,
    duration: 3,
    price: 5000,
    tags: ["category_a", "general", "prescription_refill"],
  }),
  withDefaults({
    name: "Prescription Refill - 5 mins",
    description: "Medication refill consultation.",
    consultationType: ConsultationType.PRESCRIPTION_REFILL,
    duration: 5,
    price: 7000,
    tags: ["category_a", "general", "prescription_refill"],
  }),
  withDefaults({
    name: "Emergency Calls - 3 mins",
    description: "Urgent medical consultation (priority).",
    consultationType: ConsultationType.EMERGENCY,
    duration: 3,
    price: 7000,
    tags: ["category_a", "general", "emergency", "urgent"],
    isPriority: true,
    minAdvanceBookingHours: 0,
  }),
  withDefaults({
    name: "Emergency Calls - 5 mins",
    description: "Urgent medical consultation (priority).",
    consultationType: ConsultationType.EMERGENCY,
    duration: 5,
    price: 12000,
    tags: ["category_a", "general", "emergency", "urgent"],
    isPriority: true,
    minAdvanceBookingHours: 0,
  }),

  // CATEGORY B — MENTAL HEALTH CONSULTATIONS
  withDefaults({
    name: "General Mental Health Consult - 15 mins",
    description: "General mental health consultation.",
    consultationType: ConsultationType.MENTAL_HEALTH,
    duration: 15,
    price: 20000,
    tags: ["category_b", "mental_health", "general"],
    mentalHealthSubType: MentalHealthSubType.GENERAL,
    specialtyRequired: "Mental Health",
  }),
  withDefaults({
    name: "General Mental Health Consult - 20 mins",
    description: "General mental health consultation.",
    consultationType: ConsultationType.MENTAL_HEALTH,
    duration: 20,
    price: 25000,
    tags: ["category_b", "mental_health", "general"],
    mentalHealthSubType: MentalHealthSubType.GENERAL,
    specialtyRequired: "Mental Health",
  }),
  withDefaults({
    name: "General Mental Health Consult - 35 mins",
    description: "General mental health consultation.",
    consultationType: ConsultationType.MENTAL_HEALTH,
    duration: 35,
    price: 50000,
    tags: ["category_b", "mental_health", "general"],
    mentalHealthSubType: MentalHealthSubType.GENERAL,
    specialtyRequired: "Mental Health",
  }),
  withDefaults({
    name: "Psychotherapy - 30 mins",
    description: "Psychotherapy session.",
    consultationType: ConsultationType.MENTAL_HEALTH,
    duration: 30,
    price: 50000,
    tags: ["category_b", "mental_health", "psychotherapy"],
    mentalHealthSubType: MentalHealthSubType.PSYCHOTHERAPY,
    specialtyRequired: "Mental Health",
  }),
  withDefaults({
    name: "Cognitive Behavioral Therapy (CBT) - 30 mins",
    description: "Cognitive Behavioral Therapy session.",
    consultationType: ConsultationType.MENTAL_HEALTH,
    duration: 30,
    price: 50000,
    tags: ["category_b", "mental_health", "cbt"],
    mentalHealthSubType: MentalHealthSubType.CBT,
    specialtyRequired: "Mental Health",
  }),
  withDefaults({
    name: "Depression Treatment (Plus Prescription) - 30 mins",
    description: "Depression treatment with prescription included.",
    consultationType: ConsultationType.MENTAL_HEALTH,
    duration: 30,
    price: 50000,
    tags: ["category_b", "mental_health", "depression_treatment"],
    mentalHealthSubType: MentalHealthSubType.DEPRESSION_TREATMENT,
    includesPrescription: true,
    specialtyRequired: "Mental Health",
  }),
  withDefaults({
    name: "Anxiety Treatment (Plus Prescription) - 30 mins",
    description: "Anxiety treatment with prescription included.",
    consultationType: ConsultationType.MENTAL_HEALTH,
    duration: 30,
    price: 50000,
    tags: ["category_b", "mental_health", "anxiety_treatment"],
    mentalHealthSubType: MentalHealthSubType.ANXIETY_TREATMENT,
    includesPrescription: true,
    specialtyRequired: "Mental Health",
  }),
  withDefaults({
    name: "Family or Group Therapy - 45 mins",
    description: "Family or group therapy session.",
    consultationType: ConsultationType.MENTAL_HEALTH,
    duration: 45,
    price: 70000,
    tags: ["category_b", "mental_health", "family_group_therapy"],
    mentalHealthSubType: MentalHealthSubType.FAMILY_GROUP_THERAPY,
    isGroupTherapy: true,
    specialtyRequired: "Mental Health",
  }),

  // CATEGORY C — SPECIALTY CARE
  withDefaults({
    name: "Child & Adolescent Health Consultation (Plus Prescription) - 7 mins",
    description: "Child & adolescent health consultation with prescription included.",
    consultationType: ConsultationType.PEDIATRIC,
    duration: 7,
    price: 12500,
    tags: ["category_c", "specialty", "pediatric"],
    includesPrescription: true,
    specialtyRequired: "Child & Adolescent Health",
  }),
  withDefaults({
    name: "Child & Adolescent Health Consultation (Plus Prescription) - 10 mins",
    description: "Child & adolescent health consultation with prescription included.",
    consultationType: ConsultationType.PEDIATRIC,
    duration: 10,
    price: 15000,
    tags: ["category_c", "specialty", "pediatric"],
    includesPrescription: true,
    specialtyRequired: "Child & Adolescent Health",
  }),
  withDefaults({
    name: "Child & Adolescent Health Consultation (Plus Prescription) - 20 mins",
    description: "Child & adolescent health consultation with prescription included.",
    consultationType: ConsultationType.PEDIATRIC,
    duration: 20,
    price: 30000,
    tags: ["category_c", "specialty", "pediatric"],
    includesPrescription: true,
    specialtyRequired: "Child & Adolescent Health",
  }),
  withDefaults({
    name: "Geriatric Consultation (Plus Prescription) - 7 mins",
    description: "Geriatric consultation with prescription included.",
    consultationType: ConsultationType.GERIATRIC,
    duration: 7,
    price: 12500,
    tags: ["category_c", "specialty", "geriatric"],
    includesPrescription: true,
    specialtyRequired: "Geriatric",
  }),
  withDefaults({
    name: "Geriatric Consultation (Plus Prescription) - 10 mins",
    description: "Geriatric consultation with prescription included.",
    consultationType: ConsultationType.GERIATRIC,
    duration: 10,
    price: 15000,
    tags: ["category_c", "specialty", "geriatric"],
    includesPrescription: true,
    specialtyRequired: "Geriatric",
  }),
  withDefaults({
    name: "Geriatric Consultation (Plus Prescription) - 20 mins",
    description: "Geriatric consultation with prescription included.",
    consultationType: ConsultationType.GERIATRIC,
    duration: 20,
    price: 30000,
    tags: ["category_c", "specialty", "geriatric"],
    includesPrescription: true,
    specialtyRequired: "Geriatric",
  }),
  withDefaults({
    name: "Eye Care Consultation - 7 mins",
    description: "Eye care specialty consultation.",
    consultationType: ConsultationType.PROCEDURE_CONSULTATION,
    duration: 7,
    price: 12500,
    tags: ["category_c", "specialty", "eye_care"],
    specialtyRequired: "Eye Care",
  }),
  withDefaults({
    name: "Eye Care Consultation - 10 mins",
    description: "Eye care specialty consultation.",
    consultationType: ConsultationType.PROCEDURE_CONSULTATION,
    duration: 10,
    price: 15000,
    tags: ["category_c", "specialty", "eye_care"],
    specialtyRequired: "Eye Care",
  }),
  withDefaults({
    name: "Eye Care Consultation - 20 mins",
    description: "Eye care specialty consultation.",
    consultationType: ConsultationType.PROCEDURE_CONSULTATION,
    duration: 20,
    price: 30000,
    tags: ["category_c", "specialty", "eye_care"],
    specialtyRequired: "Eye Care",
  }),
  withDefaults({
    name: "Wellness Consultation - 5 mins",
    description: "Preventive health and wellness advice.",
    consultationType: ConsultationType.WELLNESS_CONSULTATION,
    duration: 5,
    price: 10000,
    tags: ["category_c", "wellness"],
  }),
  withDefaults({
    name: "Wellness Consultation - 15 mins",
    description: "Preventive health and wellness advice.",
    consultationType: ConsultationType.WELLNESS_CONSULTATION,
    duration: 15,
    price: 20000,
    tags: ["category_c", "wellness"],
  }),
  withDefaults({
    name: "Wellness Consultation - 20 mins",
    description: "Preventive health and wellness advice.",
    consultationType: ConsultationType.WELLNESS_CONSULTATION,
    duration: 20,
    price: 25000,
    tags: ["category_c", "wellness"],
  }),
  withDefaults({
    name: "Nutrition Counseling - 5 mins",
    description: "Dietary and nutrition consultation.",
    consultationType: ConsultationType.NUTRITION_COUNSELING,
    duration: 5,
    price: 7000,
    tags: ["category_c", "nutrition"],
  }),
  withDefaults({
    name: "Nutrition Counseling - 10 mins",
    description: "Dietary and nutrition consultation.",
    consultationType: ConsultationType.NUTRITION_COUNSELING,
    duration: 10,
    price: 12500,
    tags: ["category_c", "nutrition"],
  }),
  withDefaults({
    name: "Nutrition Counseling - 15 mins",
    description: "Dietary and nutrition consultation.",
    consultationType: ConsultationType.NUTRITION_COUNSELING,
    duration: 15,
    price: 15000,
    tags: ["category_c", "nutrition"],
  }),
  withDefaults({
    name: "Spirituality in Medicine Counseling - 5 mins",
    description: "Counseling on spirituality in medicine (including spiritual healing and prayers).",
    consultationType: ConsultationType.SPIRITUALITY_COUNSELING,
    duration: 5,
    price: 10000,
    tags: ["category_c", "spirituality"],
  }),
  withDefaults({
    name: "Spirituality in Medicine Counseling - 15 mins",
    description: "Counseling on spirituality in medicine (including spiritual healing and prayers).",
    consultationType: ConsultationType.SPIRITUALITY_COUNSELING,
    duration: 15,
    price: 20000,
    tags: ["category_c", "spirituality"],
  }),
  withDefaults({
    name: "Spirituality in Medicine Counseling - 20 mins",
    description: "Counseling on spirituality in medicine (including spiritual healing and prayers).",
    consultationType: ConsultationType.SPIRITUALITY_COUNSELING,
    duration: 20,
    price: 25000,
    tags: ["category_c", "spirituality"],
  }),

  // CATEGORY D — MARRIAGE/RELATIONSHIP CONSULTATION
  withDefaults({
    name: "Premarital Medical Counseling & Screening - 10 mins",
    description: "Premarital medical counseling and screening.",
    consultationType: ConsultationType.PREMARITAL_COUNSELING,
    duration: 10,
    price: 10000,
    tags: ["category_d", "premarital"],
    isCouplesTherapy: true,
  }),
  withDefaults({
    name: "Premarital Medical Counseling & Screening - 15 mins",
    description: "Premarital medical counseling and screening.",
    consultationType: ConsultationType.PREMARITAL_COUNSELING,
    duration: 15,
    price: 20000,
    tags: ["category_d", "premarital"],
    isCouplesTherapy: true,
  }),
  withDefaults({
    name: "Premarital Medical Counseling & Screening - 20 mins",
    description: "Premarital medical counseling and screening.",
    consultationType: ConsultationType.PREMARITAL_COUNSELING,
    duration: 20,
    price: 25000,
    tags: ["category_d", "premarital"],
    isCouplesTherapy: true,
  }),
  withDefaults({
    name: "Marriage/Relationship Counseling - 15 mins",
    description: "Marriage and relationship counseling.",
    consultationType: ConsultationType.MARRIAGE_RELATIONSHIP_COUNSELING,
    duration: 15,
    price: 30000,
    tags: ["category_d", "marriage_relationship"],
    isCouplesTherapy: true,
  }),
  withDefaults({
    name: "Marriage/Relationship Counseling - 30 mins",
    description: "Marriage and relationship counseling.",
    consultationType: ConsultationType.MARRIAGE_RELATIONSHIP_COUNSELING,
    duration: 30,
    price: 45000,
    tags: ["category_d", "marriage_relationship"],
    isCouplesTherapy: true,
  }),
  withDefaults({
    name: "Marriage/Relationship Counseling - 60 mins",
    description: "Marriage and relationship counseling.",
    consultationType: ConsultationType.MARRIAGE_RELATIONSHIP_COUNSELING,
    duration: 60,
    price: 80000,
    tags: ["category_d", "marriage_relationship"],
    isCouplesTherapy: true,
  }),
  withDefaults({
    name: "Sex Therapy/Counseling - 15 mins",
    description: "Sex therapy and counseling session.",
    consultationType: ConsultationType.MARRIAGE_RELATIONSHIP_COUNSELING,
    duration: 15,
    price: 30000,
    tags: ["category_d", "sex_therapy"],
    isCouplesTherapy: true,
  }),
  withDefaults({
    name: "Sex Therapy/Counseling - 30 mins",
    description: "Sex therapy and counseling session.",
    consultationType: ConsultationType.MARRIAGE_RELATIONSHIP_COUNSELING,
    duration: 30,
    price: 45000,
    tags: ["category_d", "sex_therapy"],
    isCouplesTherapy: true,
  }),
  withDefaults({
    name: "Sex Therapy/Counseling - 60 mins",
    description: "Sex therapy and counseling session.",
    consultationType: ConsultationType.MARRIAGE_RELATIONSHIP_COUNSELING,
    duration: 60,
    price: 80000,
    tags: ["category_d", "sex_therapy"],
    isCouplesTherapy: true,
  }),

  // CATEGORY E — OTHERS
  withDefaults({
    name: "Sick Note - Less than 3 days",
    description: "Sick note for less than 3 days.",
    consultationType: ConsultationType.SICK_NOTE,
    duration: 5,
    price: 5000,
    tags: ["category_e", "sick_note"],
    isExistingPatientOnly: true,
    specialConditions:
      "Exclusive to patients who received treatment from Doctors Dey online or onsite from Doctors Dey's Diagonal Therapy Clinics.",
  }),
  withDefaults({
    name: "Sick Note - Greater than 3 days",
    description: "Sick note for greater than 3 days.",
    consultationType: ConsultationType.SICK_NOTE,
    duration: 10,
    price: 10000,
    tags: ["category_e", "sick_note"],
    isExistingPatientOnly: true,
    specialConditions:
      "Exclusive to patients who received treatment from Doctors Dey online or onsite from Doctors Dey's Diagonal Therapy Clinics.",
  }),
  withDefaults({
    name: "Referral Note",
    description: "Specialist referral note consultation.",
    consultationType: ConsultationType.REFERRAL,
    duration: 5,
    price: 5000,
    tags: ["category_e", "referral"],
  }),
]

const dedupeByName = (items: CreateConsultationPlanDto[]) => {
  const map = new Map<string, CreateConsultationPlanDto>()
  for (const item of items) {
    if (!map.has(item.name)) {
      map.set(item.name, item)
    }
  }
  return Array.from(map.values())
}

export async function seedPlans() {
  const app = await NestFactory.createApplicationContext(AppModule)
  try {
    const model = app.get<Model<ConsultationPlan>>(getModelToken(ConsultationPlan.name))

    const uniquePlans = dedupeByName(expectedPlans)
    const names = uniquePlans.map((plan) => plan.name)

    const existing = await model
      .find({ name: { $in: names } })
      .select("name")
      .lean()
      .exec()

    const existingNames = new Set(existing.map((plan) => plan.name))

    const newPlans = uniquePlans.filter((plan) => !existingNames.has(plan.name))

    if (newPlans.length === 0) {
      console.log("✅ Consultation plans already seeded. No new plans to insert.")
      return
    }

    const plansWithOrder = newPlans.map((plan, index) => ({
      ...plan,
      sortOrder: plan.sortOrder ?? index + 1,
    }))

    const inserted = await model.insertMany(plansWithOrder, { ordered: false })
    console.log(`✅ Seeded ${inserted.length} consultation plans.`)
  } catch (error) {
    console.error("❌ Failed to seed consultation plans:", error)
    process.exitCode = 1
  } finally {
    await app.close()
  }
}

if (require.main === module) {
  seedPlans()
}
