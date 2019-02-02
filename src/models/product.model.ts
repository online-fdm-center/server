import { Entity, model, property, belongsTo } from '@loopback/repository';
import { ThreeDFile, Materials, User } from './index'

@model({
  settings: {
    foreignKeys: {
      userId: {
        name: 'FK_Product_User',
        foreignKey: 'userId',
        entityKey: 'id',
        entity: 'User'
      },
      materialId: {
        name: 'FK_Product_Material',
        foreignKey: 'materialId',
        entityKey: 'id',
        entity: 'Materials'
      },
      fileId: {
        name: 'FK_Product_File',
        foreignKey: 'fileId',
        entityKey: 'id',
        entity: 'File'
      }
    }
  }
})
export class Product extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  description?: string;

  @belongsTo(() => User)
  userId?: number;

  @belongsTo(() => ThreeDFile)
  fileId?: number;

  @belongsTo(() => Materials)
  materialId?: number;

  @property({
    type: 'number',
    required: true,
    default: 1,
  })
  count: number;

  @property({
    type: 'string',
  })
  status?: string;


  constructor(data?: Partial<Product>) {
    super(data);
  }
}
