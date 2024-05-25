import { BillStatus, PayStatus } from '../entities/invoice.entity';

export class UpdateInvoiceDto {
  bill_status: BillStatus;
  pay_status: PayStatus;
  total_paid: number;
}
