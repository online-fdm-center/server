import { DefaultCrudRepository, juggler, repository, HasManyRepositoryFactory } from '@loopback/repository';
import { ThreeDFile, Product } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { ProductRepository } from './product.repository';

export class FileRepository extends DefaultCrudRepository<
  ThreeDFile,
  typeof ThreeDFile.prototype.id
  > {
  public readonly products: HasManyRepositoryFactory<
    Product,
    typeof ThreeDFile.prototype.id
  >;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ProductRepository')
    getProductRepository: Getter<ProductRepository>,
  ) {
    super(ThreeDFile, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor(
      'products',
      getProductRepository,
    );
  }
}
