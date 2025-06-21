/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IProductService } from '../interfaces/product.service.interface';
import { IProductRepository } from '../interfaces/product.repository.interface';
import { IOrderService } from '@src/modules/order/interfaces/order.service.interface';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductDto } from '../dtos/product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Prisma, Product } from '@prisma/client';
import { AppException } from '@src/common/exceptions/app.exception';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    private productRepository: IProductRepository,
    private orderService: IOrderService,
  ) {}

  async getAllProducts(): Promise<ProductDto[]> {
    try {
      const products = await this.productRepository.findAll();

      return products.map(
        (product) =>
          ({
            id: product.id,
            name: product.name,
            brand: product.brand,
            costPrice: Number(product.costPrice),
            createdAt: product.createdAt,
            profit: Number(product.profit),
            profitMargin: Number(product.profitMargin),
            salePrice: Number(product.salePrice),
            stockQuantity: Number(product.stockQuantity),
            unit: product.unit,
          }) as ProductDto,
      );
    } catch (error) {
      throw new AppException(
        'Failed to retrieve products from database.',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  async getProductById(productId: number): Promise<ProductDto> {
    try {
      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw new AppException('Product not found.', HttpStatus.NOT_FOUND);
      }
      return {
        id: product.id,
        name: product.name,
        brand: product.brand,
        costPrice: Number(product.costPrice),
        createdAt: product.createdAt,
        profit: Number(product.profit),
        profitMargin: Number(product.profitMargin),
        salePrice: Number(product.salePrice),
        stockQuantity: Number(product.stockQuantity),
        unit: product.unit,
      } as ProductDto;
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException(
        `Failed to retrieve product with ID ${productId}.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  async createProduct(data: CreateProductDto): Promise<ProductDto> {
    const validation = this.checkIfPropertiesAreValid(data, false);
    if (!validation.isValid) {
      throw new AppException(
        validation.error || 'Invalid product data',
        HttpStatus.BAD_REQUEST,
        undefined,
        validation.properties || [],
      );
    }
    try {
      if (await this.productRepository.existsByName(data.name))
        throw new AppException(
          'Product with same name exists.',
          HttpStatus.BAD_REQUEST,
        );

      const producoInputData: Prisma.ProductCreateInput = {
        name: data.name,
        brand: data.brand,
        unit: data.unit,
        stockQuantity: data.stockQuantity,
        costPrice: data.costPrice,
        profitMargin: data.profitMargin,
        profit: data.profit,
        salePrice: data.salePrice,
        createdAt: new Date(),
      };
      const product = await this.productRepository.create(producoInputData);
      return {
        id: product.id,
        name: product.name,
        brand: product.brand,
        unit: product.unit,
        stockQuantity: Number(product.stockQuantity),
        costPrice: Number(product.costPrice),
        profitMargin: Number(product.profitMargin),
        profit: Number(product.profit),
        salePrice: Number(product.salePrice),
        createdAt: product.createdAt,
      } as ProductDto;
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException(
        'Failed to create product.',
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  async updateProduct(
    productId: number,
    data: UpdateProductDto,
  ): Promise<ProductDto> {
    let productToUpdate: Product | null;
    try {
      productToUpdate = await this.productRepository.findById(productId);
    } catch (error) {
      throw new AppException(
        `Error finding product with ID ${productId} for update.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }

    if (!productToUpdate) {
      throw new AppException('Product not found.', HttpStatus.NOT_FOUND);
    }

    const validation = this.checkIfPropertiesAreValid(data, true);
    if (!validation.isValid) {
      throw new AppException(
        validation.error || 'Invalid product data',
        HttpStatus.BAD_REQUEST,
        null,
        validation.properties || [],
      );
    }

    try {
      if (data.name && data.name !== productToUpdate.name) {
        const existingProductsWithNewName =
          await this.productRepository.getAllByName(data.name);
        if (existingProductsWithNewName.some((p) => p.id !== productId)) {
          throw new AppException(
            'Product with same name exists.',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const produtoInputData: Prisma.ProductUpdateInput = {
        name: data.name,
        brand: data.brand,
        unit: data.unit,
        stockQuantity: data.stockQuantity,
        costPrice: data.costPrice,
        profitMargin: data.profitMargin,
        profit: data.profit,
        salePrice: data.salePrice,
      };

      const updatedProduct = await this.productRepository.update(
        productId,
        produtoInputData,
      );
      if (!updatedProduct) {
        throw new AppException(
          'Failed to update product or product not found after update attempt.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        id: updatedProduct.id,
        name: updatedProduct.name,
        brand: updatedProduct.brand,
        unit: updatedProduct.unit,
        stockQuantity: Number(updatedProduct.stockQuantity),
        costPrice: Number(updatedProduct.costPrice),
        profitMargin: Number(updatedProduct.profitMargin),
        profit: Number(updatedProduct.profit),
        salePrice: Number(updatedProduct.salePrice),
        createdAt: updatedProduct.createdAt,
      } as ProductDto;
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException(
        `Failed to update product with ID ${productId}.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  async deleteProduct(productId: number): Promise<void> {
    let product: Product | null;
    try {
      product = await this.productRepository.findById(productId);
    } catch (error) {
      throw new AppException(
        `Error finding product with ID ${productId} for deletion.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }

    if (!product) {
      throw new AppException('Product not found.', HttpStatus.NOT_FOUND);
    }

    try {
      const orders = await this.orderService.getOrdersByProductId(productId);
      if (orders.length > 0) {
        throw new AppException(
          'Cannot remove product. It has a sales history.',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.productRepository.delete(productId);
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException(
        `Failed to delete product with ID ${productId}.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      );
    }
  }

  private checkIfPropertiesAreValid(
    data: Partial<CreateProductDto>,
    isUpdate: boolean,
  ): {
    isValid: boolean;
    error?: string;
    properties?: string[];
  } {
    const expectedProperties: (keyof CreateProductDto)[] = [
      'name',
      'brand',
      'unit',
      'stockQuantity',
      'costPrice',
      'profitMargin',
      'profit',
      'salePrice',
    ];

    const providedProperties = Object.keys(data) as (keyof CreateProductDto)[];

    if (!isUpdate) {
      const missingProperties = expectedProperties.filter(
        (prop) => !(prop in data) || data[prop] == null,
      );

      if (missingProperties.length > 0) {
        return {
          isValid: false,
          error: 'Missing or null required properties.',
          properties: missingProperties.sort(),
        };
      }
    }

    const propertiesToValidateValues = isUpdate
      ? providedProperties
      : expectedProperties;

    const negativeNumberProperties = propertiesToValidateValues.filter(
      (prop) =>
        prop in data &&
        typeof data[prop] === 'number' &&
        (data[prop] as number) < 0,
    );

    if (negativeNumberProperties.length > 0) {
      return {
        isValid: false,
        error: 'Negative numbers are not allowed.',
        properties: negativeNumberProperties.sort(),
      };
    }

    return { isValid: true };
  }
}
