import { Entity, model, property, belongsTo } from '@loopback/repository';
import { Printer } from './printer.model'

@model({
  settings: {
    foreignKeys: {
      printerId: {
        name: 'FK_PrinterLog_Printer',
        foreignKey: 'printerId',
        entityKey: 'id',
        entity: 'Printer'
      }
    }
  }
})
export class PrinterLog extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Printer)
  printerId: number;

  @property({
    type: 'string',
  })
  type?: string;

  @property({
    type: 'string',
  })
  data?: string;

  @property({
    type: 'date',
    required: true,
    default: () => new Date()
  })
  createdAt: Date;

  constructor(data?: Partial<PrinterLog>) {
    super(data);
  }
}
