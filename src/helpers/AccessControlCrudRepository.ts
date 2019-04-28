import { DefaultCrudRepository, Entity, DataObject, Filter, juggler } from '@loopback/repository';
import { Options } from 'loopback-datasource-juggler';
import { AccessControl } from 'accesscontrol'
import { HttpErrors } from '@loopback/rest';

export type AcOptions = Options & {
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

  /**
   * Создает сущность в базе данных с учетом контроля доступа
   * @param entity сущность, которую надо создать
   * @param options параметры
   * @param options.role группа пользователя, который создает сущность
   * @param options.userId id пользователя, который создает сущность
   */
  async acCreate(entity: DataObject<T>, options: AcOptions): Promise<T> {
    const permissionCreateAny = this.ac.can(options.role).createAny(this.entityClass.modelName);
    if (permissionCreateAny.granted) {
      return super.create(entity, options);
    }
    const permissionCreateOwn = this.ac.can(options.role).createOwn(this.entityClass.modelName);
    if (permissionCreateOwn.granted && this.userField && options.userId) {
      const isOwn = entity.hasOwnProperty(this.userField) &&
        (String(entity[this.userField as keyof T]) === options.userId)
      if (isOwn) {
        return super.create(entity, options);
      } else {
        throw new HttpErrors.Forbidden('Not allowed to create not own entity');
      }
    }
    throw new HttpErrors.Forbidden('Not allowed to create entity');
  }

  /**
   * Ищет сущности в базе данных с учетом контроля доступа
   * @param filter фильтр сущностей
   * @param options параметры
   * @param options.role группа пользователя, который ищет сущности
   * @param options.userId id пользователя, который ищет сущности
   */
  async acFind(filter: Filter<T>, options: AcOptions): Promise<T[]> {
    const permissionReadAny = this.ac.can(options.role).readAny(this.entityClass.modelName);
    if (permissionReadAny.granted) {
      return super.find(filter, options);
    }
    const permissionReadOwn = this.ac.can(options.role).readOwn(this.entityClass.modelName);
    if (permissionReadOwn.granted && this.userField && options.userId) {
      filter = {
        ...filter,
        where: {
          ...filter.where,
          [this.userField]: options.userId
        }
      };
      console.log(filter);
      return super.find(filter, options);
    }
    throw new HttpErrors.Forbidden();
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
        String(entity[this.userField as keyof T]) === options.userId
      if (isOwn) {
        return entity;
      }
    }
    throw new HttpErrors.Forbidden();
  }

  async acUpdateById(id: ID, data: DataObject<T>, options: AcOptions): Promise<void> {
    const permissionUpdateAny = this.ac.can(options.role).updateAny(this.entityClass.modelName);
    if (permissionUpdateAny.granted) {
      return super.updateById(id, permissionUpdateAny.filter(data), options);
    }
    const permissionUpdateOwn = this.ac.can(options.role).updateOwn(this.entityClass.modelName);
    if (permissionUpdateOwn.granted && this.userField && options.userId) {
      const entity = await super.findById(id);
      const isOwn = entity.hasOwnProperty(this.userField) &&
        String(entity[this.userField as keyof T]) === options.userId
      if (isOwn) {
        return super.updateById(id, permissionUpdateOwn.filter(data), options);
      } else {
        throw new HttpErrors.Forbidden('Not allowed to update not own entity');
      }
    }
    throw new HttpErrors.Forbidden('Not allowed to update entity');
  }

  /**
   * Обновляет enumerated поле в базе с учетом контроля доступа
   * @param id id сущности
   * @param data объект с полями, которые надо обновить
   * @param options параметры
   * @param options.role группа пользователя, который обновляет сущность
   * @param options.userId id пользователя, который обновляет сущность
   */
  async acUpdateEnumFieldById(id: ID, data: DataObject<T>, options: AcOptions): Promise<void> {
    /**Пермишен на обновление всех сущностей */
    const permissionUpdateAny = this.ac.can(options.role).updateAny(this.entityClass.modelName)
    //Если пользователь может обновлять любые сущности
    if (permissionUpdateAny.granted) {
      //Если пользователь может обновлять любые атрибуты в сущности
      if (permissionUpdateAny.attributes.includes('*')) {
        return super.updateById(id, data)
      }
      for (let key in data) {
        //Если пользователь не может устанавливать какое нибудь значение в поле
        if (!permissionUpdateAny.attributes.includes(`${key}.${data[key]}`)) {
          throw new HttpErrors.Forbidden()
        }
      }
      return super.updateById(id, data)
    }
    const permissionUpdateOwn = this.ac.can(options.role).updateOwn(this.entityClass.modelName);
    if (permissionUpdateOwn.granted && this.userField && options.userId) {
      const entity = await super.findById(id);
      const isOwn = entity.hasOwnProperty(this.userField) &&
        String(entity[this.userField as keyof T]) === options.userId
      if (isOwn) {
        if (permissionUpdateOwn.attributes.includes('*')) {
          return super.updateById(id, data)
        }
        for (let key in data) {
          //Если пользователь не может устанавливать какое нибудь значение в поле
          if (!permissionUpdateOwn.attributes.includes(`${key}.${data[key]}`)) {
            throw new HttpErrors.Forbidden()
          }
        }
        return super.updateById(id, data)
      } else {
        throw new HttpErrors.Forbidden('Not allowed to update not own entity');
      }
    }
    throw new HttpErrors.Forbidden('Not allowed to update entity');
  }

  async acDeleteById(id: ID, options: AcOptions): Promise<void> {
    const permissionDeleteAny = this.ac.can(options.role).deleteAny(this.entityClass.modelName);
    if (permissionDeleteAny.granted) {
      return super.deleteById(id, options);
    }
    const permissionDeleteOwn = this.ac.can(options.role).deleteOwn(this.entityClass.modelName);
    if (permissionDeleteOwn.granted && this.userField && options.userId) {
      const entity = await super.findById(id);
      const isOwn = entity.hasOwnProperty(this.userField) &&
        String(entity[this.userField as keyof T]) === options.userId
      if (isOwn) {
        return super.deleteById(id, options);
      } else {
        throw new HttpErrors.Forbidden('Not allowed to delete not own entity');
      }
    }
    throw new HttpErrors.Forbidden('Not allowed to delete entity');
  }
}
