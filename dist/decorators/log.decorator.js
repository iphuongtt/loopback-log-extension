"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("@loopback/context");
const keys_1 = require("../keys");
/**
 * Mark a controller method as requiring logging (input, output & timing)
 * if it is set at or greater than Application LogLevel.
 * LOG_LEVEL.DEBUG < LOG_LEVEL.INFO < LOG_LEVEL.WARN < LOG_LEVEL.ERROR < LOG_LEVEL.OFF
 *
 * @param level - The Log Level at or above it should log
 */
function log(logMetaData) {
    let { level } = logMetaData;
    if (level === undefined)
        level = keys_1.LOG_LEVEL.WARN;
    return context_1.MethodDecoratorFactory.createDecorator(keys_1.LOG_METADATA_KEY, Object.assign(Object.assign({}, logMetaData), { level }));
}
exports.log = log;
/**
 * Fetch log level stored by `@log` decorator.
 *
 * @param controllerClass - Target controller
 * @param methodName - Target method
 */
function getLogMetadata(controllerClass, methodName) {
    var _a;
    return ((_a = context_1.MetadataInspector.getMethodMetadata(keys_1.LOG_METADATA_KEY, controllerClass.prototype, methodName)) !== null && _a !== void 0 ? _a : {
        fn: {
            code: '',
            name: ''
        },
        description: '',
        parseInfo: () => { return {}; },
        parseResult: () => {
            return {
                result: {},
                resultCode: '',
                status: true
            };
        }
    });
}
exports.getLogMetadata = getLogMetadata;
//# sourceMappingURL=log.decorator.js.map