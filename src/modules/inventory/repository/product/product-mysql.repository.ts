import { Injectable } from '@nestjs/common';
import { Image as ImageModel, Product as ProducModel } from '@prisma/client';
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
    const { name, availability, category_id, price } = product;

    const producModel = await this.prismaService.product.create({
      data: {
        name,
        price,
        availability,
        category_id,
      },
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
    if (!product || !product.id) return;

    const { name, availability, category_id, price } = product;

    const categoryModel = await this.prismaService.product.update({
      where: { id: product.id },
      data: {
        name,
        availability,
        category_id,
        price,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return this.#map(categoryModel);
  }

  async remove(id: string): Promise<void> {
    if (!id) return;

    await this.prismaService.category.delete({ where: { id } });
  }

  async saveImage(product: Product): Promise<void> {
    throw new Error('implementar');
  }

  async getImage(product_id: string): Promise<Image> {
    throw new Error('implementar');
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
