import { DefaultCrudRepository, juggler, HasManyRepositoryFactory, repository } from '@loopback/repository';
import { User, Product, AuthToken } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { ProductRepository } from './product.repository';
import { AuthTokenRepository } from './auth-token.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
  > {
  public readonly products: HasManyRepositoryFactory<
    Product,
    typeof User.prototype.id
  >;
  public readonly authTokens: HasManyRepositoryFactory<
    AuthToken,
    typeof User.prototype.id
  >;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ProductRepository')
    getProductRepository: Getter<ProductRepository>,
    @repository.getter('AuthTokenRepository')
    getAuthTokenRepository: Getter<AuthTokenRepository>,
  ) {
    super(User, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor(
      'products',
      getProductRepository,
    );
    this.authTokens = this.createHasManyRepositoryFactoryFor(
      'authTokens',
      getAuthTokenRepository,
    )
  }
}
