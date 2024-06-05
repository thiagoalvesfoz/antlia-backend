export interface QueryParams {
  readonly page: number;
  readonly page_size: number;
  readonly search?: string;
}

export interface EntityPagination<T> {
  page: number;
  page_size: number;
  total_pages: number;
  total_items: number;
  items: T[];
}

export function getOffsetPagination(
  page: number | string = 1,
  page_size: number | string = 10,
) {
  const query = {
    page: Number(page),
    page_size: Number(page_size),
    take: Number(page_size),
  };

  const skip = (query.page - 1) * query.page_size;

  return {
    ...query,
    skip,
  };
}
