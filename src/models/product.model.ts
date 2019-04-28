import { Entity, model, property, belongsTo } from '@loopback/repository';
import { ThreeDFile, Materials, User, PrintQuality } from './index'

export enum ProductStatuses {
  /**Ожидание обработки */
  WAITING_FOR_PROCESSING = 'WAITING_FOR_PROCESSING',
  /**Обработка */
  PROCESSING = 'PROCESSING',
  /**Ошибка обработки */
  PROCESSING_ERROR = 'PROCESSING_ERROR',
  /**Готов к печати */
  READY_FOR_PRINTING = 'READY_FOR_PRINTING',
  /**Проверка оператором */
  OPERATORS_CHECK = 'OPERATORS_CHECK',
  /**Заказ невозможно напечатать */
  UNPRINTABLE = 'UNPRINTABLE',
  /**Ожидание оплаты */
  WAITING_FOR_PAYMENT = 'WAITING_FOR_PAYMENT',
  /**Оплачен */
  PAID = 'PAID',
  /**Возврат средств [отмена пользователем] */
  REFUND_BY_USER = 'REFUND_BY_USER',
  /**Печать */
  PRINTING = 'PRINTING',
  /**Возврат средств [отмена оператором] */
  REFUND_BY_OPERATOR = 'REFUND_BY_OPERATOR',
  /**Передача клиенту */
  TRANSFER = 'TRANSFER',
  /**Заказ завершен */
  COMPLETED = 'COMPLETED',
  /**Заказ удален */
  DELETED = 'DELETED'
}

export const ProductStatusesTransforms: { [key in ProductStatuses]: Array<ProductStatuses> } = {
  [ProductStatuses.WAITING_FOR_PROCESSING]: [
    ProductStatuses.DELETED,
    ProductStatuses.PROCESSING,
  ],
  [ProductStatuses.PROCESSING]: [
    ProductStatuses.DELETED,
    ProductStatuses.READY_FOR_PRINTING,
    ProductStatuses.PROCESSING_ERROR,
  ],
  [ProductStatuses.PROCESSING_ERROR]: [],
  [ProductStatuses.READY_FOR_PRINTING]: [
    ProductStatuses.DELETED,
    ProductStatuses.OPERATORS_CHECK,
  ],
  [ProductStatuses.OPERATORS_CHECK]: [
    ProductStatuses.DELETED,
    ProductStatuses.READY_FOR_PRINTING,
    ProductStatuses.WAITING_FOR_PAYMENT,
    ProductStatuses.UNPRINTABLE
  ],
  [ProductStatuses.WAITING_FOR_PAYMENT]: [
    ProductStatuses.DELETED,
    ProductStatuses.READY_FOR_PRINTING,
    ProductStatuses.PAID
  ],
  [ProductStatuses.UNPRINTABLE]: [
    ProductStatuses.DELETED
  ],
  [ProductStatuses.PAID]: [
    ProductStatuses.REFUND_BY_USER,
    ProductStatuses.PRINTING
  ],
  [ProductStatuses.REFUND_BY_USER]: [
    ProductStatuses.PAID,
    ProductStatuses.WAITING_FOR_PAYMENT
  ],
  [ProductStatuses.PRINTING]: [
    ProductStatuses.REFUND_BY_OPERATOR,
    ProductStatuses.TRANSFER
  ],
  [ProductStatuses.REFUND_BY_OPERATOR]: [
    ProductStatuses.UNPRINTABLE
  ],
  [ProductStatuses.TRANSFER]: [
    ProductStatuses.COMPLETED
  ],
  [ProductStatuses.COMPLETED]: [],
  [ProductStatuses.DELETED]: []
}

@model({
  settings: {
    foreignKeys: {
      userId: {
        name: 'FK_Product_User',
        foreignKey: 'userId',
        entityKey: 'id',
        entity: 'User'
      },
      materialId: {
        name: 'FK_Product_Material',
        foreignKey: 'materialId',
        entityKey: 'id',
        entity: 'Materials'
      },
      fileId: {
        name: 'FK_Product_File',
        foreignKey: 'fileId',
        entityKey: 'id',
        entity: 'ThreeDFile'
      },
      qualityId: {
        name: 'FK_Product_PrintQuality',
        foreignKey: 'qualityId',
        entityKey: 'id',
        entity: 'PrintQuality'
      }
    }
  }
})
export class Product extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    jsonSchema: {
      title: 'ID'
    },
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      title: 'Название'
    },
  })
  name: string;

  @property({
    type: 'string',
    jsonSchema: {
      title: 'Описание'
    },
  })
  description?: string;

  @belongsTo(() => User)
  userId: number;

  @belongsTo(() => ThreeDFile)
  fileId?: number;

  @belongsTo(() => Materials)
  materialId?: number;

  @belongsTo(() => PrintQuality)
  qualityId?: number

  @property({
    type: 'number',
    required: true,
    default: 1,
    jsonSchema: {
      title: 'Количество'
    },
  })
  count: number;

  @property({
    type: 'string',
    jsonSchema: {
      title: 'Статус',
      enum: Object.keys(ProductStatuses)
    },
    default: ProductStatuses.WAITING_FOR_PROCESSING
  })
  status: ProductStatuses;

  @property({
    type: 'number',
    dataType: 'decimal',
    precision: 10,
    scale: 2,
    jsonSchema: {
      title: 'Цена'
    },
  })
  price?: number

  constructor(data?: Partial<Product>) {
    super(data);
  }
}
