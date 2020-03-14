import { Entity } from '@loopback/repository';
export declare class Token extends Entity {
    id?: string;
    username?: string;
    token?: string;
    constructor(data?: Partial<Token>);
}
export interface TokenRelations {
}
export declare type TokenWithRelations = Token & TokenRelations;
