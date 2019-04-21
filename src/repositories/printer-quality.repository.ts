import { DefaultCrudRepository, repository, HasManyRepositoryFactory } from '@loopback/repository';
import { PrintQuality, Product } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { ProductRepository } from './product.repository';

export class PrinterQualityRepository extends DefaultCrudRepository<
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
    super(PrintQuality, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor(
      'products',
      getProductRepository,
    );
  }
}
