import { BillStatus, PayStatus } from '../entities/invoice.entity';
import { Transaction } from '../entities/transaction.entity';

type InvoiceDtoProps = {
  id: string;
  customer_id: string;
  bill_status: BillStatus;
  pay_status: PayStatus;
  start_at: Date;
  end_at: Date;
  total: number;
  total_paid: number;
  transactions?: Transaction[];
};

export class InvoiceDto {
  id?: string;
  customer_id: string;
  bill_status: BillStatus;
  pay_status: PayStatus;
  start_at: Date;
  end_at?: Date;
  total: number;
  total_paid?: number;
  transactions?: Transaction[];

  constructor(props: InvoiceDtoProps) {
    this.id = props.id;
    this.customer_id = props.customer_id;
    this.bill_status = props.bill_status;
    this.pay_status = props.pay_status;
    this.start_at = props.start_at;
    this.end_at = props.end_at;
    this.total_paid = props.total_paid || 0;
    this.total = props.total;
    this.transactions = props.transactions;
  }

  static build(props: InvoiceDtoProps) {
    return new InvoiceDto(props);
  }
}
