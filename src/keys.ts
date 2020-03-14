import {BindingKey} from '@loopback/context';
import {LogComponent} from './component';
import {LogFn, Logger, TimerFn} from './types';

/**
 * Binding keys used by this component.
 */
export namespace LOG_BINDINGS {
  export const APP_LOG_LEVEL = BindingKey.create<LOG_LEVEL>(
    'log.level',
  );
  export const TIMER = BindingKey.create<TimerFn>('log.timer');
  export const LOGGER = BindingKey.create<Logger>('log.logger');
  export const LOG_ACTION = BindingKey.create<LogFn>('log.action');
  export const COMPONENT = BindingKey.create<LogComponent>(
    'log.Component',
  );
}

/**
 * The key used to store log-related via @loopback/metadata and reflection.
 */
export const LOG_METADATA_KEY = 'log.metadata';

/**
 * Enum to define the supported log levels
 */
export enum LOG_LEVEL {
  DEBUG,
  INFO,
  WARN,
  ERROR,
  OFF,
}

export enum PRIORITY_LEVEL {
  UU_TIEN = 'UU_TIEN',
  THUONG = 'THUONG'
}
