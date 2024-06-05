import { ProductStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsString, IsOptional, Min, IsInt, IsEnum } from 'class-validator';

export class ProductsQueryParam {
  @IsString()
  @IsOptional()
  search: string;

  @IsOptional()
  category: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  status: ProductStatus;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page_size: number;
}
