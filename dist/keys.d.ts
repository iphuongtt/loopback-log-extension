import { BindingKey } from '@loopback/context';
import { LogComponent } from './component';
import { LogFn, Logger, TimerFn } from './types';
/**
 * Binding keys used by this component.
 */
export declare namespace LOG_BINDINGS {
    const APP_LOG_LEVEL: BindingKey<LOG_LEVEL>;
    const TIMER: BindingKey<TimerFn>;
    const LOGGER: BindingKey<Logger>;
    const LOG_ACTION: BindingKey<LogFn>;
    const COMPONENT: BindingKey<LogComponent>;
}
/**
 * The key used to store log-related via @loopback/metadata and reflection.
 */
export declare const LOG_METADATA_KEY = "log.metadata";
/**
 * Enum to define the supported log levels
 */
export declare enum LOG_LEVEL {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    OFF = 4
}
export declare enum PRIORITY_LEVEL {
    UU_TIEN = "UU_TIEN",
    THUONG = "THUONG"
}
