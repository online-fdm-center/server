import { DefaultCrudRepository, repository, BelongsToAccessor } from '@loopback/repository';
import { PrinterLog, Printer } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { PrinterRepository } from './printer.repository';

export class PrinterLogRepository extends DefaultCrudRepository<
  PrinterLog,
  typeof PrinterLog.prototype.id
  > {
  public readonly printer: BelongsToAccessor<
    Printer,
    typeof PrinterLog.prototype.id
  >;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('PrinterRepository')
    printerGetter: Getter<PrinterRepository>,
  ) {
    super(PrinterLog, dataSource);
    this.printer = this.createBelongsToAccessorFor(
      'printer',
      printerGetter,
    );
  }
}
