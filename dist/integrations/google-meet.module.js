"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleMeetModule = void 0;
const common_1 = require("@nestjs/common");
const google_meet_service_1 = require("./google-meet.service");
let GoogleMeetModule = class GoogleMeetModule {
};
exports.GoogleMeetModule = GoogleMeetModule;
exports.GoogleMeetModule = GoogleMeetModule = __decorate([
    (0, common_1.Module)({
        providers: [google_meet_service_1.GoogleMeetService],
        exports: [google_meet_service_1.GoogleMeetService],
    })
], GoogleMeetModule);
//# sourceMappingURL=google-meet.module.js.map