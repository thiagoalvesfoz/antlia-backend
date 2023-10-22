import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class CreateOrderItemDto {
  @IsUUID()
  product_id: string;

  // @IsNotEmpty()
  // @Length(3, 100)
  // product_name: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(1)
  @Max(100)
  quantity: number;
}

export class CreateOrderDto {
  @IsUUID()
  customer_id: string;

  @IsNotEmpty()
  @Length(3, 100)
  customer_name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateOrderItemDto)
  order_items: CreateOrderItemDto[];
}
