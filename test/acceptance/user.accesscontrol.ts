import { expect } from '@loopback/testlab';
import { OnlineFdmCenterApplication } from '../..';
import { setupApplication } from './test-helper';
import { UserRepository } from '../../src/repositories';
import { User } from '../../src/models'
import { HttpErrors } from '@loopback/rest';

let users: User[] = [];

describe('User Access Control', () => {
  let app: OnlineFdmCenterApplication;
  let userRepository: UserRepository;
  before('setupApplication', async () => {
    ({ app } = await setupApplication());
    userRepository = await app.getRepository<UserRepository>(UserRepository);
  });

  after(async () => {
    await userRepository.deleteAll();
    await app.stop();
  });

  describe('acFindById', () => {
    before(async () => {
      users = await userRepository.createAll([
        new User({}),
        new User({}),
      ]);
    })
    it('admin can read all users', async () => {
      await expect(
        userRepository.acFindById(users[0].id, {}, { role: User.groups.ADMIN, userId: users[0].id.toString() })
      ).fulfilled();
    })
    it('user cant read other user', async () => {
      await expect(
        userRepository.acFindById(users[1].id, {}, { role: User.groups.USER, userId: users[0].id.toString() })
      ).rejectedWith(HttpErrors.Forbidden)
    })
    it('user can read own user', async () => {
      await expect(
        userRepository.acFindById(users[0].id, {}, { role: User.groups.USER, userId: users[0].id.toString() })
      ).fulfilled();
    })
    it('guest cant read own user', async () => {
      await expect(
        userRepository.acFindById(users[0].id, {}, { role: 'guest', userId: users[0].id.toString() })
      ).rejectedWith(HttpErrors.Forbidden);
    })
  })
});
