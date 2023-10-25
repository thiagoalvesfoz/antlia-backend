import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InvoiceRepository } from 'src/billing/invoices/repository';

@Injectable()
export class InvoiceClosingTaskService {
  private readonly logger = new Logger(InvoiceClosingTaskService.name);

  constructor(
    @Inject('InvoiceRepository')
    private readonly invoiceRepository: InvoiceRepository,
  ) {}

  // @Cron(CronExpression.EVERY_DAY_AT_1AM)
  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    const today = new Date()

    console.log(today)

    const invoiceAmmout = await this.invoiceRepository.countInvoiceOpenedByEndAt(today);

    console.log("total invoices", invoiceAmmout)

    if (invoiceAmmout === 0) return;

    console.log("get invoices")
    const invoices = await this.invoiceRepository.getInvoicesOpenedByEndAt(today);

    for (const index in invoices) {
      invoices[index].close()
    }

    this.invoiceRepository.updateAll(invoices);
  }
}