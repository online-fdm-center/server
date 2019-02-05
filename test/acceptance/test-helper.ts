import { OnlineFdmCenterApplication } from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';

export async function setupApplication(): Promise<AppWithClient> {
  const config = givenHttpServerConfig();
  config.host = '127.0.0.1';
  const app = new OnlineFdmCenterApplication({
    rest: config,
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
