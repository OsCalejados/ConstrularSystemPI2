import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async getAllProducts() {
    const orders = await this.productRepository.findAll();

    return orders;
  }
}
