import { IsNotEmpty, IsUUID, Length } from 'class-validator';

export class CreateInvoiceDto {
  @IsUUID()
  @IsNotEmpty()
  customer_id: string;

  @IsNotEmpty()
  @Length(3, 100)
  customer_name: string;
}
