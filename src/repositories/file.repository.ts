import {DefaultCrudRepository, juggler, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {File, Product} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProductRepository} from './product.repository';

export class FileRepository extends DefaultCrudRepository<
  File,
  typeof File.prototype.id
> {
  public readonly products: HasManyRepositoryFactory<
    Product,
    typeof File.prototype.id
  >;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ProductRepository')
    getProductRepository: Getter<ProductRepository>,
  ) {
    super(File, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor(
      'products',
      getProductRepository,
    );
  }
}
