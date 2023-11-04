export function getDayOrNext(day: number, current_date?: Date): Date {
  const date = current_date || new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

  // Se o dia for inválido, retorne o próximo dia
  const isInvalidDate = day < 1 || day > lastDayOfMonth;

  if (isInvalidDate) {
    return new Date(year, month + 1, 1);
  }

  return new Date(year, month, day);
}
