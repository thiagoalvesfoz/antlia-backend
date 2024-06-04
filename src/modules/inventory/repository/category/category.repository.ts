import { Category, Image } from '@inventory/entities';

export const CATEGORY_NAME_PROVIDER = 'CategoryRepository';

export interface CategoryRepository {
  create(category: Category): Promise<Category>;
  findAll(): Promise<Category[]>;
  findById(category_id: string): Promise<Category>;
  update(category: Category): Promise<Category>;
  remove(category: Category): Promise<void>;
  findByName(name: string): Promise<Category>;
  getImage(image_id: string): Promise<Image>;
  enable(category_id: string, enable: boolean): Promise<void>;
  countProductsByCategory(category_id): Promise<number>;
}
