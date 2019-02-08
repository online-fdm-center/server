import { expect } from '@loopback/testlab';
import { OnlineFdmCenterApplication } from '../..';
import { setupApplication } from './test-helper';
import { UserRepository } from '../../src/repositories';
import { User } from '../../src/models'
import { HttpErrors } from '@loopback/rest';
import { ValidationError } from 'loopback-datasource-juggler';

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
      await expect(
        userRepository.acFindById(users[0].id, {}, { role: User.groups.ADMIN, userId: users[1].id.toString() })
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

  describe('acCreate', () => {
    it('admin create all users not forbidden', async () => {
      await expect(
        userRepository.acCreate(new User({ id: 1 }), { role: User.groups.ADMIN, userId: '1' })
      ).rejectedWith(ValidationError);//But rejected because cant set ID

      await expect(
        userRepository.acCreate(new User({ id: 2 }), { role: User.groups.ADMIN, userId: '1' })
      ).rejectedWith(ValidationError);
    })
    it('user create own user not forbidden', async () => {
      await expect(
        userRepository.acCreate(new User({ id: 1 }), { role: User.groups.USER, userId: '1' })
      ).rejectedWith(ValidationError);
    })
    it('user create other user forbidden', async () => {
      await expect(
        userRepository.acCreate(new User({ id: 2 }), { role: User.groups.USER, userId: '1' })
      ).rejectedWith(HttpErrors.Forbidden);
    })
    it('guest cant create user', async () => {
      await expect(
        userRepository.acCreate(new User({ id: 1 }), { role: 'guest', userId: '1' })
      ).rejectedWith(HttpErrors.Forbidden);
    })
  })

  describe('acUpdateById', () => {
    before(async () => {
      users.push(await userRepository.create(new User()))
    })
    it('admin can update all users', async () => {
      await expect(
        userRepository.acUpdateById(
          users[0].id,
          { address: 'address' },
          { role: User.groups.ADMIN, userId: (users[0].id + 1).toString() }
        )
      ).fulfilled();
      const user = await userRepository.findById(users[0].id);
      expect(user.address).equal('address');
    })
    it('user cant update other users', async () => {
      await expect(
        userRepository.acUpdateById(
          users[0].id,
          { address: 'address' },
          { role: User.groups.USER, userId: (users[0].id + 1).toString() }
        )
      ).rejectedWith(HttpErrors.Forbidden);
    })
    it('user can update only allowed fields', async () => {
      await expect(
        userRepository.acUpdateById(
          users[0].id,
          { address: 'address2', name: 'notname' },
          { role: User.groups.USER, userId: (users[0].id).toString() }
        )
      ).fulfilled();
      const user = await userRepository.findById(users[0].id);
      expect(user.address).equal('address2');
      expect(user.address).not.equal('notname');
    })
    it('guests cant update users', async () => {
      await expect(
        userRepository.acUpdateById(
          users[0].id,
          { address: 'address3', name: 'notname' },
          { role: 'guest', userId: (users[0].id).toString() }
        )
      ).rejectedWith(HttpErrors.Forbidden);
    })
  })

  describe('acDelete', () => {
    let userToDelete: User[] = []
    before(async () => {
      userToDelete.push(...(await userRepository.createAll([new User(), new User(), new User(), new User()])))
    })
    it('admin delete all users not forbidden', async () => {
      await expect(
        userRepository.acDeleteById(userToDelete[0].id, { role: User.groups.ADMIN, userId: userToDelete[0].id.toString() })
      ).fulfilled();

      await expect(
        userRepository.acDeleteById(userToDelete[1].id, { role: User.groups.ADMIN, userId: (userToDelete[1].id + 1).toString() })
      ).fulfilled();
    })
    it('user delete other user forbidden', async () => {
      await expect(
        userRepository.acDeleteById(userToDelete[2].id, { role: User.groups.USER, userId: (userToDelete[2].id + 1).toString() })
      ).rejectedWith(HttpErrors.Forbidden);
    })
    it('user delete own user not forbidden', async () => {
      await expect(
        userRepository.acDeleteById(userToDelete[3].id, { role: User.groups.ADMIN, userId: userToDelete[3].id.toString() })
      ).fulfilled();
    })
    it('guest cant create user', async () => {
      await expect(
        userRepository.acDeleteById(userToDelete[2].id, { role: 'guest', userId: (userToDelete[2].id).toString() })
      ).rejectedWith(HttpErrors.Forbidden);
    })
  })
});
