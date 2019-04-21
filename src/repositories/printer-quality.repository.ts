import { DefaultCrudRepository, repository, HasManyRepositoryFactory } from '@loopback/repository';
import { AccessControlCrudRepository } from '../helpers/AccessControlCrudRepository'
import { PrintQuality, Product } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { ProductRepository } from './product.repository';
import ac from '../providers/acl.provider';

export class PrinterQualityRepository extends AccessControlCrudRepository<
  PrintQuality,
  typeof PrintQuality.prototype.id
  > {
  public readonly products: HasManyRepositoryFactory<
    Product,
    typeof PrintQuality.prototype.id
  >;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ProductRepository')
    getProductRepository: Getter<ProductRepository>,
  ) {
    super(PrintQuality, dataSource, ac);
    this.products = this.createHasManyRepositoryFactoryFor(
      'products',
      getProductRepository,
    );
  }
}
