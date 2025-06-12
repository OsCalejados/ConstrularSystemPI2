import { ProductDto } from '../dtos/product.dto';
import { Product } from '@prisma/client';

export class ProductMapper {
  static toDto(product: Product): ProductDto {
    return {
      id: product.id,
      name: product.name,
      brand: product.brand,
      unit: product.unit,
      stockQuantity: Number(product.stockQuantity),
      costPrice: Number(product.costPrice),
      profit: Number(product.profit),
      profitMargin: Number(product.profitMargin),
      salePrice: Number(product.salePrice),
      createdAt: product.createdAt,
    };
  }
}
