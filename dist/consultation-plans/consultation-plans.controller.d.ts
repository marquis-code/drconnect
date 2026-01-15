import { ConsultationPlansService } from "./consultation-plans.service";
import { CreateConsultationPlanDto } from "./dto/create-consultation-plan.dto";
import { UpdateConsultationPlanDto } from "./dto/update-consultation-plan.dto";
import { ConsultationType, ConsultationCategory } from "src/schemas/consultation-plan.schema";
export declare class ConsultationPlansController {
    private consultationPlansService;
    constructor(consultationPlansService: ConsultationPlansService);
    createPlan(createPlanDto: CreateConsultationPlanDto): Promise<import("src/schemas/consultation-plan.schema").ConsultationPlan>;
    getAllPlans(includeInactive?: boolean, consultationType?: ConsultationType, consultationCategory?: ConsultationCategory, minPriceParam?: string, maxPriceParam?: string): Promise<import("src/schemas/consultation-plan.schema").ConsultationPlan[]>;
    getAvailablePlansForDate(date: string, consultationType?: ConsultationType, consultationCategory?: ConsultationCategory): Promise<import("src/schemas/consultation-plan.schema").ConsultationPlan[]>;
    getPlansByType(consultationType: ConsultationType): Promise<import("src/schemas/consultation-plan.schema").ConsultationPlan[]>;
    getPlansByCategory(consultationCategory: ConsultationCategory): Promise<import("src/schemas/consultation-plan.schema").ConsultationPlan[]>;
    getPlansForNewPatients(): Promise<import("src/schemas/consultation-plan.schema").ConsultationPlan[]>;
    getPlansForExistingPatients(): Promise<import("src/schemas/consultation-plan.schema").ConsultationPlan[]>;
    getPlanById(id: string): Promise<import("src/schemas/consultation-plan.schema").ConsultationPlan>;
    updatePlan(id: string, updatePlanDto: UpdateConsultationPlanDto): Promise<import("src/schemas/consultation-plan.schema").ConsultationPlan>;
    togglePlanStatus(id: string): Promise<import("src/schemas/consultation-plan.schema").ConsultationPlan>;
    reorderPlans(orderData: {
        planId: string;
        sortOrder: number;
    }[]): Promise<void>;
    deletePlan(id: string): Promise<void>;
}
