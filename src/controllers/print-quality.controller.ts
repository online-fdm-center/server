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
import { PrintQuality, User } from '../models';
import { PrinterQualityRepository } from '../repositories';
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { AcOptions } from '../helpers/AccessControlCrudRepository';
import { inject } from '@loopback/core';

export class PrintQualityController {

  acOptions: AcOptions

  constructor(
    @repository(PrinterQualityRepository)
    public printerQualityRepository: PrinterQualityRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    private currentuser: User,
  ) {
    this.acOptions = {
      role: currentuser.group,
      userId: currentuser.id.toString()
    }
  }

  @authenticate('TokenStrategy')
  @post('/print-qualities', {
    description: 'Создать качества печати',
    responses: {
      '200': {
        description: 'PrintQuality model instance',
        content: { 'application/json': { schema: { 'x-ts-type': PrintQuality } } },
      },
    },
    security: [{ authToken: [] }],
  })
  async create(@requestBody() printQuality: PrintQuality): Promise<PrintQuality> {
    return await this.printerQualityRepository.acCreate(printQuality, this.acOptions);
  }

  /*
  @get('/print-qualities/count', {
    responses: {
      '200': {
        description: 'PrintQuality model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(PrintQuality)) where?: Where,
  ): Promise<Count> {
    return await this.printerQualityRepository.count(where);
  }
  */

  @authenticate('TokenStrategy')
  @get('/print-qualities', {
    description: 'Получить качества печати',
    responses: {
      '200': {
        description: 'Array of PrintQuality model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': PrintQuality } },
          },
        },
      },
    },
    security: [{ authToken: [] }],
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(PrintQuality)) filter?: Filter,
  ): Promise<PrintQuality[]> {
    return await this.printerQualityRepository.acFind(filter || {}, this.acOptions);
  }

  /*
  @patch('/print-qualities', {
    responses: {
      '200': {
        description: 'PrintQuality PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() printQuality: PrintQuality,
    @param.query.object('where', getWhereSchemaFor(PrintQuality)) where?: Where,
  ): Promise<Count> {
    return await this.printerQualityRepository.updateAll(printQuality, where);
  }
  */

  @authenticate('TokenStrategy')
  @get('/print-qualities/{id}', {
    description: 'Получить качество печати по id',
    responses: {
      '200': {
        description: 'PrintQuality model instance',
        content: { 'application/json': { schema: { 'x-ts-type': PrintQuality } } },
      },
    },
    security: [{ authToken: [] }],
  })
  async findById(@param.path.number('id') id: number): Promise<PrintQuality> {
    return await this.printerQualityRepository.acFindById(id, {}, this.acOptions);
  }

  @authenticate('TokenStrategy')
  @patch('/print-qualities/{id}', {
    description: 'Изменить качество печати',
    responses: {
      '204': {
        description: 'PrintQuality PATCH success',
      },
    },
    security: [{ authToken: [] }],
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() printQuality: PrintQuality,
  ): Promise<void> {
    await this.printerQualityRepository.acUpdateById(id, printQuality, this.acOptions);
  }

  /*
  @put('/print-qualities/{id}', {
    responses: {
      '204': {
        description: 'PrintQuality PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() printQuality: PrintQuality,
  ): Promise<void> {
    await this.printerQualityRepository.replaceById(id, printQuality);
  }
  */

  @authenticate('TokenStrategy')
  @del('/print-qualities/{id}', {
    description: 'Удалить качество печати',
    responses: {
      '204': {
        description: 'PrintQuality DELETE success',
      },
    },
    security: [{ authToken: [] }],
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.printerQualityRepository.acDeleteById(id, this.acOptions);
  }
}
