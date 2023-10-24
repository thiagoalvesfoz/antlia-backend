import { BusinessRuleException } from 'src/@shared/business-rule.exception';
import { Transaction } from './transaction.entity';
import { getInvoiceClosingDate } from 'src/billing/settings/settings.billing';
import { Customer } from './customer.entity';
import { InvalidAttributeException } from 'src/@shared/invalid-attribute-exception';

export enum BillStatus {
  OPENDED = 'OPENDED',
  CLOSED = 'CLOSED',
}

export enum PayStatus {
  PAID = 'SUCCEED',
  PENDING = 'PENDING',
  PARTLY_PAID = 'PARTLY_PAID',
  CANCELED = 'CANCELED',
}

type InvoiceProps = {
  id?: string;
  customer_id: string;
  bill_status: BillStatus;
  pay_status: PayStatus;
  start_at: Date;
  end_at?: Date;
  transactions?: Transaction[];
};

export class Invoice {
  id?: string;
  customer_id: string;
  bill_status: BillStatus;
  pay_status: PayStatus;
  start_at: Date;
  end_at?: Date;
  total_paid: number;
  transactions?: Transaction[];

  constructor(props: InvoiceProps) {
    this.id = props.id;
    this.customer_id = props.customer_id;
    this.bill_status = props.bill_status;
    this.pay_status = props.pay_status;
    this.start_at = props.start_at;
    this.end_at = props.end_at;
    this.transactions = props.transactions || [];
  }

  addTransaction(order: Transaction) {
    this.transactions.push(order);
  }

  close() {
    if (this.bill_status !== BillStatus.OPENDED) {
      throw new BusinessRuleException('Invoice must be opended status');
    }

    this.bill_status = BillStatus.CLOSED;
    this.end_at = new Date();
  }

  static openInvoice(customer: Customer) {
    if (!customer?.id) {
      throw new BusinessRuleException(
        'Cannot open invoice without specifying a customer',
      );
    }

    const today = new Date();

    return new Invoice({
      customer_id: customer.id,
      bill_status: BillStatus.OPENDED,
      pay_status: PayStatus.PENDING,
      start_at: today,
      end_at: getInvoiceClosingDate(today),
    });
  }
}
