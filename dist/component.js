"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const keys_1 = require("./keys");
const providers_1 = require("./providers");
let LogComponent = class LogComponent {
    constructor(loggingConfig) {
        this.providers = {
            [keys_1.LOG_BINDINGS.TIMER.key]: providers_1.TimerProvider,
            [keys_1.LOG_BINDINGS.LOG_ACTION.key]: providers_1.LogActionProvider,
        };
        loggingConfig = Object.assign({ enableElog: true }, loggingConfig);
        if (loggingConfig.enableElog) {
            this.bindings = [
                core_1.Binding.bind(keys_1.LOG_BINDINGS.LOGGER)
                    .toProvider(providers_1.ElogProvider)
                    .inScope(core_1.BindingScope.CONTEXT)
            ];
        }
    }
};
LogComponent = tslib_1.__decorate([
    tslib_1.__param(0, core_1.config()),
    tslib_1.__metadata("design:paramtypes", [Object])
], LogComponent);
exports.LogComponent = LogComponent;
//# sourceMappingURL=component.js.map