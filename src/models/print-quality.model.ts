import { Entity, model, property, hasMany } from '@loopback/repository';
import { Product } from './product.model'

@model()
export class PrintQuality extends Entity {
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

  /**Множитель цены */
  @property({
    type: 'number',
    dataType: 'decimal',
    precision: 10,
    scale: 2,
    required: true,
    default: 1,
  })
  factor: number;

  @hasMany(() => Product, { keyTo: 'qualityId' })
  products?: Product[];

  constructor(data?: Partial<PrintQuality>) {
    super(data);
  }
}
