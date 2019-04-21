import { Entity, model, property, hasMany } from '@loopback/repository';
import { Product } from './product.model'

@model()
export class PrintQuality extends Entity {
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
      title: 'Название'
    },
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
    jsonSchema: {
      title: 'Множитель'
    },
  })
  factor: number;

  @hasMany(() => Product, { keyTo: 'qualityId' })
  products?: Product[];

  constructor(data?: Partial<PrintQuality>) {
    super(data);
  }
}
