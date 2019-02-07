import { DefaultCrudRepository, Entity, DataObject, Filter, juggler } from '@loopback/repository';
import { Options } from 'loopback-datasource-juggler';
import { AccessControl } from 'accesscontrol'
import { HttpErrors } from '@loopback/rest';

type AcOptions = Options & {
  role: string,
  userId?: string
}

export class AccessControlCrudRepository<T extends Entity, ID> extends DefaultCrudRepository<T, ID> {
  constructor(entityClass: typeof Entity & {
    prototype: T;
  }, dataSource: juggler.DataSource,
    protected ac: AccessControl,
    public userField?: string) {
    super(entityClass, dataSource);
  }

  create(entity: DataObject<T>, options?: Options): Promise<T> {
    return super.create(entity, options);
  }

  async acFindById(id: ID, filter: Filter<T>, options: AcOptions): Promise<T> {
    const permissionReadAny = this.ac.can(options.role).readAny(this.entityClass.modelName);
    if (permissionReadAny.granted) {
      return super.findById(id, filter, options);
    }
    const permissionReadOwn = this.ac.can(options.role).readOwn(this.entityClass.modelName);
    if (permissionReadOwn.granted && this.userField && options.userId) {
      const entity = await super.findById(id, filter, options);
      const isOwn = entity.hasOwnProperty(this.userField) &&
        (String(entity[this.userField as keyof T]) === options.userId)
      if (isOwn) {
        return entity;
      }
    }
    throw new HttpErrors.Forbidden();
  }
}
