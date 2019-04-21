import { BelongsToAccessor, repository } from '@loopback/repository';
import { Product, Materials, ThreeDFile, User, PrintQuality } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { MaterialsRepository, FileRepository, UserRepository } from '../repositories';
import { AccessControlCrudRepository } from '../helpers/AccessControlCrudRepository';
import ac from '../providers/acl.provider'
import { PrinterQualityRepository } from './printer-quality.repository';

export class ProductRepository extends AccessControlCrudRepository<
  Product,
  typeof Product.prototype.id
  > {
  public readonly material: BelongsToAccessor<
    Materials,
    typeof Product.prototype.id
  >;
  public readonly file: BelongsToAccessor<
    ThreeDFile,
    typeof Product.prototype.id
  >;
  public readonly user: BelongsToAccessor<
    User,
    typeof Product.prototype.id
  >;
  public readonly quality: BelongsToAccessor<
    PrintQuality,
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
    @repository.getter('PrintQualityRepository')
    qualityRepositoryGetter: Getter<PrinterQualityRepository>,
  ) {
    super(Product, dataSource, ac, 'userId');
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
    this.quality = this.createBelongsToAccessorFor(
      'quality',
      qualityRepositoryGetter
    )
  }
}
