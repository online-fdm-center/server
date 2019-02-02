import { DefaultCrudRepository, juggler, HasManyRepositoryFactory, repository } from '@loopback/repository';
import { Materials, Product } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { ProductRepository } from './product.repository';

export class MaterialsRepository extends DefaultCrudRepository<
  Materials,
  typeof Materials.prototype.id
  > {
  public readonly products: HasManyRepositoryFactory<
    Product,
    typeof Materials.prototype.id
  >;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ProductRepository')
    getProductRepository: Getter<ProductRepository>,
  ) {
    super(Materials, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor(
      'products',
      getProductRepository,
    );
  }
}
