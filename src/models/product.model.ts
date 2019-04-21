import { Entity, model, property, belongsTo } from '@loopback/repository';
import { ThreeDFile, Materials, User, PrintQuality } from './index'

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
        entity: 'ThreeDFile'
      },
      qualityId: {
        name: 'FK_Product_PrintQuality',
        foreignKey: 'qualityId',
        entityKey: 'id',
        entity: 'PrintQuality'
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

  @belongsTo(() => PrintQuality)
  qualityId?: number

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

  @property({
    type: 'number',
    dataType: 'decimal',
    precision: 10,
    scale: 2,
  })
  price?: number

  constructor(data?: Partial<Product>) {
    super(data);
  }
}
