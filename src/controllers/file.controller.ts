import * as path from 'path';
import { inject } from '@loopback/context';
import { FileRepository } from '../repositories';
import { ThreeDFile, ThreeDFileImage, ProductStatuses } from '../models'
import { repository, model, property, Entity, ValueObject } from '@loopback/repository';
import {
  post,
  requestBody,
  Request,
  Response,
  RestBindings,
  patch,
  param
} from '@loopback/rest';
import * as multer from 'multer';
import { get } from 'https';
import { authenticate } from '@loopback/authentication';
import { EventEmitter } from 'events';

type ExpressFiles = {
  [fieldname: string]: Express.Multer.File[];
} | Express.Multer.File[];

type ThreeDFileAmount = {
  amount: number
}

@model()
class ProgressEvent extends ValueObject {
  @property({
    required: true,
    type: 'number',
  })
  progress: number

  @property({
    type: 'string',
  })
  text?: string

  @property({
    type: 'string',
  })
  error?: string
}

export class FileController {

  storage: multer.StorageEngine;

  constructor(
    @repository(FileRepository)
    public fileRepository: FileRepository,
  ) {
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../../uploads'))
      },
      filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.stl')
      }
    })
  }

  @authenticate('TokenStrategy')
  @post('/files', {
    description: 'Загрузить файл на сервер',
    responses: {
      '200': {
        description: 'File model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ThreeDFile } } },
      },
    },
    security: [{ authToken: [] }],
  })
  async create(
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          'x-parser': 'stream',
          schema: { type: 'object' },
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<ThreeDFile> {
    const upload = multer({ storage: this.storage });
    return new Promise<ExpressFiles>((resolve, reject) => {
      upload.any()(request, response, err => {
        if (err) { reject(err); }
        else {
          resolve(request.files as Express.Multer.File[]);
        }
      })
    })
      .then((files) => {
        if (files.length !== 1) {
          return Promise.reject(422);
        } else {
          const file = (files as Express.Multer.File[])[0];
          return this.fileRepository.create({
            filename: file.filename,
            destination: '/uploads',
            mimetype: file.mimetype,
            size: file.size,
            originalName: file.originalname,
            status: ThreeDFile.statuses.WAITING_FOR_PROCESSING
          })
        }
      })
  }

  @authenticate('TokenStrategy')
  @post('/getFileToProcess', {
    description: 'Получить файл для обработки слайсером. После получения статус файла устанавливается в *PROCESSING*',
    responses: {
      '200': {
        description: 'File model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ThreeDFile } } },
      },
    },
    security: [{ serverToken: [] }],
  })
  async getFileToProcess(): Promise<ThreeDFile | null> {
    const file = await this.fileRepository.findOne({
      where: {
        status: ThreeDFile.statuses.WAITING_FOR_PROCESSING
      }
    })
    if (!file) {
      return file
    } else {
      await this.fileRepository.updateById(file.id, {
        status: ThreeDFile.statuses.PROCESSING
      });
      await this.fileRepository.products(file.id).patch({ status: ProductStatuses.PROCESSING })
      return file;
    }
  }

  @authenticate('TokenStrategy')
  @post('/files/{id}/setAmount', {
    description: 'Устанавливает объем модели в 3d файле, изменяет статус файла и изделий',
    responses: {
      '204': {
        description: 'Объем модели сохранен',
      },
    },
    security: [{ serverToken: [] }],
  })
  async setAmount(
    @param.path.number('id') id: number,
    @requestBody() data: ThreeDFileAmount,
    @inject('eventEmitter') events: EventEmitter
  ): Promise<void> {
    await this.fileRepository.updateById(id, { ...data, status: 'PROCESSED' })
    await this.fileRepository.products(id).patch({ status: ProductStatuses.READY_FOR_PRINTING })
    events.emit(`file:sliceProgress`, id, { progress: 1 })
  }

  @authenticate('TokenStrategy')
  @post('/files/{id}/sliceProgress', {
    description: 'Уведомляет о прогрессе слайсинга файла',
    responses: {
      '204': {
        description: 'Принято',
      },
    },
    security: [{ serverToken: [] }],
  })
  async setSliceProgress(
    @param.path.number('id') id: number,
    @requestBody() data: ProgressEvent,
    @inject('eventEmitter') events: EventEmitter
  ): Promise<void> {
    if (data.error) {
      await this.fileRepository.updateById(id, { status: ProductStatuses.PROCESSING_ERROR })
      await this.fileRepository.products(id).patch({ status: ProductStatuses.PROCESSING_ERROR })
    }
    events.emit(`file:sliceProgress`, id, data)
  }

  @authenticate('TokenStrategy')
  @post('/getFileToRender', {
    description: 'Получить файл для обработки рендером.',
    responses: {
      '200': {
        description: 'File model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ThreeDFile } } },
      },
    },
    security: [{ authToken: [] }],
  })
  async getFileToRender(): Promise<ThreeDFile | null> {
    const file = await this.fileRepository.findOne({
      where: {
        image: {
          eq: null
        }
      }
    })
    return file;
  }

  @authenticate('TokenStrategy')
  @post('/files/{id}/setImage', {
    description: 'Устанавливает изображение в 3d файле.',
    responses: {
      '204': {
        description: 'Объем модели сохранен',
      },
    },
    security: [{ serverToken: [] }],
  })
  async setImage(
    @param.path.number('id') id: number,
    @requestBody() data: ThreeDFileImage,
  ): Promise<void> {
    await this.fileRepository.updateById(id, { ...data })
  }

  @authenticate('TokenStrategy')
  @post('/files/{id}/renderProgress', {
    description: 'Уведомляет о прогрессе рендеринга файла',
    responses: {
      '204': {
        description: 'Принято',
      },
    },
    security: [{ serverToken: [] }],
  })
  async setRenderProgress(
    @param.path.number('id') id: number,
    @requestBody() data: ProgressEvent,
    @inject('eventEmitter') events: EventEmitter
  ): Promise<void> {
    events.emit(`file:renderProgress`, id, data)
  }

}
