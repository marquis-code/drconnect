import { ConsultationPlansService } from "./consultation-plans.service";
import { CreateConsultationPlanDto } from "./dto/create-consultation-plan.dto";
import { UpdateConsultationPlanDto } from "./dto/update-consultation-plan.dto";
export declare class ConsultationPlansController {
    private consultationPlansService;
    constructor(consultationPlansService: ConsultationPlansService);
    createPlan(createPlanDto: CreateConsultationPlanDto): Promise<import("../schemas/consultation-plan.schema").ConsultationPlan>;
    getAllPlans(includeInactive?: boolean): Promise<import("../schemas/consultation-plan.schema").ConsultationPlan[]>;
    getAvailablePlansForDate(date: string): Promise<import("../schemas/consultation-plan.schema").ConsultationPlan[]>;
    getPlanById(id: string): Promise<import("../schemas/consultation-plan.schema").ConsultationPlan>;
    updatePlan(id: string, updatePlanDto: UpdateConsultationPlanDto): Promise<import("../schemas/consultation-plan.schema").ConsultationPlan>;
    togglePlanStatus(id: string): Promise<import("../schemas/consultation-plan.schema").ConsultationPlan>;
    deletePlan(id: string): Promise<{
        message: string;
    }>;
}
