import { Inject, Injectable } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ProductRepository, PRODUCT_NAME_PROVIDER } from '../repository';
import { BusinessRuleException } from 'src/common/exceptions/business-rule.exception';
import { ResourceNotFoundException } from 'src/common/exceptions/resource-not-found.exception';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities';

type ProductInput = {
  image?: Express.Multer.File;
  category_id: string;
  name: string;
  price: number;
  availability: boolean;
};

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCT_NAME_PROVIDER)
    private readonly productRepository: ProductRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createProduct: ProductInput) {
    if (!createProduct.category_id) {
      throw new BusinessRuleException('category_id is required!');
    }

    const category = await this.categoriesService.findOne(
      createProduct.category_id,
    );

    const product = new Product({
      category_id: category.id,
      category_name: category.name,
      name: createProduct.name,
      price: createProduct.price,
      availability: createProduct.availability,
    });

    if (createProduct.image) {
      const { image } = createProduct;
      product.addImage(image.buffer, image.mimetype);
    }

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

  async getImage(product_id: string) {
    const product = await this.findOne(product_id);

    console.log('Product -> ', product);

    const image = await this.productRepository.getImage(product.image_id);
    if (!image) throw new ResourceNotFoundException('image not found');
    return image;
  }
}
