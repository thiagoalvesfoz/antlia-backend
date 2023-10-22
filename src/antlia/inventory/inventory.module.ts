import { Module } from '@nestjs/common';
import {
  CategoryRepositoryProvider,
  ProductRepositoryProvider,
} from './repository';
import { ProductsController } from './controller/products.controller';
import { ProductsService } from './service/products.service';

import { CategoriesController } from './controller/categories.controller';
import { CategoriesService } from './service/categories.service';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'inventory',
        module: InventoryModule,
      },
    ]),
  ],
  controllers: [ProductsController, CategoriesController],
  providers: [
    ProductsService,
    CategoriesService,
    CategoryRepositoryProvider,
    ProductRepositoryProvider,
  ],
  exports: [ProductsService],
})
export class InventoryModule {}
