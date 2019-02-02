import { Entity, model, property, hasMany } from '@loopback/repository';
import { Product } from './product.model'

@model()
export class Materials extends Entity {
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
  type: string;

  @property({
    type: 'string',
  })
  color?: string;

  @property({
    type: 'number',
  })
  count?: number;

  @hasMany(() => Product, { keyTo: 'materialId' })
  products?: Product[];

  constructor(data?: Partial<Materials>) {
    super(data);
  }
}
