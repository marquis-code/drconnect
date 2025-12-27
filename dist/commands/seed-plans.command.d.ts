import { CommandRunner } from 'nest-commander';
import { ConsultationPlansService } from '../consultation-plans/consultation-plans.service';
export declare class SeedPlansCommand extends CommandRunner {
    private readonly plansService;
    constructor(plansService: ConsultationPlansService);
    run(): Promise<void>;
}
