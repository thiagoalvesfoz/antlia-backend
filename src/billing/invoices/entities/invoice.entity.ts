import { BusinessRuleException } from 'src/@shared/business-rule.exception';
import { Transaction } from './transaction.entity';
import { getInvoiceClosingDate } from 'src/billing/settings/settings.billing';
import { Customer } from './customer.entity';

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
  total_paid?: number;
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
    this.total_paid = props.total_paid || 0;
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

  pay(total_paid: number) {    
    const pending_amount = this.getTotal();
    const minimum_payment = this.getMinimumPayment()

    if (total_paid < minimum_payment) {
     throw new BusinessRuleException(`invalid payment, the minimum amount accepted is ${minimum_payment.toFixed(2)}`);
    }

    if (total_paid > pending_amount) {
      throw new BusinessRuleException('payments above the total invoice amount are not accepted')
    }

    if (total_paid < pending_amount) {
      this.pay_status = PayStatus.PARTLY_PAID;
    }

    if (total_paid === pending_amount) {
      const isClosed = this.bill_status === BillStatus.CLOSED;
      this.pay_status = isClosed ? PayStatus.PAID : PayStatus.PARTLY_PAID;
    }
    
    this.total_paid = total_paid;
  }

  getTotal() {
    const total = this.transactions.reduce((acc, item) => {
      return (acc += item.price);
    }, 0);

    return total;
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

  getMinimumPayment() {
    const PERCENTAGE_VALUE_DEFAULT = 15;
    return this.getTotal() / 100 * PERCENTAGE_VALUE_DEFAULT;
  }
}
