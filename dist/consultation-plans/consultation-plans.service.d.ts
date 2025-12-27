import { Model } from "mongoose";
import { ConsultationPlan } from "src/schemas/consultation-plan.schema";
import { CreateConsultationPlanDto } from "./dto/create-consultation-plan.dto";
import { UpdateConsultationPlanDto } from "./dto/update-consultation-plan.dto";
export declare class ConsultationPlansService {
    private consultationPlanModel;
    constructor(consultationPlanModel: Model<ConsultationPlan>);
    createPlan(createPlanDto: CreateConsultationPlanDto): Promise<ConsultationPlan>;
    getAllPlans(includeInactive?: boolean): Promise<ConsultationPlan[]>;
    getPlanById(planId: string): Promise<ConsultationPlan>;
    updatePlan(planId: string, updatePlanDto: UpdateConsultationPlanDto): Promise<ConsultationPlan>;
    deletePlan(planId: string): Promise<void>;
    togglePlanStatus(planId: string): Promise<ConsultationPlan>;
    isPlanAvailableForDateTime(planId: string, date: Date, timeSlot: string): Promise<boolean>;
    getAvailablePlansForDate(date: Date): Promise<ConsultationPlan[]>;
}
