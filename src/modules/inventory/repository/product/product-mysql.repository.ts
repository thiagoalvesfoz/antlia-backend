import {
  Image as ImageModel,
  PrismaClient,
  Product as ProducModel,
} from '@prisma/client';
import {
  RequiredImageIdException,
  RequiredProductIdException,
} from '@inventory/exceptions';
import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Image, Product } from '../../entities';

type ProductModelMapper = ProducModel & {
  category: {
    name: string;
  };
};

@Injectable()
export class ProductMysqlRepository implements ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(product: Product): Promise<Product> {
    try {
      const transaction = await this.prismaService.$transaction(
        async (tx: PrismaClient) => {
          const { name, category_id, price, availability, image } = product;

          // Salva a imagem caso seja fornecida
          const imageModel = image
            ? await this.createOrUpdateImage(tx, image)
            : null;

          // Criar o modelo de produto, associando o modelo de imagem, se existir
          const productModel: ProductModelMapper = await tx.product.create({
            data: {
              name,
              price,
              availability,
              category_id,
              image_id: imageModel?.id,
            },
            include: {
              category: {
                select: {
                  name: true,
                },
              },
            },
          });

          // Retornar modelos de categoria e imagem
          return productModel;
        },
      );

      return this.#map(transaction);
    } catch (error) {
      console.error('An error occurred while creating product', error);
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

  async findAll(): Promise<Product[]> {
    const products = await this.prismaService.product.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return products.map(this.#map);
  }

  async findAllPagination(params: any): Promise<Product[]> {
    const { skip, take } = params;

    const products = await this.prismaService.product.findMany({
      skip,
      take,
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return products.map(this.#map);
  }

  async findById(id: string): Promise<Product> {
    if (!id) return;

    const producModel = await this.prismaService.product.findFirst({
      where: { id },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return this.#map(producModel);
  }

  async findByCategoryId(category_id: string): Promise<Product[]> {
    if (!category_id) return;

    const products = await this.prismaService.product.findMany({
      where: { category_id },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return products.map(this.#map);
  }

  async update(product: Product): Promise<Product> {
    try {
      if (!product.id) throw new RequiredProductIdException();

      const productModel = await this.prismaService.$transaction(
        async (tx: PrismaClient) => {
          const { id, name, availability, category_id, price, image } = product;

          let imageModel: ImageModel | null = null;

          if (image?.bytes && image?.mimetype) {
            imageModel = await this.createOrUpdateImage(tx, image);
          } else if (image?.id === null) {
            imageModel = null;
          }

          return await tx.product.update({
            where: { id },
            data: {
              name,
              availability,
              category_id,
              price,
              image_id: imageModel?.id ?? undefined,
            },
            include: {
              category: {
                select: {
                  name: true,
                },
              },
            },
          });
        },
      );

      return this.#map(productModel);
    } catch (error) {
      console.error('An error occurred while updating product', error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    if (!id) return;
    await this.prismaService.product.delete({ where: { id } });
  }

  async getImage(image_id: string): Promise<Image> {
    try {
      if (!image_id) throw new RequiredImageIdException();

      const imageModel = await this.prismaService.image.findFirst({
        where: { id: image_id },
      });

      return this.#mapImage(imageModel);
    } catch (error) {
      console.error(
        'An error occurred getting an image from the category',
        error,
      );
      throw error;
    }
  }

  #map(producModel: ProductModelMapper): Product {
    return producModel
      ? new Product({
          id: producModel.id,
          name: producModel.name,
          price: Number(producModel.price),
          availability: producModel.availability,
          category_id: producModel.category_id,
          category_name: producModel.category.name,
          image_id: producModel.image_id,
          created_at: producModel.created_at,
          updated_at: producModel.updated_at,
        })
      : undefined;
  }

  #mapImage(imageModel: ImageModel): Image {
    return imageModel
      ? new Image({
          id: imageModel.id,
          bytes: imageModel.bytes,
          mimetype: imageModel.mimetype,
          created_at: imageModel.created_at,
          updated_at: imageModel.updated_at,
        })
      : undefined;
  }
}
