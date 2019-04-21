import { Entity, model, property, hasMany } from '@loopback/repository';
import { PrinterLog } from './printer-log.model'

@model()
export class Printer extends Entity {
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
    jsonSchema: {
      title: 'Токен'
    },
  })
  token?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      title: 'Название'
    },
  })
  name: string;

  @hasMany(() => PrinterLog, { keyTo: 'materialId' })
  logs?: PrinterLog[];

  constructor(data?: Partial<Printer>) {
    super(data);
  }
}
