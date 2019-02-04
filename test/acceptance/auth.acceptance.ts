import { Client, expect } from '@loopback/testlab';
import { OnlineFdmCenterApplication } from '../..';
import { setupApplication } from './test-helper';
import { UserRepository } from '../../src/repositories';
import { AuthToken } from '../../src/models'
import { removeAuthTokenAndUser } from '../helpers/tokenProvider'

describe('Auth', () => {
  let app: OnlineFdmCenterApplication;
  let client: Client;
  let userRepository: UserRepository;
  let authTokens: AuthToken[] = [];
  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());
    userRepository = await app.getRepository<UserRepository>(UserRepository);
  });

  after(async () => {
    await authTokens.forEach(async token => {
      await removeAuthTokenAndUser(app, token);
    })
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
      authTokens.push(new AuthToken(res.body));
    });

    it('should create temporary user', async () => {
      const res = await client
        .post('/temporaryRegister')
        .expect(200);
      authTokens.push(new AuthToken(res.body));
      const { userId } = res.body;
      const user = await userRepository.findById(userId);
      expect(user).not.undefined();
      expect(user.isTemporary).true();
    })
  })
});
