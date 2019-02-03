
import { inject } from '@loopback/context';
import {
  AuthenticationBindings,
  UserProfile,
  authenticate
} from '@loopback/authentication'
import { get, post, requestBody } from '@loopback/rest'
import { UserRepository, AuthTokenRepository } from '../repositories'
import { repository } from '@loopback/repository';
import { User, AuthToken } from '../models';
import * as crypto from 'crypto';

export class AuthController {
  constructor(
    @repository('UserRepository')
    public userRepository: UserRepository,
    @repository('AuthTokenRepository')
    public authTokenRepository: AuthTokenRepository,

  ) { }

  @post('/temporaryRegister')
  async temporaryRegister(): Promise<AuthToken> {
    const user = await this.userRepository.create({});
    const token = await crypto.randomBytes(24).toString('hex');
    return await this.userRepository.authTokens(user.id).create({ token });
  }

  @authenticate('TokenStrategy')
  @post('/register')
  async register(@requestBody() user: User, @inject(AuthenticationBindings.CURRENT_USER) currentuser: User, ): Promise<void> {
    await this.userRepository.updateById(currentuser.id, { ...user, id: currentuser.id, isTemporary: false });
  }

  @authenticate('TokenStrategy')
  @get('/checkAuth')
  checkAuth(@inject(AuthenticationBindings.CURRENT_USER) currentuser: User): User {
    console.log(currentuser);
    return currentuser;
  }
}
