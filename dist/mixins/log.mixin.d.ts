import { Constructor } from '@loopback/context';
import { LOG_LEVEL } from '../keys';
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
export declare function LogMixin<T extends Constructor<any>>(superClass: T): {
    new (...args: any[]): {
        [x: string]: any;
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
        logLevel(level: LOG_LEVEL): void;
    };
} & T;
