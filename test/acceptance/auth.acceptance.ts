import { Getter } from '@loopback/context';
import { repository } from '@loopback/repository'
import { Client, expect } from '@loopback/testlab';
import { OnlineFdmCenterApplication } from '../..';
import { setupApplication } from './test-helper';
import { UserRepository, ProductRepository, AuthTokenRepository } from '../../src/repositories';
import { DbDataSource } from '../../src/datasources/db.datasource';

describe('Auth', () => {
  let app: OnlineFdmCenterApplication;
  let client: Client;
  let userRepository: UserRepository;
  let productRepository: ProductRepository;
  let authTokenRepository: AuthTokenRepository;
  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());
    userRepository = await app.getRepository<UserRepository>(UserRepository);
  });

  after(async () => {
    await app.stop();
  });

  describe('POST /temporaryRegister', () => {
    it('should get temporaryToken', async () => {
      const res = await client
        .post('/temporaryRegister')
        .expect(200);
      expect(res.body).key('token');
      expect(res.body).key('userId');
      expect(res.body.token).type('string');
      expect(res.body.userId).type('number');
      expect(res.body.token.length).be.aboveOrEqual(48);
    });

    it('should create temporary user', async () => {
      const res = await client
        .post('/temporaryRegister')
        .expect(200);
      const { userId } = res.body;
      const user = await userRepository.findById(userId);
      expect(user).not.undefined();
      expect(user.isTemporary).true();
    })
  })
});
