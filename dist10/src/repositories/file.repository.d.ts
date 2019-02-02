import { DefaultCrudRepository, HasManyRepositoryFactory } from '@loopback/repository';
import { File, Product } from '../models';
import { DbDataSource } from '../datasources';
import { Getter } from '@loopback/core';
import { ProductRepository } from './product.repository';
export declare class FileRepository extends DefaultCrudRepository<File, typeof File.prototype.id> {
    readonly products: HasManyRepositoryFactory<Product, typeof File.prototype.id>;
    constructor(dataSource: DbDataSource, getProductRepository: Getter<ProductRepository>);
}
