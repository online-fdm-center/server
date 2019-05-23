import { model, property, ValueObject } from '@loopback/repository';

@model()
export class ProgressEvent extends ValueObject {
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
