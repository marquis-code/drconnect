// src/schemas/shared-enums.ts
// Shared enums used across multiple schemas

export enum ConsultationType {
  // Primary Consultation Types
  FIRST_CONTACT = "first_contact", // Initial consultation for new patients
  FOLLOW_UP = "follow_up", // Follow-up after initial consultation
  MEDICAL_REVIEW = "medical_review", // Review for patients on active treatment
  
  // Specialized Consultation Types
  EMERGENCY = "emergency", // Urgent medical consultation (prioritized, answered immediately or within the hour)
  ROUTINE_CHECKUP = "routine_checkup", // Regular health checkup (similar to follow-up)
  PRESCRIPTION_REFILL = "prescription_refill", // Medication refill consultation
  LAB_RESULT_REVIEW = "lab_result_review", // Review of laboratory results (similar to medical review)
  SECOND_OPINION = "second_opinion", // Second opinion consultation (similar to first contact)
  
  // Specialized Medical Services
  MENTAL_HEALTH = "mental_health", // Psychiatric/psychological consultation (includes psychotherapy, CBT, depression/anxiety treatment, family/group therapy)
  PEDIATRIC = "pediatric", // Children's health consultation (includes prescription)
  GERIATRIC = "geriatric", // Elderly care consultation (includes prescription)
  NUTRITION_COUNSELING = "nutrition_counseling", // Dietary consultation
  CHRONIC_DISEASE_MANAGEMENT = "chronic_disease_management", // Chronic disease management
  PRENATAL_POSTNATAL = "prenatal_postnatal", // Prenatal/postnatal care
  PRE_OPERATIVE = "pre_operative", // Pre-operative consultation
  POST_OPERATIVE = "post_operative", // Post-operative consultation
  PROCEDURE_CONSULTATION = "procedure_consultation", // Procedure consultation
  HEALTH_SCREENING = "health_screening", // Health screening
  VACCINATION = "vaccination", // Vaccination consultation
  
  // Wellness & Counseling
  WELLNESS_CONSULTATION = "wellness_consultation", // Preventive health advice
  SPIRITUALITY_COUNSELING = "spirituality_counseling", // Counseling on spirituality in medicine (including spiritual healing and prayers)
  PREMARITAL_COUNSELING = "premarital_counseling", // Premarital medical counseling
  MARRIAGE_RELATIONSHIP_COUNSELING = "marriage_relationship_counseling", // Marriage/relationship counseling (including sex therapy/counseling)
  
  // Administrative/Other
  SICK_NOTE = "sick_note", // Medical certificate consultation (only for treated patients)
  REFERRAL = "referral", // Specialist referral consultation
  
  // Onsite Services
  ONSITE_THERAPY = "onsite_therapy", // Physical therapy session (all forms of health and marital/relationship counseling)
}

export enum ConsultationMode {
  VIDEO = "video",
  VOICE = "voice",
  CHAT = "chat",
  IN_PERSON = "in_person"
}

export enum ConsultationCategory {
  PHYSICAL = "physical", // In-person consultation
  VIRTUAL = "virtual", // Remote consultation (video/voice/chat)
  HYBRID = "hybrid" // Can be either physical or virtual
}

export enum AppointmentStatus {
  BOOKED = "booked",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELED = "canceled",
  NO_SHOW = "no_show",
  RESCHEDULED = "rescheduled"
}

export enum PaymentStatus {
  PENDING = "pending",
  SUCCESSFUL = "successful",
  FAILED = "failed",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded"
}

// Sub-types for Mental Health consultations
export enum MentalHealthSubType {
  GENERAL = "general", // General mental health consultation
  PSYCHOTHERAPY = "psychotherapy", // Psychotherapy session
  CBT = "cbt", // Cognitive Behavioral Therapy
  DEPRESSION_TREATMENT = "depression_treatment", // Depression treatment (plus prescription)
  ANXIETY_TREATMENT = "anxiety_treatment", // Anxiety treatment (plus prescription)
  FAMILY_GROUP_THERAPY = "family_group_therapy", // Family or group therapy
}