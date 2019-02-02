import {Entity, model, property, hasMany} from '@loopback/repository';
import {Product} from './product.model'

@model()
export class File extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  mimetype?: string;

  @property({
    type: 'string',
  })
  originalName?: string;

  @property({
    type: 'number',
  })
  size?: number;

  @property({
    type: 'string',
    required: true,
  })
  destination: string;

  @property({
    type: 'string',
    required: true,
  })
  filename: string;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'number',
  })
  amount?: number;

  @hasMany(() => Product, {keyTo: 'materialId'})
  products?: Product[];

  constructor(data?: Partial<File>) {
    super(data);
  }
}
