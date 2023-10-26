import { Inject, Injectable, Logger } from '@nestjs/common';
import { InvoiceRepository } from 'src/billing/invoices/repository';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment-timezone';

const EVERY_DAY_AT_12_AM = "0 0 * * *";

@Injectable()
export class InvoiceClosingTaskService {
  private readonly logger = new Logger(InvoiceClosingTaskService.name);

  constructor(
    @Inject('InvoiceRepository')
    private readonly invoiceRepository: InvoiceRepository,
  ) {}


  @Cron(EVERY_DAY_AT_12_AM)
  async handleCron() {
    this.logger.log('task started');

    const today = moment().tz('GMT').format('YYYY-11-20T00:00:00Z');

    const invoiceAmmout = await this.invoiceRepository.countInvoiceOpenedByEndAt(today);

    if (invoiceAmmout > 0) {
      const invoices = await this.invoiceRepository.getInvoicesOpenedByEndAt(today);

      for (const index in invoices) {
        invoices[index].close();
        this.invoiceRepository.closeInvoice(invoices[index]);
      }
    }

    this.logger.log('task finalized');
  }
}