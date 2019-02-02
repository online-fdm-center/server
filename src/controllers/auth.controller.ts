
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
    @inject(AuthenticationBindings.CURRENT_USER) private user: User,
  ) { }

  @post('/temporaryRegister')
  async temporaryRegister(): Promise<AuthToken> {
    const user = await this.userRepository.create({});
    const token = await crypto.randomBytes(36).toString('hex');
    return await this.userRepository.authTokens(user.id).create({ token });
  }

  @authenticate('TokenStrategy')
  @post('/register')
  async register(@requestBody() user: User): Promise<void> {
    await this.userRepository.updateById(this.user.id, { ...user, id: this.user.id, isTemporary: false });
  }

  @authenticate('TokenStrategy')
  @get('/checkAuth')
  checkAuth(): User {
    console.log(this.user);
    return this.user;
  }
}
