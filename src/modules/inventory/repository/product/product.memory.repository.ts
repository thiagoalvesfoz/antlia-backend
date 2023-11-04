import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { Image, Product } from '../../entities';

@Injectable()
export class ProductRepositoryMemory implements ProductRepository {
  products: Product[] = [];

  async create(product: Product): Promise<Product> {
    if (!product) return;
    product.id = randomUUID();
    product.created_at = new Date();
    product.updated_at = new Date();
    this.products.push(product);
    return product;
  }

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  async findById(id: string): Promise<Product> {
    if (!id || !id.trim()) return;
    return this.products.find((item) => item.id === id);
  }

  async findByCategoryId(category_id: string): Promise<Product[]> {
    if (!category_id || !category_id.trim()) return;
    return this.products.filter((item) => item.category_id === category_id);
  }

  async update(product: Product): Promise<Product> {
    if (!product || !product.id) return;

    this.products.forEach((prod, i) => {
      if (prod.id === product.id) {
        product.updated_at = new Date();
        this.products[i] = product;
      }
    });

    return product;
  }

  async remove(id: string): Promise<void> {
    this.products = this.products.filter((prod) => prod.id !== id);
  }

  async saveImage(product: Product): Promise<void> {
    const isPresent = this.findById(product.id);

    if (isPresent) {
      product.image.id = randomUUID();
      product.image.created_at = new Date();
      product.image.updated_at = new Date();
      this.update(product);
    }
  }

  async getImage(product_id: string): Promise<Image> {
    const product = await this.findById(product_id);
    return product.image || undefined;
  }
}
