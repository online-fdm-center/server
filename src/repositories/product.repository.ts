import {DefaultCrudRepository, juggler, BelongsToAccessor, repository} from '@loopback/repository';
import {Product, Materials, File, User} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {MaterialsRepository, FileRepository, UserRepository} from '../repositories';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id
> {
  public readonly material: BelongsToAccessor<
    Materials,
    typeof Product.prototype.id
  >;
  public readonly file: BelongsToAccessor<
    File,
    typeof Product.prototype.id
  >;
  public readonly user: BelongsToAccessor<
  User,
    typeof Product.prototype.id
  >;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('MaterialsRepository')
    materialsRepositoryGetter: Getter<MaterialsRepository>,
    @repository.getter('FileRepository')
    fileRepositoryGetter: Getter<FileRepository>,
    @repository.getter('UserRepository')
    userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Product, dataSource);
    this.material = this.createBelongsToAccessorFor(
      'material',
      materialsRepositoryGetter,
    );
    this.file = this.createBelongsToAccessorFor(
      'file',
      fileRepositoryGetter,
    );
    this.user = this.createBelongsToAccessorFor(
      'user',
      userRepositoryGetter,
    );
  }
}
