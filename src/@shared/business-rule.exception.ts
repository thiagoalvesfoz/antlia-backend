import { UnprocessableEntityException } from '@nestjs/common';

export class BusinessRuleException extends UnprocessableEntityException {
  constructor(msg: string) {
    super(msg);
    this.name = 'BusinessRuleException';
  }
}
