import { Client, expect } from '@loopback/testlab';
import { OnlineFdmCenterApplication } from '../..';
import { setupApplication } from './test-helper';

describe('Auth', () => {
  let app: OnlineFdmCenterApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('POST /temporaryRegister', async () => {
    const res = await client
      .post('/temporaryRegister')
      .expect(200);
    expect(res.body).key('token');
    expect(res.body).key('userId');
    expect(res.body.token).type('string');
    expect(res.body.userId).type('number');
  });

  it('exposes self-hosted explorer', async () => {
    await client
      .get('/explorer/')
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .expect(/<title>LoopBack API Explorer/);
  });
});
