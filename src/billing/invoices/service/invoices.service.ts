import { Inject, Injectable } from '@nestjs/common';
import { Invoice } from '../entities/invoice.entity';
import { InvoiceRepository } from '../repository/invoice.repository';
import { BusinessRuleException } from 'src/@shared/business-rule.exception';
import { ResourceNotFoundException } from 'src/@shared/resource-not-found.exception';
import { InvoiceDto } from '../dto/invoice.dto';

import { CustomerService } from './customer.service';

type GetInvoiceDto = {
  invoice: Invoice;
  withTransactions?: boolean;
};

@Injectable()
export class InvoicesService {
  constructor(
    @Inject('InvoiceRepository')
    private readonly invoiceRepository: InvoiceRepository,
    private readonly customerService: CustomerService,
  ) {}

  async getOpenInvoice(customer_id: string) {
    const invoice = await this.getOrCreateOpenInvoice(customer_id);
    return this.#mapInvoiceDto({ invoice, withTransactions: false });
  }

  // RESPONSÁVEL POR PEGAR OU CRIAR UMA FATURA EM ABERTO
  async getOrCreateOpenInvoice(customer_id: string) {
    const customer = await this.customerService.getCustomer(customer_id);

    let openInvoice = await this.invoiceRepository.findOpenInvoiceByCustomerId(
      customer.id,
    );

    if (!openInvoice) {
      openInvoice = await this.invoiceRepository.create(
        Invoice.openInvoice(customer),
      );
    }

    return openInvoice;
  }

  async closeInvoice(invoice: Invoice): Promise<Invoice> {
    if (!invoice) {
      throw new BusinessRuleException('Invoice is required');
    }

    invoice.close();

    return await this.invoiceRepository.update(invoice);
  }

  async findAllInvoicesByCustomerId(customer_id: string) {
    const invoices = await this.invoiceRepository.findAllByCustomerId(
      customer_id,
    );

    const invoicesDto = invoices.map((invoice) => {
      return this.#mapInvoiceDto({ invoice, withTransactions: false });
    });

    return invoicesDto;
  }

  async findInvoiceById(invoice_id: string) {
    const invoice = await this.invoiceRepository.findById(invoice_id);

    if (!invoice) {
      throw new ResourceNotFoundException('Invoice not found');
    }

    return this.#mapInvoiceDto({ invoice });
  }

  #getTotalInvoice(invoice: Invoice) {
    const total = invoice?.transactions?.reduce((acc, item) => {
      return (acc += item.price);
    }, 0);

    return total;
  }

  #mapInvoiceDto({ invoice, withTransactions = true }: GetInvoiceDto) {
    return InvoiceDto.build({
      id: invoice.id,
      customer_id: invoice.customer_id,
      bill_status: invoice.bill_status,
      pay_status: invoice.pay_status,
      start_at: invoice.start_at,
      end_at: invoice.end_at,
      total: this.#getTotalInvoice(invoice),
      transactions: withTransactions ? invoice.transactions : undefined,
    });
  }
}
