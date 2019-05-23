import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
  model,
  property,
  DataObject
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
import { Product, ProductStatuses, ProductStatusesTransforms, User, ThreeDFile, ProgressEvent } from '../models';
import { ProductRepository } from '../repositories';
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { AcOptions } from '../helpers/AccessControlCrudRepository'
import ac from '../providers/acl.provider'
import * as EventEmitter from 'events';

@model()
class PreliminaryPrice {
  @property({
    type: 'number'
  })
  preliminaryPrice: number | null
}

@model()
class ProductStatus {
  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.keys(ProductStatuses)
    },

  })
  status: ProductStatuses;
}

export class ProductController {

  acOptions: AcOptions

  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    private currentuser: User,
  ) {
    this.acOptions = {
      role: currentuser.group,
      userId: currentuser.id.toString()
    }
  }

  @authenticate('TokenStrategy')
  @post('/products', {
    description: 'Создать продукт',
    responses: {
      '200': {
        description: 'Product model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Product } } },
      },
    },
    security: [{ authToken: [] }],
  })
  async create(@requestBody() product: Product): Promise<Product> {
    return await this.productRepository.acCreate(
      { ...product, userId: this.currentuser.id },
      this.acOptions
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
    security: [{ authToken: [] }],
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Product)) filter?: Filter,
  ): Promise<Product[]> {
    return await this.productRepository.acFind(filter || {}, this.acOptions);
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
    security: [{ authToken: [] }],
  })
  async findById(@param.path.number('id') id: number): Promise<DataObject<Product>> {
    const product = await this.productRepository.acFindById(id, {}, this.acOptions);
    const file = await this.productRepository.file(id);
    return {
      ...product,
      file
    }
  }

  @authenticate('TokenStrategy')
  @patch('/products/{id}', {
    description: 'Обновить изделие по id',
    responses: {
      '204': {
        description: 'Product PATCH success',
      },
    },
    security: [{ authToken: [] }],
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() product: Product,
  ): Promise<void> {
    await this.productRepository.acUpdateById(id, product, this.acOptions);
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
    security: [{ authToken: [] }],
  })
  async duplicateProductById(
    @param.path.number('id') id: number
  ): Promise<Product> {
    const product = await this.productRepository.acFindById(id, {}, this.acOptions);
    if (product.status === ProductStatuses.UNPRINTABLE || product.status === ProductStatuses.PROCESSING_ERROR) {
      throw new HttpErrors.MethodNotAllowed()
    }
    if (product) {
      return this.productRepository.create({ ...product, id: undefined, userId: this.currentuser.id, status: ProductStatuses.READY_FOR_PRINTING });
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
    security: [{ authToken: [] }],
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.productRepository.acDeleteById(id, this.acOptions);
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
    security: [{ authToken: [] }],
  })
  async getPreliminaryPrice(@param.path.number('id') id: number): Promise<PreliminaryPrice> {
    //const product = await this.productRepository.acFindById(id, {}, { role: this.currentuser.group, userId: this.currentuser.id.toString() });
    const material = await this.productRepository.material(id)
    if (!material) {
      return { preliminaryPrice: null }
    }
    const quality = await this.productRepository.quality(id)
    if (!quality) {
      return { preliminaryPrice: null }
    }
    const file = await this.productRepository.file(id)
    if (file.status === 'PROCESSED' && file.amount) {
      return { preliminaryPrice: file.amount * material.price * quality.factor }
    } else {
      return { preliminaryPrice: null }
    }
  }

  @authenticate('TokenStrategy')
  @get('/products/{id}/getImage', {
    description: 'Получить ссылку на рендер',
    responses: {
      '200': {
        description: 'Ссылка на рендер',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                image: {
                  type: 'string'
                }
              }
            }
          }
        }
      },
    },
    security: [{ authToken: [] }],
  })
  async getImage(@param.path.number('id') id: number): Promise<{ image: string }> {
    const file = await this.productRepository.file(id)
    return {
      image: file && file.image ? file.image : 'error.png'
    }
  }

  @authenticate('TokenStrategy')
  @post('/products/{id}/setStatus', {
    description: 'Поменять статус изделия',
    responses: {
      '204': {
        description: 'Статус сменен',
      },
    },
    security: [{ authToken: [] }],
  })
  async setStatus(
    @param.path.number('id') id: number,
    @requestBody() { status }: ProductStatus
  ): Promise<void> {
    if (!status) {
      throw new HttpErrors.UnprocessableEntity('Неверный статус')
    }
    const product = await this.productRepository.acFindById(id, {}, this.acOptions)
    if (ProductStatusesTransforms[product.status].includes(status)) {
      return this.productRepository.acUpdateEnumFieldById(id, { status }, this.acOptions)
    } else {
      throw new HttpErrors.MethodNotAllowed()
    }
  }

  @authenticate('TokenStrategy')
  @get('/products/{id}/events', {
    description: 'Получить события прогресса',
    responses: {
      '200': {
        description: 'Новое событи',
        content: { 'application/json': { schema: { 'x-ts-type': ProgressEvent } } },
      },
    },
    security: [{ authToken: [] }],
  })
  async getEvent(
    @param.path.number('id') id: number,
    @inject('eventEmitter') events: EventEmitter
  ): Promise<ProgressEvent | null> {
    const product = await this.productRepository.findById(id)
    return new Promise((resolve) => {
      let eventsHandler: (id: number, data: ProgressEvent) => void
      let timeout: NodeJS.Timeout

      eventsHandler = (id, data) => {
        if (id === product.fileId) {
          clearTimeout(timeout)
          events.off('file:sliceProgress', eventsHandler)
          resolve(data)
        }
      }

      timeout = setTimeout(() => {
        events.off('file:sliceProgress', eventsHandler)
        resolve(null)
      }, 20 * 1000)

      events.on('file:sliceProgress', eventsHandler)
    })

  }

}
