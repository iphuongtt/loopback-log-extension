import { Component, ProviderMap, Binding, config, BindingScope } from '@loopback/core';
import { LOG_BINDINGS } from './keys';
import { LogActionProvider, TimerProvider, ElogProvider } from './providers';

export type LoggingComponentConfig = {
  enableElog?: boolean;
};

export class LogComponent implements Component {
  providers?: ProviderMap = {
    [LOG_BINDINGS.TIMER.key]: TimerProvider,
    [LOG_BINDINGS.LOG_ACTION.key]: LogActionProvider,
  };

  bindings: Binding<unknown>[];

  constructor(
    @config()
    loggingConfig: LoggingComponentConfig | undefined,
  ) {
    loggingConfig = {
      enableElog: true,
      ...loggingConfig,
    };

    if (loggingConfig.enableElog) {
      this.bindings = [
        Binding.bind(LOG_BINDINGS.LOGGER)
          .toProvider(ElogProvider)
          .inScope(BindingScope.CONTEXT)
      ];
    }
  }
}
