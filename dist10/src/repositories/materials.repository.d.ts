import { DefaultCrudRepository, HasManyRepositoryFactory } from '@loopback/repository';
import { Materials, Product } from '../models';
import { DbDataSource } from '../datasources';
import { Getter } from '@loopback/core';
import { ProductRepository } from './product.repository';
export declare class MaterialsRepository extends DefaultCrudRepository<Materials, typeof Materials.prototype.id> {
    readonly products: HasManyRepositoryFactory<Product, typeof Materials.prototype.id>;
    constructor(dataSource: DbDataSource, getProductRepository: Getter<ProductRepository>);
}
