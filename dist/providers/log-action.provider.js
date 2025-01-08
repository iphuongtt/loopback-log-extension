"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const core_1 = require("@loopback/core");
const decorators_1 = require("../decorators");
const keys_1 = require("../keys");
let LogActionProvider = class LogActionProvider {
    constructor(getController, getMethod, timer) {
        this.getController = getController;
        this.getMethod = getMethod;
        this.timer = timer;
        this.logLevel = keys_1.LOG_LEVEL.WARN;
    }
    value() {
        const fn = ((req, args, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result, status = true, start) => {
            return this.action(req, args, result, status, start);
        });
        fn.startTimer = () => {
            return this.timer();
        };
        return fn;
    }
    async action(req, args, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result, status = true, start) {
        try {
            const controllerClass = await this.getController();
            const methodName = await this.getMethod();
            const metadata = decorators_1.getLogMetadata(controllerClass, methodName);
            const level = metadata ? metadata.level : undefined;
            if (level !== undefined &&
                this.logLevel !== keys_1.LOG_LEVEL.OFF &&
                level >= this.logLevel &&
                level !== keys_1.LOG_LEVEL.OFF) {
                if (!args)
                    args = [];
                this.logger.log(metadata, req, args, result, status);
            }
        }
        catch (error) {
            ;
        }
    }
};
tslib_1.__decorate([
    context_1.inject(keys_1.LOG_BINDINGS.LOGGER, { optional: true }),
    tslib_1.__metadata("design:type", Object)
], LogActionProvider.prototype, "logger", void 0);
tslib_1.__decorate([
    context_1.inject(keys_1.LOG_BINDINGS.APP_LOG_LEVEL, { optional: true }),
    tslib_1.__metadata("design:type", Number)
], LogActionProvider.prototype, "logLevel", void 0);
LogActionProvider = tslib_1.__decorate([
    tslib_1.__param(0, context_1.inject.getter(core_1.CoreBindings.CONTROLLER_CLASS)),
    tslib_1.__param(1, context_1.inject.getter(core_1.CoreBindings.CONTROLLER_METHOD_NAME)),
    tslib_1.__param(2, context_1.inject(keys_1.LOG_BINDINGS.TIMER)),
    tslib_1.__metadata("design:paramtypes", [Function, Function, Function])
], LogActionProvider);
exports.LogActionProvider = LogActionProvider;
//# sourceMappingURL=log-action.provider.js.map