import { Injectable } from '@nestjs/common';
import { Category as CategoryModel } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryRepository } from './category.repository';
import { Category } from '../../entities';

@Injectable()
export class CategorySqLiteRepository implements CategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(category: Category): Promise<Category> {
    const { name, enable, show_menu } = category;

    const categoryModel = await this.prismaService.category.create({
      data: {
        name,
        enable,
        show_menu,
      },
    });

    return this.#map(categoryModel);
  }

  async findAll(): Promise<Category[]> {
    const categories: CategoryModel[] =
      await this.prismaService.category.findMany();
    return categories.map(this.#map);
  }

  async findById(id: string): Promise<Category> {
    if (!id) return;
    const categoryModel = await this.prismaService.category.findFirst({
      where: { id },
    });
    return this.#map(categoryModel);
  }

  async findByName(name: string): Promise<Category> {
    if (!name) return;

    const categoryModel = await this.prismaService.category.findFirst({
      where: { name },
    });

    // Prisma does not offer support for case-insensitive filtering with SQLite. :(
    return this.#map(categoryModel);
  }

  async update(category: Category): Promise<Category> {
    if (!category) return;
    const { name, enable, show_menu } = category;

    const categoryModel = await this.prismaService.category.update({
      where: { id: category.id },
      data: {
        name,
        enable,
        show_menu,
      },
    });

    return this.#map(categoryModel);
  }

  async remove(id: string): Promise<void> {
    if (!id) return;
    await this.prismaService.category.delete({ where: { id } });
  }

  #map(categoryModel: CategoryModel) {
    return categoryModel
      ? new Category({
          id: categoryModel.id,
          name: categoryModel.name,
          enable: categoryModel.enable,
          show_menu: categoryModel.show_menu,
          created_at: categoryModel.created_at,
          updated_at: categoryModel.updated_at,
        })
      : undefined;
  }
}
