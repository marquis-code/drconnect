import { ConsultationPlansService } from "./consultation-plans.service";
import { CreateConsultationPlanDto, BatchCreateConsultationPlansDto } from "./dto/create-consultation-plan.dto";
import { UpdateConsultationPlanDto } from "./dto/update-consultation-plan.dto";
import { ConsultationType, ConsultationCategory } from "src/schemas/shared-enums";
export declare class ConsultationPlansController {
    private consultationPlansService;
    constructor(consultationPlansService: ConsultationPlansService);
    batchCreatePlans(batchDto: BatchCreateConsultationPlansDto): Promise<{
        success: import("../schemas/consultation-plan.schema").ConsultationPlan[];
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
    batchCreatePlansTransaction(batchDto: BatchCreateConsultationPlansDto): Promise<import("../schemas/consultation-plan.schema").ConsultationPlan[]>;
    createPlan(createPlanDto: CreateConsultationPlanDto): Promise<import("../schemas/consultation-plan.schema").ConsultationPlan>;
    getAllPlans(includeInactive?: boolean, consultationType?: ConsultationType, consultationCategory?: ConsultationCategory, minPriceParam?: string, maxPriceParam?: string): Promise<import("../schemas/consultation-plan.schema").ConsultationPlan[]>;
    getAvailablePlansForDate(date: string, consultationType?: ConsultationType, consultationCategory?: ConsultationCategory): Promise<import("../schemas/consultation-plan.schema").ConsultationPlan[]>;
    getPlansByType(consultationType: ConsultationType): Promise<import("../schemas/consultation-plan.schema").ConsultationPlan[]>;
    getPlansByCategory(consultationCategory: ConsultationCategory): Promise<import("../schemas/consultation-plan.schema").ConsultationPlan[]>;
    getPlansForNewPatients(): Promise<import("../schemas/consultation-plan.schema").ConsultationPlan[]>;
    getPlansForExistingPatients(): Promise<import("../schemas/consultation-plan.schema").ConsultationPlan[]>;
    getPlanById(id: string): Promise<import("../schemas/consultation-plan.schema").ConsultationPlan>;
    updatePlan(id: string, updatePlanDto: UpdateConsultationPlanDto): Promise<import("../schemas/consultation-plan.schema").ConsultationPlan>;
    togglePlanStatus(id: string): Promise<import("../schemas/consultation-plan.schema").ConsultationPlan>;
    reorderPlans(orderData: {
        planId: string;
        sortOrder: number;
    }[]): Promise<void>;
    deletePlan(id: string): Promise<void>;
}
