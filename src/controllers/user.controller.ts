import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import { User, UserForRegisterByAdmin } from '../models';
import { UserRepository } from '../repositories';
import { inject } from '@loopback/core';
import { AuthenticationBindings, authenticate } from '@loopback/authentication';
import * as bcrypt from 'bcrypt';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    private currentuser: User,
  ) { }

  @authenticate('TokenStrategy')
  @post('/users', {
    responses: {
      '200': {
        description: 'Создать пользователя',
        content: { 'application/json': { schema: { 'x-ts-type': UserForRegisterByAdmin } } },
      },
    },
  })
  async create(@requestBody() user: UserForRegisterByAdmin): Promise<User> {
    return await this.userRepository.acCreate({
      ...user,
      password: await bcrypt.hash(user.password, 10)
    }, {
        role: this.currentuser.group,
        userId: this.currentuser.id.toString()
      });
  }

  @get('/users/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where,
  ): Promise<Count> {
    return await this.userRepository.count(where);
  }

  @authenticate('TokenStrategy')
  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': User } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(User)) filter?: Filter,
  ): Promise<User[]> {
    return await this.userRepository.acFind(filter ? filter : {}, {
      role: this.currentuser.group,
      userId: this.currentuser.id.toString()
    });
  }

  /*
  @patch('/users', {
    responses: {
      '200': {
        description: 'User PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() user: User,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where,
  ): Promise<Count> {
    return await this.userRepository.updateAll(user, where);
  }
  */

  @authenticate('TokenStrategy')
  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: { 'application/json': { schema: { 'x-ts-type': User } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<User> {
    return await this.userRepository.acFindById(id, {}, {
      role: this.currentuser.group,
      userId: this.currentuser.id.toString()
    });
  }

  @authenticate('TokenStrategy')
  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() user: Partial<User>,
  ): Promise<void> {
    await this.userRepository.acUpdateById(id, user, {
      role: this.currentuser.group,
      userId: this.currentuser.id.toString()
    });
  }

  /*
  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }
  */

  @authenticate('TokenStrategy')
  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.acDeleteById(id, {
      role: this.currentuser.group,
      userId: this.currentuser.id.toString()
    });
  }
}
