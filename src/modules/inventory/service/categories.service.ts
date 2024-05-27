import { Inject, Injectable } from '@nestjs/common';
import { ResourceNotFoundException } from 'src/common/exceptions/resource-not-found.exception';
import { BusinessRuleException } from 'src/common/exceptions/business-rule.exception';
import { CategoryRepository, CATEGORY_NAME_PROVIDER } from '../repository';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { ViewCategoryDto } from '../dto/view-category.dto';
import { Category } from '../entities';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(CATEGORY_NAME_PROVIDER)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<ViewCategoryDto> {
    // não cadastrar categoria com o mesmo nome
    await this.#requiredUniqueCategoryName(createCategoryDto.name);

    const category = new Category({
      name: createCategoryDto.name,
      enable: createCategoryDto.enable,
    });

    if (createCategoryDto.image) {
      const { image } = createCategoryDto;
      category.addImage(image.buffer, image.mimetype);
    }

    const categoryCreated = await this.categoryRepository.create(category);

    return ViewCategoryDto.map(categoryCreated);
  }

  async update(
    category_id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.#getCategoryById(category_id);

    // não utilizar o mesmo nome de outra categoria
    if (category.name !== updateCategoryDto.name) {
      await this.#requiredUniqueCategoryName(updateCategoryDto.name);
      category.updateName(updateCategoryDto.name);
    }

    // atualizar image, caso houver
    if (updateCategoryDto.image) {
      const { image } = updateCategoryDto;
      category.addImage(image.buffer, image.mimetype);
    }

    return await this.categoryRepository.update(category);
  }

  async toggleEnable(category_id: string, enable: boolean): Promise<void> {
    const category = await this.#getCategoryById(category_id);
    await this.categoryRepository.enable(category.id, enable);
  }

  async findAll(): Promise<ViewCategoryDto[]> {
    const categories = await this.categoryRepository.findAll();
    return categories.map(ViewCategoryDto.map);
  }

  async findOne(category_id: string): Promise<ViewCategoryDto> {
    const category = await this.#getCategoryById(category_id);
    return ViewCategoryDto.map(category);
  }

  async remove(category_id: string): Promise<void> {
    await this.#getCategoryById(category_id);
    await this.categoryRepository.remove(category_id);
  }

  async getImage(category_id: string) {
    const category = await this.#getCategoryById(category_id);
    const image = await this.categoryRepository.getImage(category.image?.id);
    if (!image) throw new ResourceNotFoundException('image not found');
    return image;
  }

  async #getCategoryById(category_id: string) {
    const category = await this.categoryRepository.findById(category_id);
    if (!category) throw new ResourceNotFoundException('category not found');
    return category;
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
