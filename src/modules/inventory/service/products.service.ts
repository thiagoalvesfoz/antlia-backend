import { Inject, Injectable } from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { ProductRepository, PRODUCT_NAME_PROVIDER } from '../repository';
import { CreateProductDto } from '../dto/create-product.dto';
import { BusinessRuleException } from 'src/common/exceptions/business-rule.exception';
import { Product } from '../entities';
import { ResourceNotFoundException } from 'src/common/exceptions/resource-not-found.exception';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCT_NAME_PROVIDER)
    private readonly productRepository: ProductRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    if (!createProductDto.category_id) {
      throw new BusinessRuleException('categoryId is required!');
    }

    const category = await this.categoriesService.findOne(
      createProductDto.category_id,
    );

    const product = new Product({
      category_id: category.id,
      category_name: category.name,
      name: createProductDto.name,
      price: createProductDto.price,
      availability: createProductDto.availability,
    });

    return await this.productRepository.create(product);
  }

  async findAll() {
    return await this.productRepository.findAll();
  }

  async findOne(product_id: string) {
    const product = await this.productRepository.findById(product_id);
    if (!product) throw new ResourceNotFoundException('Product');
    return product;
  }

  async findAllProductsByCategory(categoryId: string) {
    return await this.productRepository.findByCategoryId(categoryId);
  }

  async update(product_id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(product_id);

    if (!updateProductDto.category_id) {
      throw new BusinessRuleException('the product must have a category');
    }

    if (updateProductDto.category_id !== product.category_id) {
      const category = await this.categoriesService.findOne(
        updateProductDto.category_id,
      );

      product.addCategory({
        category_id: category.id,
        category_name: category.name,
      });
    }

    product.updateName(updateProductDto.name);
    product.updatePrice(updateProductDto.price);
    product.updateAvailability(updateProductDto.availability);

    return await this.productRepository.update(product);
  }

  async remove(product_id: string) {
    await this.findOne(product_id);
    await this.productRepository.remove(product_id);
  }

  async uploadImage(product_id: string, file: Express.Multer.File) {
    const product = await this.findOne(product_id);
    product.addImage(file.buffer, file.mimetype);
    await this.productRepository.saveImage(product);
  }

  async getImage(product_id: string) {
    const product = await this.findOne(product_id);
    const image = await this.productRepository.getImage(product.id);
    if (!image) throw new ResourceNotFoundException('image not found');
    return image;
  }
}
