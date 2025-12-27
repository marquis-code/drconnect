// src/scripts/verify-plans.ts
import { NestFactory } from "@nestjs/core"
import { AppModule } from "../app.module"
import { ConsultationPlansService } from "../consultation-plans/consultation-plans.service"

async function verifyPlans() {
  const app = await NestFactory.createApplicationContext(AppModule)
  const plansService = app.get(ConsultationPlansService)

  console.log("🔍 Checking consultation plans...")
  
  const plans = await plansService.getAllPlans(true)
  
  console.log(`\n📊 Total Plans: ${plans.length}`)
  console.log("─".repeat(60))
  
  plans.forEach((plan, index) => {
    console.log(`\n${index + 1}. ${plan.name}`)
    console.log(`   Type: ${plan.consultationType}`)
    console.log(`   Duration: ${plan.duration} minutes`)
    console.log(`   Price: ₦${plan.price.toLocaleString()}`)
    console.log(`   Available Days: ${plan.availableDays.join(", ")}`)
    if (plan.availableTimeRange) {
      console.log(`   Time Range: ${plan.availableTimeRange}`)
    }
    console.log(`   Active: ${plan.isActive ? "✅" : "❌"}`)
  })
  
  console.log("\n" + "─".repeat(60))
  
  const virtualPlans = plans.filter(p => p.consultationType === "virtual")
  const physicalPlans = plans.filter(p => p.consultationType === "physical")
  
  console.log(`\n📱 Virtual Plans: ${virtualPlans.length}`)
  console.log(`🏥 Physical Plans: ${physicalPlans.length}`)
  
  if (virtualPlans.length === 3 && physicalPlans.length === 2) {
    console.log("\n🎉 All plans successfully seeded!")
  } else {
    console.log("\n⚠️  Expected 3 virtual and 2 physical plans")
  }

  await app.close()
}

verifyPlans().catch((error) => {
  console.error("Verification failed:", error)
  process.exit(1)
})