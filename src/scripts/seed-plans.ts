// src/scripts/seed-plans.ts
import { NestFactory } from "@nestjs/core"
import { AppModule } from "../app.module"
import { ConsultationPlansService } from "../consultation-plans/consultation-plans.service"

async function seedPlans() {
  const app = await NestFactory.createApplicationContext(AppModule)
  const plansService = app.get(ConsultationPlansService)

  const plans = [
    {
      name: "Virtual Consultation - 20 Minutes",
      description: "Quick virtual consultation session for follow-ups or brief medical inquiries",
      consultationType: "virtual",
      duration: 20,
      price: 30000,
      availableDays: [0, 1, 2, 3, 4, 5, 6], // All days
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
      availableDays: [0, 1, 2, 3, 4, 5, 6], // All days
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
      availableDays: [0, 1, 2, 3, 4, 5, 6], // All days
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
      availableDays: [6], // Saturday only
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
      availableDays: [4], // Thursday only
      availableTimeRange: "09:00-17:00",
      consultationModes: ["video"],
      isActive: true,
      sortOrder: 5,
    },
  ]

  console.log("🌱 Starting to seed consultation plans...")

  for (const plan of plans) {
    try {
      const created = await plansService.createPlan(plan)
      console.log(`✅ Created: ${created.name}`)
    } catch (error) {
      console.error(`❌ Failed to create ${plan.name}:`, error.message)
    }
  }

  await app.close()
  console.log("🎉 Seeding completed!")
}

seedPlans().catch((error) => {
  console.error("Seeding failed:", error)
  process.exit(1)
})