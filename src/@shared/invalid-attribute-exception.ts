import { UnprocessableEntityException } from '@nestjs/common';

export class InvalidAttributeException extends UnprocessableEntityException {
  constructor(msg: string) {
    super(msg);
    this.name = 'InvalidAttributeException';
  }
}
