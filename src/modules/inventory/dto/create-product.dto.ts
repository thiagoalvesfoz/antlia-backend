import { ProductStatus } from '@inventory/entities';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateProductDto {
  image: Express.Multer.File;

  @IsUUID()
  category_id: string;

  @IsNotEmpty()
  @Length(3, 30)
  name: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(9999999.99)
  @Transform(({ value }) => Number(value))
  price: number;

  @IsOptional()
  @IsEnum(ProductStatus)
  status: ProductStatus;

  static transform(dto: CreateProductDto) {
    const { price, ...product } = dto;

    return {
      ...product,
      price: Number(price),
    };
  }
}
