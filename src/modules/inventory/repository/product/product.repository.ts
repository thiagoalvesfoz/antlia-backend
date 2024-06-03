import { Image, Product } from '../../entities';

export const PRODUCT_NAME_PROVIDER = 'ProductRepository';

export interface ProductRepository {
  create(product: Product): Promise<Product>;
  findAll(): Promise<Product[]>;
  findById(product_id: string): Promise<Product>;
  findByCategoryId(category_id: string): Promise<Product[]>;
  update(product: Product): Promise<Product>;
  remove(product_id: string): Promise<void>;
  getImage(image_id: string): Promise<Image>;
}
