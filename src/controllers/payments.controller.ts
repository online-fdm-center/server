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
import { Product, ProductStatuses } from '../models';
import { ProductRepository } from '../repositories';

export class PaymentsController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository
  ) { }

  @post('/payments/success/{id}', {
    description: 'Callback успешной оплаты продукта',
    responses: {
      '204': {
        description: 'Установлен статус "оплачено"'
      },
    },
    security: [{ authToken: [] }],
  })
  async paymentSuccess(@param.path.number('id') id: number): Promise<void> {
    const product = await this.productRepository.findById(id)
    if (product.status !== ProductStatuses.WAITING_FOR_PAYMENT) {
      throw new HttpErrors.UnprocessableEntity()
    }
    return await this.productRepository.updateById(product.id, { status: ProductStatuses.PAID });
  }
}
