"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../component");
const keys_1 = require("../keys");
/**
 * A mixin class for Application that can bind logLevel from `options`.
 * Also provides .logLevel() to bind application wide logLevel.
 * Functions with a log level set to logLevel or higher sill log data
 *
 * @example
 * ```ts
 * class MyApplication extends LogMixin(Application) {}
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LogMixin(superClass) {
    return class extends superClass {
        // A mixin class has to take in a type any[] argument!
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(...args) {
            super(...args);
            if (this.options && this.options.logLevel) {
                this.logLevel(this.options.logLevel);
            }
            this.component(component_1.LogComponent);
        }
        /**
         * Set minimum logLevel to be displayed.
         *
         * @param level - The log level to set for @log decorator
         *
         * @example
         * ```ts
         * app.logLevel(LOG_LEVEL.INFO);
         * ```
         */
        logLevel(level) {
            this.bind(keys_1.LOG_BINDINGS.APP_LOG_LEVEL).to(level);
        }
    };
}
exports.LogMixin = LogMixin;
//# sourceMappingURL=log.mixin.js.map