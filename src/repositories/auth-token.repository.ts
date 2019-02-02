import { DefaultCrudRepository, juggler, BelongsToAccessor, repository } from '@loopback/repository';
import { AuthToken, User } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { UserRepository } from './user.repository';

export class AuthTokenRepository extends DefaultCrudRepository<
  AuthToken,
  typeof AuthToken.prototype.token
  > {
  public readonly user: BelongsToAccessor<
    User,
    typeof AuthToken.prototype.token
  >;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserRepository')
    userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(AuthToken, dataSource);
    this.user = this.createBelongsToAccessorFor(
      'user',
      userRepositoryGetter,
    );
  }
}
