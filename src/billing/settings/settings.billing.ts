import * as dayjs from 'dayjs';
import { getDayOrNext } from './date.utils';

export const BEST_INVOICE_CLOSING_DAY = 20;

export function getInvoiceClosingDate(invoice_opening_date: Date) {
  const invoice_closing_date = dayjs(
    getDayOrNext(BEST_INVOICE_CLOSING_DAY, invoice_opening_date),
  );

  if (
    invoice_closing_date.isBefore(invoice_opening_date) ||
    invoice_closing_date.isSame(invoice_opening_date)
  ) {
    return dayjs(invoice_closing_date).add(1, 'M').toDate();
  }

  return invoice_closing_date.toDate();
}
