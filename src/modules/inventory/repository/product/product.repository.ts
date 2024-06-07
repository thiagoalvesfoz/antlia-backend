import { ProductStatus } from '@prisma/client';
import { Image, Product } from '../../entities';
import { EntityPagination, QueryParams } from '@common/pagination';

export const PRODUCT_NAME_PROVIDER = 'ProductRepository';

export interface ProductQueryParam extends QueryParams {
  status?: ProductStatus;
  category?: string;
}

export interface ResumeInformations {
  total_published: number;
  total_unpublished: number;
  total_all: number;
}

export type ProductPagination = EntityPagination<Product> & ResumeInformations;

export interface ProductRepository {
  create(product: Product): Promise<Product>;
  count(): Promise<ResumeInformations>;
  pagination(params: ProductQueryParam): Promise<ProductPagination>;
  findAll(): Promise<Product[]>;
  findById(product_id: string): Promise<Product>;
  findByCategoryId(category_id: string): Promise<Product[]>;
  update(product: Product): Promise<Product>;
  remove(product: Product): Promise<void>;
  getImage(image_id: string): Promise<Image>;
}
