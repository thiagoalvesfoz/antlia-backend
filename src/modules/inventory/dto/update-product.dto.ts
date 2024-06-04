import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

export class UpdateProductDto {
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

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === '1')
  availability: boolean;

  static transform(dto: UpdateProductDto) {
    const { availability, price, ...product } = dto;

    return {
      ...product,
      price: Number(price),
      availability: ['true', '1'].includes('' + availability),
    };
  }
}
