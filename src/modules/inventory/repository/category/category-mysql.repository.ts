import { Injectable } from '@nestjs/common';
import { Category as CategoryModel, Image as ImageModel } from '@prisma/client';
import { CategoryRepository } from './category.repository';
import { Category, Image } from '../../entities';
import { PrismaService } from 'src/common/prisma/prisma.service';

type MapperProps = {
  categoryModel?: CategoryModel;
  imageModel?: ImageModel;
};

@Injectable()
export class CategoryMysqlRepository implements CategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(category: Category): Promise<Category> {
    const transaction: MapperProps = await this.prismaService.$transaction(
      async (tx) => {
        const { name, enable } = category;

        let imageModel: ImageModel = null;

        if (!!category.image) {
          const { bytes, mimetype } = category.image;

          imageModel = await tx.image.create({
            data: {
              bytes,
              mimetype,
            },
          });
        }

        const categoryModel: CategoryModel = await tx.category.create({
          data: {
            name,
            enable,
            image_id: imageModel?.id,
          },
        });

        return { categoryModel, imageModel };
      },
    );

    return this.#map(transaction);
  }

  async update(category: Category): Promise<Category> {
    if (!category) return;

    ///////
    const transaction: MapperProps = await this.prismaService.$transaction(
      async (tx) => {
        const { name, image } = category;

        let imageModel: ImageModel = null;

        if (!!image?.bytes && !!image?.mimetype) {
          const { bytes, mimetype } = image;

          if (image.id) {
            imageModel = await tx.image.update({
              where: { id: image.id },
              data: {
                bytes,
                mimetype,
              },
            });
          } else {
            imageModel = await tx.image.create({
              data: {
                bytes,
                mimetype,
              },
            });
          }
        }

        const categoryModel: CategoryModel = await tx.category.update({
          where: { id: category.id },
          data: {
            name,
            image_id: imageModel?.id || category.image?.id,
          },
        });

        return { categoryModel, imageModel };
      },
    );

    //////
    return this.#map(transaction);
  }

  async enable(category_id: string, enable: boolean): Promise<void> {
    await this.prismaService.category.update({
      where: { id: category_id },
      data: {
        enable,
      },
    });
  }

  async findAll(): Promise<Category[]> {
    const categories: CategoryModel[] =
      await this.prismaService.category.findMany();
    return categories.map((categoryModel) => this.#map({ categoryModel }));
  }

  async findById(id: string): Promise<Category> {
    if (!id) return;
    const categoryModel = await this.prismaService.category.findFirst({
      where: { id },
    });
    return this.#map({ categoryModel });
  }

  async findByName(name: string): Promise<Category> {
    if (!name) return;

    const categoryModel = await this.prismaService.category.findFirst({
      where: { name },
    });

    // Prisma does not offer support for case-insensitive filtering with SQLite. :(
    return this.#map({ categoryModel });
  }

  async remove(id: string): Promise<void> {
    if (!id) return;
    const category = await this.findById(id);

    await this.prismaService.$transaction(async (tx) => {
      if (category?.id) {
        await tx.category.delete({ where: { id } });
        if (category.image?.id) {
          await tx.image.delete({ where: { id: category.image.id } });
        }
      }
    });
  }

  async getImage(image_id: string): Promise<Image> {
    if (!image_id) return;

    const imageModel = await this.prismaService.image.findFirst({
      where: { id: image_id },
    });

    return this.#mapImage({ imageModel });
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
