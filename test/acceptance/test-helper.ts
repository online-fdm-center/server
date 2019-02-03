import { OnlineFdmCenterApplication } from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import * as request from 'supertest';

export async function setupApplication(): Promise<AppWithClient> {
  const app = new OnlineFdmCenterApplication({
    rest: givenHttpServerConfig(),
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return { app, client };
}

export interface AppWithClient {
  app: OnlineFdmCenterApplication;
  client: Client;
}
