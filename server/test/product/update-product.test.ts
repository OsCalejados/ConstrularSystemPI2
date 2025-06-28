import { HttpStatus } from '@nestjs/common';
import { Product } from '@prisma/client';
import { MeasureUnit } from '@src/common/enums/measure-unit.enum';
import { AppException } from '@src/common/exceptions/app.exception';
import { ProductService } from '@src/modules/product/services/product.service';
import { ProductFactory } from '../factories/product.factory';

describe('Update Product Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('deve atualizar um produto com sucesso', () => {
    it('should update a product successfully', async () => {
      const mockOrderService = ProductFactory.createMockOrderService();
      const existentProduct = ProductFactory.createProduct({
        id: 1,
        name: 'Existing Product',
        brand: 'Existing Brand',
      });
      const productId = existentProduct.id;
      const updateProductDto = ProductFactory.updateProductDto({
        name: 'Updated Product',
        brand: 'Updated Brand',
        unit: MeasureUnit.UN,
        stockQuantity: 100.0,
        costPrice: 50.0,
        profitMargin: 25.0,
        salePrice: 100.0,
      });

      const updateMock = jest
        .fn()
        .mockImplementation((productId: number, data: Partial<Product>) => {
          const updatedProduct = { ...existentProduct };

          Object.keys(data).forEach((key) => {
            if (data[key as keyof Product] !== undefined) {
              (updatedProduct as any)[key] = data[key as keyof Product];
            }
          });

          return Promise.resolve(updatedProduct as Product);
        });

      const mockProductRepository = ProductFactory.createMockProductRepository({
        update: updateMock,
        getAllByName: jest.fn().mockResolvedValue([existentProduct]),
        findById: jest.fn().mockResolvedValue(existentProduct),
      });

      const productService = new ProductService(
        mockProductRepository,
        mockOrderService,
      );

      const result = await productService.updateProduct(
        productId,
        updateProductDto,
      );

      const captureArgs = updateMock.mock.calls[0];

      expect(captureArgs[0]).toEqual(1);
      expect(captureArgs[1]).toEqual(updateProductDto);

      expect(result).toEqual({
        id: 1,
        name: 'Updated Product',
        brand: 'Updated Brand',
        unit: MeasureUnit.UN,
        stockQuantity: 100.0,
        costPrice: 50.0,
        profitMargin: 25.0,
        profit: 12.5,
        salePrice: 100.0,
        createdAt: expect.any(Date),
      });

      expect(updateMock).toHaveBeenCalledWith(productId, {
        name: 'Updated Product',
        brand: 'Updated Brand',
        salePrice: 100.0,
        unit: MeasureUnit.UN,
        stockQuantity: 100.0,
        costPrice: 50.0,
        profitMargin: 25.0,
        profit: 12.5,
      });
    });
  });

  describe('deve falhar ao atualizar um produto porque possui um número negativo', () => {
    it('should fail in update a product because have a negative number', async () => {
      const mockOrderService = ProductFactory.createMockOrderService();
      const updateProductDto = ProductFactory.updateProductDto({
        stockQuantity: -50.0,
        costPrice: -20.0,
      });

      const targetException = new AppException(
        'Negative numbers are not allowed.',
        HttpStatus.BAD_REQUEST,
        undefined,
        ['stockQuantity', 'costPrice'].sort(),
        undefined,
      );

      const mockProductRepository = ProductFactory.createMockProductRepository({
        getAllByName: jest.fn().mockResolvedValue([]),
        findById: jest
          .fn()
          .mockResolvedValue({ id: 1, name: 'Some Product' } as Product), // Produto existe
      });

      const productService = new ProductService(
        mockProductRepository,
        mockOrderService,
      );

      let capturedError: AppException | null = undefined;

      try {
        await productService.updateProduct(1, updateProductDto);
      } catch (error) {
        capturedError = error as AppException;
      }

      expect(capturedError).toBeInstanceOf(AppException);
      expect(capturedError?.message).toBe(targetException.message);
      expect(capturedError?.status).toBe(targetException.status);
      expect(capturedError?.validationErrorProperties).toEqual(
        targetException.validationErrorProperties,
      );
    });
  });

  describe('deve falhar ao atualizar um produto porque um produto com o mesmo nome já existe', () => {
    it('should fail in update a product because a product with the same name already exists', async () => {
      const mockOrderService = ProductFactory.createMockOrderService();
      const updateProductDto = ProductFactory.updateProductDto({
        name: 'Existing Product Name',
      });

      const targetException = new AppException(
        'Product with same name exists.',
        HttpStatus.BAD_REQUEST,
      );

      const mockProductRepository = ProductFactory.createMockProductRepository({
        getAllByName: jest
          .fn()
          .mockResolvedValue([
            { id: 2, name: 'Existing Product Name' } as Product,
          ]), // Outro produto com o mesmo nome
        findById: jest.fn().mockResolvedValue({
          id: 1,
          name: 'Original Product Name',
        } as Product), // Produto a ser atualizado
      });

      const productService = new ProductService(
        mockProductRepository,
        mockOrderService,
      );

      let capturedError: AppException | null = undefined;

      try {
        await productService.updateProduct(1, updateProductDto);
      } catch (error) {
        capturedError = error as AppException;
      }

      expect(capturedError).toBeInstanceOf(AppException);
      expect(capturedError?.message).toBe(targetException.message);
      expect(capturedError?.status).toBe(targetException.status);
    });
  });

  describe('deve falhar ao atualizar um produto porque o produto não existe', () => {
    it('should fail in update a product because the product does not exist', async () => {
      const mockOrderService = ProductFactory.createMockOrderService();
      const updateProductDto = ProductFactory.updateProductDto({
        name: 'Nonexistent Product',
      });

      const targetException = new AppException(
        'Product not found.',
        HttpStatus.NOT_FOUND,
      );

      const mockProductRepository = ProductFactory.createMockProductRepository({
        findById: jest.fn().mockResolvedValue(null), // Produto não encontrado
      });

      const productService = new ProductService(
        mockProductRepository,
        mockOrderService,
      );

      let capturedError: AppException | null = undefined;

      try {
        await productService.updateProduct(1, updateProductDto);
      } catch (error) {
        capturedError = error as AppException;
      }

      expect(capturedError).toBeInstanceOf(AppException);
      expect(capturedError?.message).toBe(targetException.message);
      expect(capturedError?.status).toBe(targetException.status);
    });
  });
});

describe('Remover posteriormente', () => {
  it('should be defined', () => {
    expect(1).toBeDefined();
  });
});
