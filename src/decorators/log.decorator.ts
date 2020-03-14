import {Constructor, MetadataInspector, MethodDecoratorFactory} from '@loopback/context';
import {LOG_LEVEL, LOG_METADATA_KEY} from '../keys';
import {LogMetadata} from '../types';

/**
 * Mark a controller method as requiring logging (input, output & timing)
 * if it is set at or greater than Application LogLevel.
 * LOG_LEVEL.DEBUG < LOG_LEVEL.INFO < LOG_LEVEL.WARN < LOG_LEVEL.ERROR < LOG_LEVEL.OFF
 *
 * @param level - The Log Level at or above it should log
 */
export function log(logMetaData: LogMetadata) {
  let {level} = logMetaData
  if (level === undefined) level = LOG_LEVEL.WARN;
  return MethodDecoratorFactory.createDecorator<LogMetadata>(
    LOG_METADATA_KEY,
    {...logMetaData, level}
  );
}

/**
 * Fetch log level stored by `@log` decorator.
 *
 * @param controllerClass - Target controller
 * @param methodName - Target method
 */
export function getLogMetadata(
  controllerClass: Constructor<{}>,
  methodName: string,
): LogMetadata {
  return (
    MetadataInspector.getMethodMetadata<LogMetadata>(
      LOG_METADATA_KEY,
      controllerClass.prototype,
      methodName,
    ) ?? {fn: {code: '', name: ''}, description: '', parseInfo: () => {}, parseResult: () => {return {status: true, resultCode: '', result: {}}}}
  );
}
