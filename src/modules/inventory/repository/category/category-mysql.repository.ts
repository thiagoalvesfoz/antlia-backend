import { Injectable } from '@nestjs/common';
import {
  Category as CategoryModel,
  Image as ImageModel,
  PrismaClient,
} from '@prisma/client';
import { CategoryRepository } from '@inventory/repository';
import { Category, Image } from '@inventory/entities';
import { PrismaService } from '@common/prisma';

type MapperProps = {
  categoryModel?: CategoryModel;
  imageModel?: ImageModel;
};

class RequiredCategoryIdException extends Error {
  constructor() {
    super('category id not provided');
    this.name = 'RequiredCategoryIdException';
  }
}

class RequiredImageIdException extends Error {
  constructor() {
    super('image id not provided');
    this.name = 'RequiredImageIdException';
  }
}

class RequiredCategoryNameException extends Error {
  constructor() {
    super('category name not provided');
    this.name = 'RequiredCategoryNameException';
  }
}

@Injectable()
export class CategoryMysqlRepository implements CategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(category: Category): Promise<Category> {
    try {
      const transaction: MapperProps = await this.prismaService.$transaction(
        async (tx: PrismaClient) => {
          const { name, enable, image } = category;

          // Salva a imagem caso seja fornecida
          const imageModel = image
            ? await this.createOrUpdateImage(tx, image)
            : null;

          // Criar o modelo de categoria, associando o modelo de imagem, se existir
          const categoryModel: CategoryModel = await tx.category.create({
            data: {
              name,
              enable,
              image_id: imageModel?.id,
            },
          });

          // Retornar modelos de categoria e imagem
          return { categoryModel, imageModel };
        },
      );

      return this.#map(transaction);
    } catch (error) {
      console.error('An error occurred while creating category', error);
      throw error;
    }
  }

  async update(category: Category): Promise<Category> {
    try {
      if (!category.id) throw new RequiredCategoryIdException();

      const transaction: MapperProps = await this.prismaService.$transaction(
        async (tx: PrismaClient) => {
          const { id, name, image } = category;

          let imageModel: ImageModel | null = null;

          if (image?.bytes && image?.mimetype) {
            imageModel = await this.createOrUpdateImage(tx, image);
          } else if (image?.id === null) {
            imageModel = null;
          }

          // Atualiza a categoria, associando ou removendo o modelo de imagem
          const categoryModel = await tx.category.update({
            where: { id },
            data: {
              name,
              image_id: imageModel?.id ?? undefined,
            },
          });

          // Retornar modelos de categoria e imagem
          return { categoryModel, imageModel };
        },
      );

      return this.#map(transaction);
    } catch (error) {
      console.error('An error occurred while updating category', error);
      throw error;
    }
  }

  async enable(category_id: string, enable: boolean): Promise<void> {
    try {
      if (!category_id) throw new RequiredCategoryIdException();

      await this.prismaService.category.update({
        where: { id: category_id },
        data: {
          enable,
        },
      });
    } catch (error) {
      console.error('An error occurred while toggle enable category', error);
      throw error;
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      const categories = await this.prismaService.category.findMany();
      return categories.map((categoryModel) => this.#map({ categoryModel }));
    } catch (error) {
      console.error('An error occurred while find all categories', error);
      throw error;
    }
  }

  async findById(category_id: string): Promise<Category> {
    try {
      if (!category_id) throw new RequiredCategoryIdException();
      const categoryModel = await this.prismaService.category.findFirst({
        where: { id: category_id },
      });
      return this.#map({ categoryModel });
    } catch (error) {
      console.error('An error occurred when searching fro a category', error);
      throw error;
    }
  }

  async findByName(name: string): Promise<Category> {
    try {
      if (!name) throw new RequiredCategoryNameException();

      const categoryModel = await this.prismaService.category.findFirst({
        where: { name },
      });

      // Prisma does not offer support for case-insensitive filtering with SQLite. :(
      return this.#map({ categoryModel });
    } catch (error) {
      console.error(
        'An error occurred while updating the name category',
        error,
      );
      throw error;
    }
  }

  async remove(category_id: string): Promise<void> {
    try {
      if (!category_id) throw new RequiredCategoryIdException();

      const category = await this.findById(category_id);

      await this.prismaService.$transaction(async (tx) => {
        if (category?.id) {
          await tx.category.delete({ where: { id: category_id } });
          if (category.image?.id) {
            await tx.image.delete({ where: { id: category.image.id } });
          }
        }
      });
    } catch (error) {
      console.error('An error occurred while removing the category', error);
      throw error;
    }
  }

  async getImage(image_id: string): Promise<Image> {
    try {
      if (!image_id) throw new RequiredImageIdException();

      const imageModel = await this.prismaService.image.findFirst({
        where: { id: image_id },
      });

      return this.#mapImage({ imageModel });
    } catch (error) {
      console.error(
        'An error occurred getting an image from the category',
        error,
      );
      throw error;
    }
  }

  private async createOrUpdateImage(tx: PrismaClient, image: Image) {
    const { id, bytes, mimetype } = image;

    if (id) {
      return tx.image.update({
        where: { id },
        data: { bytes, mimetype },
      });
    }

    return tx.image.create({ data: { bytes, mimetype } });
  }

  #map({ categoryModel, imageModel }: MapperProps) {
    return categoryModel
      ? new Category({
          id: categoryModel.id,
          name: categoryModel.name,
          enable: categoryModel.enable,
          image: this.#mapImage({ categoryModel, imageModel }),
          created_at: categoryModel.created_at,
          updated_at: categoryModel.updated_at,
        })
      : undefined;
  }

  #mapImage({ categoryModel, imageModel }: MapperProps): Image {
    return imageModel || categoryModel?.image_id
      ? new Image({
          id: imageModel?.id || categoryModel?.image_id,
          bytes: imageModel?.bytes,
          mimetype: imageModel?.mimetype,
          created_at: imageModel?.created_at,
          updated_at: imageModel?.updated_at,
        })
      : undefined;
  }
}
