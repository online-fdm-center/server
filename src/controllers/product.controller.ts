import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
  model,
  property,
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
  HttpErrors,
} from '@loopback/rest';
import { Product, User } from '../models';
import { ProductRepository } from '../repositories';
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';

@model()
class PreliminaryPrice {
  @property({
    type: 'number'
  })
  preliminaryPrice: number | null
}

export class ProductController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    private currentuser: User,
  ) { }

  @authenticate('TokenStrategy')
  @post('/products', {
    description: 'Создать продукт',
    responses: {
      '200': {
        description: 'Product model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Product } } },
      },
    },
  })
  async create(@requestBody() product: Product): Promise<Product> {
    return await this.productRepository.acCreate(
      { ...product, userId: this.currentuser.id },
      { role: this.currentuser.group, userId: this.currentuser.id.toString() }
    );
  }

  /*
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
  */

  @authenticate('TokenStrategy')
  @get('/products', {
    description: 'Получить массив изделий',
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

  /*
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
  */

  @authenticate('TokenStrategy')
  @get('/products/{id}', {
    description: 'Получить изделие по его id',
    responses: {
      '200': {
        description: 'Product model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Product } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Product> {
    return await this.productRepository.acFindById(id, {}, { role: this.currentuser.group, userId: this.currentuser.id.toString() });
  }

  @authenticate('TokenStrategy')
  @patch('/products/{id}', {
    description: 'Обновить изделие по id',
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
    await this.productRepository.acUpdateById(id, product, { role: this.currentuser.group, userId: this.currentuser.id.toString() });
  }

  @authenticate('TokenStrategy')
  @post('/products/duplicate/{id}', {
    description: 'Скопировать изделие',
    responses: {
      '200': {
        description: 'Duplicate product model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Product } } },
      },
    },
  })
  async duplicateProductById(
    @param.path.number('id') id: number
  ): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (product) {
      return this.productRepository.create({ ...product, id: undefined, userId: this.currentuser.id });
    } else {
      throw new HttpErrors.NotFound();
    }
  }

  /*
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
  */

  @authenticate('TokenStrategy')
  @del('/products/{id}', {
    description: 'Удалить изделие',
    responses: {
      '204': {
        description: 'Product DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.productRepository.acDeleteById(id, { role: this.currentuser.group, userId: this.currentuser.id.toString() });
  }


  @authenticate('TokenStrategy')
  @get('/products/{id}/getPreliminaryPrice', {
    description: 'Посчитать примерную цену изделия',
    responses: {
      '200': {
        description: 'Предварительная цена изделия',
        content: { 'application/json': { schema: { 'x-ts-type': PreliminaryPrice } } },
      },
    },
  })
  async getPreliminaryPrice(@param.path.number('id') id: number): Promise<PreliminaryPrice> {
    //const product = await this.productRepository.acFindById(id, {}, { role: this.currentuser.group, userId: this.currentuser.id.toString() });
    const file = await this.productRepository.file(id)
    if (file.status === 'PROCESSED' && file.amount) {
      return { preliminaryPrice: Math.max(file.amount * 1.05 * 15) }
    } else {
      return { preliminaryPrice: null }
    }
  }
}
