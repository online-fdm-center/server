import { Entity, model, property, hasMany } from '@loopback/repository';
import { Product } from './product.model'

@model()
export class Materials extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    jsonSchema: {
      title: 'ID'
    },
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      title: 'Тип'
    },
  })
  type: string;

  @property({
    type: 'string',
    jsonSchema: {
      title: 'Цвет'
    },
  })
  color?: string;

  @property({
    type: 'number',
    jsonSchema: {
      title: 'Количество'
    },
  })
  count?: number;

  /**Цена в рублях за см^3 */
  @property({
    type: 'number',
    dataType: 'decimal',
    precision: 10,
    scale: 2,
    required: true,
    default: 20,
    jsonSchema: {
      title: 'Цена'
    },
  })
  price: number;

  @hasMany(() => Product, { keyTo: 'materialId' })
  products?: Product[];

  constructor(data?: Partial<Materials>) {
    super(data);
  }
}
