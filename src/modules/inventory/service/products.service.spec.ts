import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ResourceNotFoundException } from 'src/common/exceptions/resource-not-found.exception';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
      imports: [ResourceNotFoundException],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
