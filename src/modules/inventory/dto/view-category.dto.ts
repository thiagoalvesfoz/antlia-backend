import { Category } from '../entities';

export class ViewCategoryDto {
  id: string;
  image_id: string;
  name: string;
  enable: boolean;
  created_at?: Date;
  updated_at?: Date;

  constructor(category: Category) {
    this.id = category.id;
    this.image_id = category.image?.id || null;
    this.name = category.name;
    this.enable = category.enable;
    this.created_at = category.created_at;
    this.updated_at = category.updated_at;
  }

  static map(category) {
    return new ViewCategoryDto(category);
  }
}
