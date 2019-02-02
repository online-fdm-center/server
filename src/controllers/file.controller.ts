import * as path from 'path';
import { inject } from '@loopback/context';
import { FileRepository } from '../repositories';
import { ThreeDFile } from '../models'
import { repository } from '@loopback/repository';
import {
  post,
  requestBody,
  Request,
  Response,
  RestBindings
} from '@loopback/rest';
import * as multer from 'multer';

type ExpressFiles = {
  [fieldname: string]: Express.Multer.File[];
} | Express.Multer.File[];

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
        cb(null, file.fieldname + '-' + Date.now())
      }
    })
  }

  @post('/files', {
    responses: {
      '200': {
        description: 'File model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ThreeDFile } } },
      },
    },
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
}
