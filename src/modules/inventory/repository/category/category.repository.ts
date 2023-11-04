import { Category } from '../../entities';

export const CATEGORY_NAME_PROVIDER = 'CategoryRepository';

export interface CategoryRepository {
  create(category: Category): Promise<Category>;
  findAll(): Promise<Category[]>;
  findById(category_id: string): Promise<Category>;
  update(category: Category): Promise<Category>;
  remove(category_id: string): Promise<void>;
  findByName(name: string): Promise<Category>;
}
