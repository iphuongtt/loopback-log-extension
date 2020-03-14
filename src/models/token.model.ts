import { Entity, model, property } from '@loopback/repository';

@model({})
export class Token extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: false,
  })
  id?: string;

  @property({
    type: 'string',
    required: false,
  })
  username?: string;

  @property({
    type: 'string',
    required: false,
  })
  token?: string;

  constructor(data?: Partial<Token>) {
    super(data);
  }
}

export interface TokenRelations {
  // describe navigational properties here
}

export type TokenWithRelations = Token & TokenRelations;
