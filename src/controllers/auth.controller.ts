
import { inject } from '@loopback/context';
import {
  AuthenticationBindings,
  authenticate
} from '@loopback/authentication'
import { get, post, requestBody, HttpErrors } from '@loopback/rest'
import { UserRepository, AuthTokenRepository, ProductRepository } from '../repositories'
import { repository } from '@loopback/repository';
import { User, AuthToken, UserForRegister, MailPass } from '../models';
import * as bcrypt from 'bcrypt';

export class AuthController {
  constructor(
    @repository('UserRepository')
    public userRepository: UserRepository,
    @repository('AuthTokenRepository')
    public authTokenRepository: AuthTokenRepository,
    @repository('ProductRepository')
    public productRepository: ProductRepository,
  ) { }

  @post('/temporaryRegister', {
    description: 'Создание временного пользователя и токена авторизации',
    responses: {
      '200': {
        content: { 'application/json': { schema: { 'x-ts-type': AuthToken } } },
      },
    },
  })
  async temporaryRegister(): Promise<AuthToken> {
    const user = await this.userRepository.create({});
    return this.authTokenRepository.generateToken(user.id);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.authTokens(id).delete();
    return this.userRepository.deleteById(id);
  }

  @authenticate('TokenStrategy')
  @post('/register', {
    description: 'Регистрация пользователя, изменение статуса временного пользователя на постоянного',
    responses: {
      '200': {
        content: { 'application/json': { schema: { 'x-ts-type': User } } },
      },
    },
    security: [{ authToken: [] }],
  })
  async register(@requestBody() user: UserForRegister, @inject(AuthenticationBindings.CURRENT_USER) currentuser: User, ): Promise<void> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await this.userRepository.updateById(currentuser.id, { ...user, id: currentuser.id, group: User.groups.USER, password: hashedPassword });
  }

  @authenticate('TokenStrategy')
  @post('/auth', {
    description: 'Авторизует пользователя с помощью логина и пароля, переводит все изделия временного пользователя на него, возвращает новый токен',
    responses: {
      '200': {
        content: { 'application/json': { schema: { 'x-ts-type': AuthToken } } },
      },
    },
    security: [{ authToken: [] }],
  })
  async auth(@requestBody() mailpass: MailPass, @inject(AuthenticationBindings.CURRENT_USER) currentuser: User): Promise<AuthToken> {
    let dbUser = await this.userRepository.findOne({ where: { mail: mailpass.mail } });
    if (!dbUser) {
      throw new HttpErrors.Unauthorized();
    }
    if (dbUser.id === currentuser.id) {
      throw new HttpErrors.NotAcceptable();
    }
    const hashEquals = await bcrypt.compare(mailpass.password, dbUser.password as string);
    if (!hashEquals) {
      throw new HttpErrors.Unauthorized();
    }
    await this.productRepository.updateAll({
      userId: dbUser.id
    }, {
        userId: currentuser.id
      });
    await this.deleteUser(currentuser.id);
    return await this.authTokenRepository.generateToken(dbUser.id);
  }
}
