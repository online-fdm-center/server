import { OnlineFdmCenterApplication } from './application';
import { ApplicationConfig } from '@loopback/core';

require('dotenv').config()

export { OnlineFdmCenterApplication };

export async function main(options: ApplicationConfig = {}) {
  const app = new OnlineFdmCenterApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
