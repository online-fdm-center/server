import { inject } from '@loopback/core';
import { juggler } from '@loopback/repository';

export class DbDataSource extends juggler.DataSource {
  static dataSourceName = 'db';

  constructor(
    @inject('datasources.config.db', { optional: true })
    dsConfig: object = {
      name: 'db',
      connector: 'mysql',
      url: process.env.MYSQL_URL,//'mysql://root:password@database/online.fdm.center',
    }
    ,
  ) {
    super(dsConfig);
  }
}
