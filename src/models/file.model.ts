import { Entity, model, property, hasMany } from '@loopback/repository';
import { Product } from './product.model'

@model()
export class ThreeDFile extends Entity {
  static statuses = {
    WAITING_FOR_PROCESSING: 'WAITING_FOR_PROCESSING',
    PROCESSING: 'PROCESSING',
  }

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
  originalName: string;

  @property({
    type: 'number',
  })
  size: number;

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
    dataType: 'decimal',
    precision: 10,
    scale: 2
  })
  amount?: number;

  @hasMany(() => Product, { keyTo: 'materialId' })
  products?: Product[];

  constructor(data?: Partial<ThreeDFile>) {
    super(data);
  }
}
