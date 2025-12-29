import { Request } from '@loopback/rest';
import { ElogOptions, Logger, LogMetadata, TokenRepository } from '../types';
type Infomation = {
    key: string;
    value: string;
};
type TimeLine = {
    isSend?: boolean;
    timestamp?: Date;
    order?: number;
    content?: string;
    status?: boolean;
    file?: {
        name: string;
        base64: string;
    };
};
type Diary = {
    ipServer?: string;
    ipClient?: string;
    type?: string;
    description?: string;
    status?: boolean;
    resultCode?: string;
    information?: Infomation[];
    timelines?: TimeLine[];
    isDone?: boolean | string;
    fnInfo?: {
        code: string;
        name: string;
    };
};
export declare class ElogService implements Logger {
    private tokenRepo;
    protected url: string;
    protected username: string;
    protected password: string;
    protected appcode: string;
    private logId;
    private token;
    private type;
    private description;
    private informations;
    private status;
    private timelines;
    private resultCode;
    private ipServer;
    private ipClient;
    private isDone;
    private functionCode;
    private functionName;
    private hasChange;
    private timeLineOrder;
    private static readonly MAX_LENGTH;
    private importantKeys;
    constructor(options: ElogOptions, tokenRepo: TokenRepository);
    login(): Promise<false | undefined>;
    log(metaData: LogMetadata, request: Request, reqData: any, result: any, status: boolean): Promise<void>;
    setChange(change?: boolean): void;
    setDone(): void;
    setFunction(functionCode: string, functionName: string): void;
    setResultCode(resultCode: string): void;
    setStatus(status: boolean): void;
    setType(type: string): void;
    setDescription(description: string): void;
    setIpServer(_ip: string): void;
    setIpClient(_ip: string): void;
    addDescription(str: string): void;
    addObjectInfo(key: string, value: string): void;
    addTimeLine(content: string, status?: boolean, fileName?: string, base64FileContent?: string): void;
    post(data: object, apiName: string): Promise<any>;
    /**
       * Create patch request
       */
    patch(data: object, apiName: string): Promise<any>;
    createLogDataRequest(): Diary;
    createLog(): Promise<boolean>;
    pushTimeLine(): Promise<void>;
    updateLog(): Promise<void>;
    push(): void;
    getToken(): Promise<string | false>;
    clearToken(): Promise<void>;
    pushNewTimeLine(content: string, status?: boolean): Promise<void>;
    getIsDone(): string | boolean;
    getStatus(): boolean | null;
    getResultCode(): string;
    getLogId(): string;
    truncateLogArray(logArray: Array<{
        key: string;
        value: any;
    }>): Array<{
        key: string;
        value: any;
    }>;
    private stringify;
}
export {};
