import {Class, DefaultCrudRepository} from '@loopback/repository';
import {Request, RequestBodyObject} from '@loopback/rest';
import {Token, TokenRelations} from './models';

/**
 * A function to perform REST req/res logging action
 */
export interface LogFn {
  (
    req: Request,
    args: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: any,
    status?: boolean,
    startTime?: HighResTime,
  ): Promise<void>;

  startTimer(): HighResTime;
}

/**
 * Log level metadata
 */
export type LogMetadata = {
  fn: {
    code: string,
    name: string
  },
  level?: number,
  parseInfo?: Function,
  parseResult: <T>(result: T) => {
    status: boolean,
    resultCode: string,
    result: object
  },
  priorityLevel?: string,
  description: string
  tags?: string[]
};

/**
 * High resolution time as [seconds, nanoseconds]. Used by process.hrtime().
 */
export type HighResTime = [number, number]; // [seconds, nanoseconds]

/**
 * Log writing function
 */
export interface Logger {
  log(logMetaData: LogMetadata, req: Request, reqData: any, result: any, status: boolean): void
}

export type TokenRepository = DefaultCrudRepository<Token,
  typeof Token.prototype.id,
  TokenRelations>

export type ElogOptions = {
  url: string,
  username: string,
  password: string,
  appCode: string,
  tokenRepo: Class<TokenRepository>
}

export type Diary = {
  id?: string,

}
/**
 * Timer function for logging
 */
export type TimerFn = (start?: HighResTime) => HighResTime;

export type RequestBodyWithElog = Partial<RequestBodyObject> & {
  description?: string,
  parseInfo: (reqData: any) => object,
  required?: boolean,
  content?: object
}
