import { BillStatus, Invoice, PayStatus } from '../entities/invoice.entity';
import { InvoiceRepository } from './invoice.repository';
import { Decimal } from '@prisma/client/runtime/library';
import { Transaction } from '../entities/transaction.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  Invoice as InvoiceModel,
  BillStatus as BillStatusModel,
  PayStatus as PayStatusModel,
} from '@prisma/client';

type InvoiceModelProps = InvoiceModel & {
  transactions?: {
    id: string;
    price: Decimal;
    order_id: string;
    created_at: Date;
  }[];
};

const include_transactions = {
  transactions: {
    select: {
      id: true,
      price: true,
      order_id: true,
      created_at: true,
    },
  },
};

@Injectable()
export class InvoiceMysqlRepository implements InvoiceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(invoice: Invoice): Promise<Invoice> {
    if (!invoice || !invoice.customer_id) return;

    const invoiceModel = await this.prismaService.invoice.create({
      data: {
        customer_id: invoice.customer_id,
        bill_status: BillStatusModel[invoice.bill_status],
        pay_status: PayStatusModel[invoice.pay_status],
        start_at: invoice.start_at,
        end_at: invoice.end_at,
      },
      include: include_transactions,
    });

    return this.#map(invoiceModel);
  }

  async findAllByCustomerId(customer_id: string): Promise<Invoice[]> {
    if (!customer_id) return;

    const invoices = await this.prismaService.invoice.findMany({
      where: {
        customer_id,
      },
      orderBy: {
        start_at: 'desc',
      },
      include: include_transactions,
    });

    return invoices.map(this.#map);
  }

  async findById(invoice_id: string): Promise<Invoice> {
    if (!invoice_id) return;

    const invoiceModel = await this.prismaService.invoice.findFirst({
      where: {
        id: invoice_id,
      },
      include: include_transactions,
    });

    return this.#map(invoiceModel);
  }

  async update(invoice: Invoice, transaction?: Transaction): Promise<Invoice> {
    const invoiceModel = await this.prismaService.invoice.update({
      where: {
        id: invoice.id,
      },
      data: {
        bill_status: BillStatusModel[invoice.bill_status],
        end_at: invoice.end_at,
        transactions: transaction
          ? {
              create: {
                price: transaction.price,
                order_id: transaction.order_id,
              },
            }
          : undefined,
      },
      include: include_transactions,
    });

    return this.#map(invoiceModel);
  }
  
  async findOpenInvoiceByCustomerId(customer_id: string): Promise<Invoice> {
    if (!customer_id) return;

    const invoiceModel = await this.prismaService.invoice.findFirst({
      where: {
        customer_id,
        bill_status: BillStatusModel.OPENDED,
        pay_status: PayStatusModel.PENDING,
      },
      include: include_transactions,
    });

    return this.#map(invoiceModel);
  }

  async countInvoiceOpenedByEndAt(date: string) {
    const count = await this.prismaService.invoice.count({
      where: {
        bill_status: BillStatus.OPENDED,
        end_at: date
      }
    })

    return count;
  }

  async getInvoicesOpenedByEndAt(date: string): Promise<Invoice[]> {
    const invoiceModel = await this.prismaService.invoice.findMany({
      where: {
        end_at: date,
        bill_status: BillStatus.OPENDED
      }
    })

    return invoiceModel.map(this.#map);
  }

  async closeInvoice(invoices: Invoice) {
    await this.prismaService.invoice.update({
      where: {
        id: invoices.id
      },
      data: {
        bill_status: invoices.bill_status,
        end_at: invoices.end_at,
      },
    })
  }

  #map(invoiceModel: InvoiceModelProps) {
    return invoiceModel
      ? new Invoice({
          id: invoiceModel.id,
          start_at: invoiceModel.start_at,
          end_at: invoiceModel.end_at,
          customer_id: invoiceModel.customer_id,
          bill_status: BillStatus[invoiceModel.bill_status],
          pay_status: PayStatus[invoiceModel.pay_status],
          total_paid: +invoiceModel.total_paid,
          transactions: invoiceModel.transactions?.map(
            (transaction) =>
              new Transaction({
                id: transaction.id,
                order_id: transaction.order_id,
                price: +transaction.price,
                created_at: transaction.created_at,
              }),
          ) || [],
        })
      : undefined;
  }
}
