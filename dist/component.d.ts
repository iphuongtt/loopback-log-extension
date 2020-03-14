import { Component, ProviderMap, Binding } from '@loopback/core';
export declare type LoggingComponentConfig = {
    enableElog?: boolean;
};
export declare class LogComponent implements Component {
    providers?: ProviderMap;
    bindings: Binding<unknown>[];
    constructor(loggingConfig: LoggingComponentConfig | undefined);
}
