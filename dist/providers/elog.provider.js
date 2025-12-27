"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElogProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const services_1 = require("../services");
let ElogProvider = class ElogProvider {
    constructor(getElogConfig, app) {
        this.getElogConfig = getElogConfig;
        this.app = app;
    }
    async value() {
        const options = await this.getElogConfig();
        const tokenRepo = await this.app.getRepository(options.tokenRepo);
        if (options == null) {
            throw new Error(`Elog is not configured. Please configure ${this.binding.key}.`);
        }
        return new services_1.ElogService(options, tokenRepo);
    }
};
exports.ElogProvider = ElogProvider;
tslib_1.__decorate([
    core_1.inject.binding(),
    tslib_1.__metadata("design:type", core_1.Binding)
], ElogProvider.prototype, "binding", void 0);
exports.ElogProvider = ElogProvider = tslib_1.__decorate([
    tslib_1.__param(0, core_1.config.getter()),
    tslib_1.__param(1, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__metadata("design:paramtypes", [Function, Object])
], ElogProvider);
//# sourceMappingURL=elog.provider.js.map