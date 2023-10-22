import {
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @IsUUID()
  category_id: string;

  @IsNotEmpty()
  @Length(3, 20)
  name: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(999999999.99)
  price: number;

  availability: boolean;
}
