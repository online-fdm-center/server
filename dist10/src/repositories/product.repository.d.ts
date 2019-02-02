import { DefaultCrudRepository, BelongsToAccessor } from '@loopback/repository';
import { Product, Materials, File, User } from '../models';
import { DbDataSource } from '../datasources';
import { Getter } from '@loopback/core';
import { MaterialsRepository, FileRepository, UserRepository } from '../repositories';
export declare class ProductRepository extends DefaultCrudRepository<Product, typeof Product.prototype.id> {
    readonly material: BelongsToAccessor<Materials, typeof Product.prototype.id>;
    readonly file: BelongsToAccessor<File, typeof Product.prototype.id>;
    readonly user: BelongsToAccessor<User, typeof Product.prototype.id>;
    constructor(dataSource: DbDataSource, materialsRepositoryGetter: Getter<MaterialsRepository>, fileRepositoryGetter: Getter<FileRepository>, userRepositoryGetter: Getter<UserRepository>);
}
