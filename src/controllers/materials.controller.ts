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
import { Materials, User } from '../models';
import { MaterialsRepository } from '../repositories';
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';

export class MaterialsController {
  constructor(
    @repository(MaterialsRepository)
    public materialsRepository: MaterialsRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    private currentuser: User,
  ) { }

  @authenticate('TokenStrategy')
  @post('/materials', {
    description: 'Создать материал',
    responses: {
      '200': {
        description: 'Materials model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Materials } } },
      }
    },
    security: [{ authToken: [] }],
  })
  async create(@requestBody() materials: Materials): Promise<Materials> {
    return await this.materialsRepository.acCreate(materials, { role: this.currentuser.group, userId: this.currentuser.id.toString() });
  }

  @authenticate('TokenStrategy')
  @get('/materials', {
    description: 'Получить массив материалов',
    responses: {
      '200': {
        description: 'Массив материалов',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Materials } },
          },
        },
      },
    },
    security: [{ authToken: [] }],
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Materials)) filter?: Filter,
  ): Promise<Materials[]> {
    return await this.materialsRepository.acFind(filter || {}, {
      role: this.currentuser.group,
      userId: this.currentuser.id.toString()
    });
  }

  @authenticate('TokenStrategy')
  @get('/materials/{id}', {
    description: 'Получить материал по его id',
    responses: {
      '200': {
        description: 'Materials model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Materials } } },
      },
    },
    security: [{ authToken: [] }],
  })
  async findById(@param.path.number('id') id: number): Promise<Materials> {
    return await this.materialsRepository.acFindById(id, {}, {
      role: this.currentuser.group,
      userId: this.currentuser.id.toString()
    });
  }

  @authenticate('TokenStrategy')
  @patch('/materials/{id}', {
    description: 'Обновить материал по его id',
    responses: {
      '204': {
        description: 'Materials PATCH success',
      },
    },
    security: [{ authToken: [] }],
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() materials: Materials,
  ): Promise<void> {
    await this.materialsRepository.acUpdateById(id, materials, {
      role: this.currentuser.group,
      userId: this.currentuser.id.toString()
    });
  }

  @authenticate('TokenStrategy')
  @del('/materials/{id}', {
    description: 'Удалить материал',
    responses: {
      '204': {
        description: 'Materials DELETE success',
      },
    },
    security: [{ authToken: [] }],
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.materialsRepository.acDeleteById(id, {
      role: this.currentuser.group,
      userId: this.currentuser.id.toString()
    });
  }
}
