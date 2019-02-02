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
import {Materials} from '../models';
import {MaterialsRepository} from '../repositories';

export class MaterialsController {
  constructor(
    @repository(MaterialsRepository)
    public materialsRepository : MaterialsRepository,
  ) {}

  @post('/materials', {
    responses: {
      '200': {
        description: 'Materials model instance',
        content: {'application/json': {schema: {'x-ts-type': Materials}}},
      },
    },
  })
  async create(@requestBody() materials: Materials): Promise<Materials> {
    return await this.materialsRepository.create(materials);
  }

  @get('/materials/count', {
    responses: {
      '200': {
        description: 'Materials model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Materials)) where?: Where,
  ): Promise<Count> {
    return await this.materialsRepository.count(where);
  }

  @get('/materials', {
    responses: {
      '200': {
        description: 'Array of Materials model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Materials}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Materials)) filter?: Filter,
  ): Promise<Materials[]> {
    return await this.materialsRepository.find(filter);
  }

  @patch('/materials', {
    responses: {
      '200': {
        description: 'Materials PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() materials: Materials,
    @param.query.object('where', getWhereSchemaFor(Materials)) where?: Where,
  ): Promise<Count> {
    return await this.materialsRepository.updateAll(materials, where);
  }

  @get('/materials/{id}', {
    responses: {
      '200': {
        description: 'Materials model instance',
        content: {'application/json': {schema: {'x-ts-type': Materials}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Materials> {
    return await this.materialsRepository.findById(id);
  }

  @patch('/materials/{id}', {
    responses: {
      '204': {
        description: 'Materials PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() materials: Materials,
  ): Promise<void> {
    await this.materialsRepository.updateById(id, materials);
  }

  @put('/materials/{id}', {
    responses: {
      '204': {
        description: 'Materials PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() materials: Materials,
  ): Promise<void> {
    await this.materialsRepository.replaceById(id, materials);
  }

  @del('/materials/{id}', {
    responses: {
      '204': {
        description: 'Materials DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.materialsRepository.deleteById(id);
  }
}
