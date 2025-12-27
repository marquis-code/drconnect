"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateConsultationPlanDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_consultation_plan_dto_1 = require("./create-consultation-plan.dto");
class UpdateConsultationPlanDto extends (0, mapped_types_1.PartialType)(create_consultation_plan_dto_1.CreateConsultationPlanDto) {
}
exports.UpdateConsultationPlanDto = UpdateConsultationPlanDto;
//# sourceMappingURL=update-consultation-plan.dto.js.map