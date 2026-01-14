"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAvailabilityDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_availability_dto_1 = require("./create-availability.dto");
class UpdateAvailabilityDto extends (0, mapped_types_1.PartialType)(create_availability_dto_1.CreateAvailabilityDto) {
}
exports.UpdateAvailabilityDto = UpdateAvailabilityDto;
//# sourceMappingURL=update-availability.dto.js.map