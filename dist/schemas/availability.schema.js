"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilitySchema = exports.Availability = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Availability = class Availability extends mongoose_2.Document {
};
exports.Availability = Availability;
__decorate([
    (0, mongoose_1.Prop)({ enum: [0, 1, 2, 3, 4, 5, 6], required: true }),
    __metadata("design:type", Number)
], Availability.prototype, "dayOfWeek", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ startTime: String, endTime: String }], required: true }),
    __metadata("design:type", Array)
], Availability.prototype, "timeSlots", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ["physical", "virtual"], required: true }),
    __metadata("design:type", String)
], Availability.prototype, "consultationType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Availability.prototype, "isAvailable", void 0);
exports.Availability = Availability = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Availability);
exports.AvailabilitySchema = mongoose_1.SchemaFactory.createForClass(Availability);
//# sourceMappingURL=availability.schema.js.map