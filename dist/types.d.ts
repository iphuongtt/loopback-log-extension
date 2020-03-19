/// <reference types="express" />
import { Class, DefaultCrudRepository } from '@loopback/repository';
import { Request, RequestBodyObject } from '@loopback/rest';
import { Token, TokenRelations } from './models';
/**
 * A function to perform REST req/res logging action
 */
export interface LogFn {
    (req: Request, args: any, result: any, status?: boolean, startTime?: HighResTime): Promise<void>;
    startTimer(): HighResTime;
}
/**
 * Log level metadata
 */
export declare type LogMetadata = {
    fn: {
        code: string;
        name: string;
    };
    level?: number;
    parseInfo?: <T>(request: T) => {
        [key: string]: string;
    };
    parseResult: <T>(result: T) => {
        status: boolean;
        resultCode: string;
        result: {
            [key: string]: string;
        };
    };
    priorityLevel?: string;
    description: string;
    tags?: string[];
};
/**
 * High resolution time as [seconds, nanoseconds]. Used by process.hrtime().
 */
export declare type HighResTime = [number, number];
/**
 * Log writing function
 */
export interface Logger {
    log(logMetaData: LogMetadata, req: Request, reqData: any, result: any, status: boolean): void;
}
export declare type TokenRepository = DefaultCrudRepository<Token, typeof Token.prototype.id, TokenRelations>;
export declare type ElogOptions = {
    url: string;
    username: string;
    password: string;
    appCode: string;
    tokenRepo: Class<TokenRepository>;
};
export declare type Diary = {
    id?: string;
};
/**
 * Timer function for logging
 */
export declare type TimerFn = (start?: HighResTime) => HighResTime;
export declare type RequestBodyWithElog<T> = Partial<RequestBodyObject> & {
    parseInfo: (reqData: T) => {
        [key: string]: string;
    };
};
