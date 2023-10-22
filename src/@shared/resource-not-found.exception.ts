import { NotFoundException } from '@nestjs/common';

export class ResourceNotFoundException extends NotFoundException {
  constructor(resourceName: string) {
    super(`${resourceName} not found`);
    this.name = 'ResourceNotFoundException';
  }
}
