import {Constructor, Getter, inject, Provider} from '@loopback/context';
import {CoreBindings} from '@loopback/core';
import {Request} from '@loopback/rest';
import {getLogMetadata} from '../decorators';
import {LOG_BINDINGS, LOG_LEVEL} from '../keys';
import {HighResTime, LogFn, Logger, LogMetadata, TimerFn} from '../types';

export class LogActionProvider implements Provider<LogFn> {
  @inject(LOG_BINDINGS.LOGGER, {optional: true})
  logger: Logger;

  @inject(LOG_BINDINGS.APP_LOG_LEVEL, {optional: true})
  logLevel: LOG_LEVEL = LOG_LEVEL.WARN;

  constructor(
    @inject.getter(CoreBindings.CONTROLLER_CLASS)
    private readonly getController: Getter<Constructor<{}>>,
    @inject.getter(CoreBindings.CONTROLLER_METHOD_NAME)
    private readonly getMethod: Getter<string>,
    @inject(LOG_BINDINGS.TIMER) public timer: TimerFn,
  ) {}

  value(): LogFn {
    const fn = <LogFn>((
      req: Request,
      args: any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result: any,
      status: boolean = true,
      start?: HighResTime,
    ) => {
      return this.action(req, args, result, status, start);
    });

    fn.startTimer = () => {
      return this.timer();
    };

    return fn;
  }

  private async action(
    req: Request,
    args: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: any,
    status: boolean = true,
    start?: HighResTime,
  ): Promise<void> {
    const controllerClass = await this.getController();
    const methodName: string = await this.getMethod();

    const metadata: LogMetadata = getLogMetadata(controllerClass, methodName);

    const level: number | undefined = metadata ? metadata.level : undefined;

    if (
      level !== undefined &&
      this.logLevel !== LOG_LEVEL.OFF &&
      level >= this.logLevel &&
      level !== LOG_LEVEL.OFF
    ) {
      if (!args) args = [];
      this.logger.log(metadata, req, args, result, status);
    }
  }
}
