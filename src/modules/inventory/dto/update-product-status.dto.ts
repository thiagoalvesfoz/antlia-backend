import { ProductStatus } from '@inventory/entities';
import { IsEnum } from 'class-validator';

export class UpdateProductStatusDto {
  @IsEnum(ProductStatus)
  status: ProductStatus;
}
