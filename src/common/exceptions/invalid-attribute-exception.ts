import { BadRequestException } from '@nestjs/common';

export class InvalidAttributeException extends BadRequestException {
  constructor(msg: string) {
    super(msg);
    this.name = 'InvalidAttributeException';
  }
}
