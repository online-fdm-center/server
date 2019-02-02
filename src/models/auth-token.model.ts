import { Entity, model, property, belongsTo } from '@loopback/repository';
import { User } from './user.model'

@model({
  settings: {
    foreignKeys: {
      userId: {
        name: 'FK_AuthToken_User',
        foreignKey: 'userId',
        entityKey: 'id',
        entity: 'User'
      }
    }
  }
})
export class AuthToken extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  token: string;

  @belongsTo(() => User)
  userId: number;

  constructor(data?: Partial<AuthToken>) {
    super(data);
  }
}
