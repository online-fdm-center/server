import { DefaultCrudRepository, HasManyRepositoryFactory } from '@loopback/repository';
import { User, Product } from '../models';
import { DbDataSource } from '../datasources';
import { Getter } from '@loopback/core';
import { ProductRepository } from './product.repository';
export declare class UserRepository extends DefaultCrudRepository<User, typeof User.prototype.id> {
    readonly products: HasManyRepositoryFactory<Product, typeof User.prototype.id>;
    constructor(dataSource: DbDataSource, getProductRepository: Getter<ProductRepository>);
}
