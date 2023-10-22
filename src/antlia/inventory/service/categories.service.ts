import { Inject, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repository';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { ResourceNotFoundException } from 'src/@shared/resource-not-found.exception';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { BusinessRuleException } from 'src/@shared/business-rule.exception';
import { Category } from '../entities';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // não cadastrar categoria com o mesmo nome
    await this.#requiredUniqueCategoryName(createCategoryDto.name);

    const category = new Category({
      name: createCategoryDto.name,
      enable: createCategoryDto.enable,
      show_menu: createCategoryDto.show_menu,
    });

    return await this.categoryRepository.create(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.findAll();
  }

  async findOne(category_id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(category_id);
    if (!category) throw new ResourceNotFoundException('category not found');
    return category;
  }

  async update(
    category_id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(category_id);

    // não utilizar o mesmo nome de outra categoria
    if (category.name !== updateCategoryDto.name) {
      await this.#requiredUniqueCategoryName(updateCategoryDto.name);
      category.updateName(updateCategoryDto.name);
    }

    category.updateEnable(updateCategoryDto.enable);
    category.updateShowMenu(updateCategoryDto.show_menu);

    return await this.categoryRepository.update(category);
  }

  async remove(category_id: string): Promise<void> {
    await this.findOne(category_id);
    await this.categoryRepository.remove(category_id);
  }

  // FIX: Prisma Client does not offer support for case-insensitive filtering with SQLite
  async #requiredUniqueCategoryName(categoryName: string): Promise<void> {
    const isPresent = await this.categoryRepository.findByName(categoryName);

    if (isPresent) {
      throw new BusinessRuleException(
        'There is already a category registered with this name',
      );
    }
  }
}
