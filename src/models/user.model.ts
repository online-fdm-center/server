import { Entity, model, property, hasMany } from '@loopback/repository';
import { Product } from './product.model';
import { AuthToken } from './auth-token.model';

@model()
export class MailPass {
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
}

@model()
export class UserForRegister extends MailPass {
  @property({
    type: 'string'
  })
  name?: string;

  @property({
    type: 'string'
  })
  address?: string;
}

export enum UserGroups {
  TEMPORARY_USER = 'TEMPORARY_USER',
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  SERVER = 'SERVER',
  ADMIN = 'ADMIN',
}

@model({
  settings: {
    indexes: {
      UNIQUE_INDEX: {
        "columns": "mail",
        "kind": "unique"
      }
    }
  }
})
export class User extends Entity {
  static groups = UserGroups

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

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
    default: 0
  })
  balance: number;

  @property({
    type: 'string',
    jsonSchema: {
      title: 'Статус',
      enum: Object.keys(UserGroups)
    },
    default: UserGroups.TEMPORARY_USER,
  })
  group: UserGroups;

  @hasMany(() => Product, { keyTo: 'userId' })
  products?: Product[];

  @hasMany(() => AuthToken, { keyTo: 'userId' })
  authTokens?: AuthToken[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

@model()
export class UserForRegisterByAdmin extends UserForRegister {
  @property({
    type: 'enum',
    default: UserGroups.TEMPORARY_USER
  })
  group: UserGroups;
}
