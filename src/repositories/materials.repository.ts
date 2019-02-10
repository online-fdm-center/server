import { HasManyRepositoryFactory, repository } from '@loopback/repository';
import { AccessControlCrudRepository } from '../helpers/AccessControlCrudRepository'
import { Materials, Product } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { ProductRepository } from './product.repository';
import ac from '../providers/acl.provider';

export class MaterialsRepository extends AccessControlCrudRepository<
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
    super(Materials, dataSource, ac);
    this.products = this.createHasManyRepositoryFactoryFor(
      'products',
      getProductRepository,
    );
  }
}
