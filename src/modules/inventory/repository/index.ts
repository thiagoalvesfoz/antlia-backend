import {
  CategoryRepository,
  CATEGORY_NAME_PROVIDER,
} from './category/category.repository';

import {
  ProductRepository,
  PRODUCT_NAME_PROVIDER,
} from './product/product.repository';

// Implementations
import { ProductMysqlRepository } from './product/product-mysql.repository';
import { CategoryMysqlRepository } from './category/category-mysql.repository';

const CategoryRepositoryProvider = {
  provide: CATEGORY_NAME_PROVIDER,
  useClass: CategoryMysqlRepository,
};

const ProductRepositoryProvider = {
  provide: PRODUCT_NAME_PROVIDER,
  useClass: ProductMysqlRepository,
};

// Interfaces
export {
  CategoryRepository,
  ProductRepository,
  CategoryRepositoryProvider,
  ProductRepositoryProvider,
  PRODUCT_NAME_PROVIDER,
  CATEGORY_NAME_PROVIDER
};
