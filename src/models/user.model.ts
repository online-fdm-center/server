import { Entity, model, property, hasMany } from '@loopback/repository';
import { Product } from './product.model';
import { AuthToken } from './auth-token.model';

@model()
export class UserForRegister {
  @property({
    type: 'string'
  })
  name?: string;

  @property({
    type: 'string',
    required: true,
  })
  mail: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string'
  })
  address?: string;
}

@model()
export class MailPass {
  @property({
    type: 'string',
    required: true,
  })
  mail: string;

  @property({
    type: 'string',
    required: true
  })
  password: string;
}


@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  mail?: string;

  @property({
    type: 'string',
  })
  password?: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'number',
  })
  balance?: number;

  @property({
    type: 'boolean',
    required: true,
    default: true,
  })
  isTemporary: boolean;

  @hasMany(() => Product, { keyTo: 'userId' })
  products?: Product[];

  @hasMany(() => AuthToken, { keyTo: 'userId' })
  authTokens?: AuthToken[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}
