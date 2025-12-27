"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRIORITY_LEVEL = exports.LOG_LEVEL = exports.LOG_METADATA_KEY = exports.LOG_BINDINGS = void 0;
const context_1 = require("@loopback/context");
/**
 * Binding keys used by this component.
 */
var LOG_BINDINGS;
(function (LOG_BINDINGS) {
    LOG_BINDINGS.APP_LOG_LEVEL = context_1.BindingKey.create('log.level');
    LOG_BINDINGS.TIMER = context_1.BindingKey.create('log.timer');
    LOG_BINDINGS.LOGGER = context_1.BindingKey.create('log.logger');
    LOG_BINDINGS.LOG_ACTION = context_1.BindingKey.create('log.action');
    LOG_BINDINGS.COMPONENT = context_1.BindingKey.create('log.Component');
})(LOG_BINDINGS || (exports.LOG_BINDINGS = LOG_BINDINGS = {}));
/**
 * The key used to store log-related via @loopback/metadata and reflection.
 */
exports.LOG_METADATA_KEY = 'log.metadata';
/**
 * Enum to define the supported log levels
 */
var LOG_LEVEL;
(function (LOG_LEVEL) {
    LOG_LEVEL[LOG_LEVEL["DEBUG"] = 0] = "DEBUG";
    LOG_LEVEL[LOG_LEVEL["INFO"] = 1] = "INFO";
    LOG_LEVEL[LOG_LEVEL["WARN"] = 2] = "WARN";
    LOG_LEVEL[LOG_LEVEL["ERROR"] = 3] = "ERROR";
    LOG_LEVEL[LOG_LEVEL["OFF"] = 4] = "OFF";
})(LOG_LEVEL || (exports.LOG_LEVEL = LOG_LEVEL = {}));
var PRIORITY_LEVEL;
(function (PRIORITY_LEVEL) {
    PRIORITY_LEVEL["UU_TIEN"] = "UU_TIEN";
    PRIORITY_LEVEL["THUONG"] = "THUONG";
})(PRIORITY_LEVEL || (exports.PRIORITY_LEVEL = PRIORITY_LEVEL = {}));
//# sourceMappingURL=keys.js.map