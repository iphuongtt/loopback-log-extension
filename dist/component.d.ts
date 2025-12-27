import { Binding, Component, ProviderMap } from '@loopback/core';
export type LoggingComponentConfig = {
    enableElog?: boolean;
};
export declare class LogComponent implements Component {
    providers?: ProviderMap;
    bindings: Binding<unknown>[];
    constructor(loggingConfig: LoggingComponentConfig | undefined);
}
