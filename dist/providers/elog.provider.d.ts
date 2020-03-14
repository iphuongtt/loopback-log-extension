import { Provider, Getter } from '@loopback/core';
import { ElogService } from '../services';
import { ElogOptions, Logger } from '../types';
import { ApplicationWithRepositories } from '@loopback/repository';
export declare class ElogProvider implements Provider<Logger> {
    private getElogConfig;
    private app;
    constructor(getElogConfig: Getter<ElogOptions>, app: ApplicationWithRepositories);
    private binding;
    value(): Promise<ElogService>;
}
