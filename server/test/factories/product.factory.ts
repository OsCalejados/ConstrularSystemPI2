import { CreateProductDto } from '@src/modules/product/dtos/create-product.dto';
import { UpdateProductDto } from '@src/modules/product/dtos/update-product.dto';
import { Product } from '@prisma/client';
import { MeasureUnit } from '@src/common/enums/measure-unit.enum';
import { Decimal } from '@prisma/client/runtime/library';
import { IProductRepository } from '@src/modules/product/interfaces/product.repository.interface';
import { IOrderService } from '@src/modules/order/interfaces/order.service.interface';

export class ProductFactory {
  static createProductDto(
    overrides: Partial<CreateProductDto> = {},
  ): CreateProductDto {
    return {
      name: 'Test Product',
      brand: 'Test Brand',
      unit: MeasureUnit.UN,
      stockQuantity: 50.0,
      costPrice: 20.0,
      profitMargin: 30.0,
      profit: 6.0,
      salePrice: 26.0,
      ...overrides,
    };
  }

  static updateProductDto(
    overrides: Partial<UpdateProductDto> = {},
  ): UpdateProductDto {
    return {
      name: 'Updated Product Name',
      brand: 'Updated Brand',
      unit: MeasureUnit.UN,
      stockQuantity: 100.0,
      costPrice: 50.0,
      profitMargin: 25.0,
      profit: 12.5,
      salePrice: 62.5,
      ...overrides,
    };
  }

  static createProduct(overrides: Partial<Product> = {}): Product {
    return {
      id: overrides.id || 1,
      name: overrides.name || 'Test Product',
      brand: overrides.brand || 'Test Brand',
      unit: overrides.unit || MeasureUnit.UN,
      stockQuantity: new Decimal(overrides.stockQuantity ?? 50.0),
      costPrice: new Decimal(overrides.costPrice ?? 20.0),
      profitMargin: new Decimal(overrides.profitMargin ?? 30.0),
      profit: new Decimal(overrides.profit ?? 6.0),
      salePrice: new Decimal(overrides.salePrice ?? 26.0),
      createdAt: overrides.createdAt || new Date(),
    } as Product;
  }

  static createMockProductRepository(
    mocks: Partial<IProductRepository> = {},
  ): IProductRepository {
    return {
      create: jest.fn().mockResolvedValue(ProductFactory.createProduct()),
      findAll: jest.fn().mockResolvedValue([]),
      findById: jest.fn().mockResolvedValue(ProductFactory.createProduct()),
      update: jest.fn().mockResolvedValue(ProductFactory.createProduct()),
      delete: jest.fn().mockResolvedValue(undefined),
      existsByName: jest.fn().mockResolvedValue(false),
      getAllByName: jest.fn().mockResolvedValue([]),
      ...mocks,
    } as unknown as IProductRepository;
  }

  static createMockOrderService(
    mocks: Partial<IOrderService> = {},
  ): IOrderService {
    return {
      getOrdersByProductId: jest.fn().mockResolvedValue([]),
      ...mocks,
    } as unknown as IOrderService;
  }
}
