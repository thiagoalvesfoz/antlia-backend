import { ProductStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  Min,
  IsInt,
  IsEnum,
  IsIn,
  IsBoolean,
} from 'class-validator';

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

  @IsOptional()
  @IsIn(['created_at', 'price'])
  order_by?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  dir?: string;

  @IsOptional()
  @IsBoolean()
  @IsIn([true, false])
  @Type(() => Boolean)
  resume?: string;
}
