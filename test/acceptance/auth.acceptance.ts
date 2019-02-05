import { Client, expect } from '@loopback/testlab';
import { OnlineFdmCenterApplication } from '../..';
import { setupApplication } from './test-helper';
import { UserRepository } from '../../src/repositories';
import { AuthToken, User, UserForRegister } from '../../src/models'
import { removeAuthTokenAndUser, getAuthToken } from '../helpers/tokenProvider'

describe('Auth', () => {
  let app: OnlineFdmCenterApplication;
  let client: Client;
  let userRepository: UserRepository;
  let authTokens: AuthToken[] = [];
  let authToken: AuthToken;
  before('setupApplication', async () => {
    ({ app, client } = await setupApplication());
    userRepository = await app.getRepository<UserRepository>(UserRepository);
    authToken = await getAuthToken(app);
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
  describe('POST /register', () => {
    const userForRegister: UserForRegister = {
      mail: 'test@test.ru',
      password: 'testpassword',
    }
    it('should return 401 without token', async () => {
      await client.post('/register')
        .send(userForRegister)
        .expect(401);
    })
    it('should return update data in database', async () => {
      const res = await client.post('/register')
        .set('X-Auth-Token', authToken.token)
        .send(userForRegister)
        .expect(204);
      const dbUser = await userRepository.findById(authToken.userId);
      expect(dbUser).not.empty();
      expect(dbUser.mail).equal('test@test.ru');
      expect((dbUser.password as string).length).above(5);
      expect(dbUser.password).not.equal('testpassword');
    })
  })
  describe('POST /auth', () => {
    it('should return 401 without token', async () => {
      await client.post('/auth')
        .send({
          mail: 'testlogin',
          password: 'testpassword'
        })
        .expect(401);
    })
  })
});
