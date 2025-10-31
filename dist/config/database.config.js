"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongooseConfig = void 0;
const mongooseConfig = () => ({
    uri: process.env.MONGODB_URI
});
exports.mongooseConfig = mongooseConfig;
//# sourceMappingURL=database.config.js.map