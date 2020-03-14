"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
tslib_1.__decorate([
    core_1.inject.binding(),
    tslib_1.__metadata("design:type", core_1.Binding)
], ElogProvider.prototype, "binding", void 0);
ElogProvider = tslib_1.__decorate([
    tslib_1.__param(0, core_1.config.getter()),
    tslib_1.__param(1, core_1.inject(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__metadata("design:paramtypes", [Function, Object])
], ElogProvider);
exports.ElogProvider = ElogProvider;
//# sourceMappingURL=elog.provider.js.map