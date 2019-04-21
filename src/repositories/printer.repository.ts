import { DefaultCrudRepository, repository, HasManyRepositoryFactory } from '@loopback/repository';
import { Printer, PrinterLog } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { ProductRepository } from './product.repository';
import { PrinterLogRepository } from './printer-log.repository';

export class PrinterRepository extends DefaultCrudRepository<
  Printer,
  typeof Printer.prototype.id
  > {
  public readonly logs: HasManyRepositoryFactory<
    PrinterLog,
    typeof Printer.prototype.id
  >;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('PrinterLogRepository')
    printerLogRepositoryGetter: Getter<PrinterLogRepository>,
  ) {
    super(Printer, dataSource);
    this.logs = this.createHasManyRepositoryFactoryFor(
      'logs',
      printerLogRepositoryGetter,
    );
  }
}
