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
import { Product, User } from '../models';
import { ProductRepository } from '../repositories';
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';

export class ProductController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    private currentuser: User,
  ) { }

  @authenticate('TokenStrategy')
  @post('/products', {
    responses: {
      '200': {
        description: 'Product model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Product } } },
      },
    },
  })
  async create(@requestBody() product: Product): Promise<Product> {
    return await this.productRepository.create({ ...product, userId: this.currentuser.id });
  }

  @authenticate('TokenStrategy')
  @get('/products/count', {
    responses: {
      '200': {
        description: 'Product model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Product)) where?: Where,
  ): Promise<Count> {
    return await this.productRepository.count(where);
  }

  @authenticate('TokenStrategy')
  @get('/products', {
    responses: {
      '200': {
        description: 'Array of Product model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Product } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Product)) filter?: Filter,
  ): Promise<Product[]> {
    return await this.productRepository.find(filter);
  }

  @authenticate('TokenStrategy')
  @patch('/products', {
    responses: {
      '200': {
        description: 'Product PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() product: Product,
    @param.query.object('where', getWhereSchemaFor(Product)) where?: Where,
  ): Promise<Count> {
    return await this.productRepository.updateAll(product, where);
  }

  @authenticate('TokenStrategy')
  @get('/products/{id}', {
    responses: {
      '200': {
        description: 'Product model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Product } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Product> {
    return await this.productRepository.findById(id);
  }

  @authenticate('TokenStrategy')
  @patch('/products/{id}', {
    responses: {
      '204': {
        description: 'Product PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() product: Product,
  ): Promise<void> {
    await this.productRepository.updateById(id, product);
  }

  @authenticate('TokenStrategy')
  @put('/products/{id}', {
    responses: {
      '204': {
        description: 'Product PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() product: Product,
  ): Promise<void> {
    await this.productRepository.replaceById(id, product);
  }

  @authenticate('TokenStrategy')
  @del('/products/{id}', {
    responses: {
      '204': {
        description: 'Product DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.productRepository.deleteById(id);
  }
}
