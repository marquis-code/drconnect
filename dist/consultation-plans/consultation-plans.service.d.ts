import { Model } from "mongoose";
import { ConsultationPlan } from "src/schemas/consultation-plan.schema";
import { ConsultationType, ConsultationCategory } from "src/schemas/shared-enums";
import { CreateConsultationPlanDto } from "./dto/create-consultation-plan.dto";
import { UpdateConsultationPlanDto } from "./dto/update-consultation-plan.dto";
interface GetAllPlansOptions {
    includeInactive?: boolean;
    consultationType?: ConsultationType;
    consultationCategory?: ConsultationCategory;
    minPrice?: number;
    maxPrice?: number;
}
export declare class ConsultationPlansService {
    private consultationPlanModel;
    constructor(consultationPlanModel: Model<ConsultationPlan>);
    createPlan(createPlanDto: CreateConsultationPlanDto): Promise<ConsultationPlan>;
    getAllPlans(options?: GetAllPlansOptions): Promise<ConsultationPlan[]>;
    getPlanById(planId: string): Promise<ConsultationPlan>;
    getPlansByType(consultationType: ConsultationType): Promise<ConsultationPlan[]>;
    getPlansByCategory(consultationCategory: ConsultationCategory): Promise<ConsultationPlan[]>;
    getPlansForNewPatients(): Promise<ConsultationPlan[]>;
    getPlansForExistingPatients(): Promise<ConsultationPlan[]>;
    updatePlan(planId: string, updatePlanDto: UpdateConsultationPlanDto): Promise<ConsultationPlan>;
    deletePlan(planId: string): Promise<void>;
    togglePlanStatus(planId: string): Promise<ConsultationPlan>;
    reorderPlans(orderData: {
        planId: string;
        sortOrder: number;
    }[]): Promise<void>;
    isPlanAvailableForDateTime(planId: string, date: Date, timeSlot: string): Promise<boolean>;
    getAvailablePlansForDate(date: Date, consultationType?: ConsultationType, consultationCategory?: ConsultationCategory): Promise<ConsultationPlan[]>;
    batchCreatePlans(plans: CreateConsultationPlanDto[]): Promise<{
        success: ConsultationPlan[];
        failed: Array<{
            plan: CreateConsultationPlanDto;
            error: string;
        }>;
        summary: {
            total: number;
            successful: number;
            failed: number;
        };
    }>;
    batchCreatePlansTransaction(plans: CreateConsultationPlanDto[]): Promise<ConsultationPlan[]>;
    private validateTimeRange;
    isPatientEligibleForPlan(planId: string, isNewPatient: boolean): Promise<boolean>;
}
export {};
