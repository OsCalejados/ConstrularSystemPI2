import { HttpStatus } from '@nestjs/common';
import { Product } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { MeasureUnit } from '@src/common/enums/measure-unit.enum';
import { AppException } from '@src/common/exceptions/app.exception';
import { IOrderService } from '@src/modules/order/interfaces/order.service.interface';
import { UpdateProductDto } from '@src/modules/product/dtos/update-product.dto';
import { IProductRepository } from '@src/modules/product/interfaces/product.repository.interface';
import { ProductService } from '@src/modules/product/services/product.service';

describe('Update Product Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update a product successfully', async () => {
    const mockOrderService: IOrderService = {} as unknown as IOrderService;

    const existentProduct = {
      id: 1,
      name: 'Existing Product',
      brand: 'Existing Brand',
      unit: MeasureUnit.UN,
      stockQuantity: new Decimal(100.0),
      costPrice: new Decimal(50.0),
      profitMargin: new Decimal(20.0),
      profit: new Decimal(10.0),
      salePrice: new Decimal(60.0),
      createdAt: new Date(),
    } as Product;

    const productId = 1;
    const updateProductDto = new UpdateProductDto();
    updateProductDto.name = 'Updated Product';
    updateProductDto.brand = 'Updated Brand';
    updateProductDto.salePrice = 100.0;

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

    const mockProductRepository: IProductRepository = {
      update: updateMock,
      getAllByName: jest.fn().mockResolvedValue([existentProduct]),
      findById: jest.fn().mockResolvedValue(true),
    } as unknown as IProductRepository;

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
      profitMargin: 20.0,
      profit: 10.0,
      salePrice: 100.0,
      createdAt: expect.any(Date),
    });

    expect(updateMock).toHaveBeenCalledWith(productId, {
      name: 'Updated Product',
      brand: 'Updated Brand',
      salePrice: 100.0,
      unit: undefined,
      stockQuantity: undefined,
      costPrice: undefined,
      profitMargin: undefined,
      profit: undefined,
    });
  });

  it('should fail in update a product because have a negative number', async () => {
    const mockOrderService: IOrderService = {} as unknown as IOrderService;

    const updateProductDto = new UpdateProductDto();
    updateProductDto.stockQuantity = -50.0;
    updateProductDto.costPrice = -20.0;

    const targetException = new AppException(
      'Negative numbers are not allowed.',
      HttpStatus.BAD_REQUEST,
      undefined,
      ['stockQuantity', 'costPrice'].sort(),
      undefined,
    );

    const mockProductRepository: IProductRepository = {
      getAllByName: jest.fn().mockResolvedValue([]),
      findById: jest.fn().mockResolvedValue(true),
    } as unknown as IProductRepository;

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

  it('should fail in update a product because a product with the same name already exists', async () => {
    const mockOrderService: IOrderService = {} as unknown as IOrderService;

    const updateProductDto = new UpdateProductDto();
    updateProductDto.name = 'Existing Product';

    const targetException = new AppException(
      'Product with same name exists.',
      HttpStatus.BAD_REQUEST,
      undefined,
      [],
      undefined,
    );

    const mockProductRepository: IProductRepository = {
      getAllByName: jest
        .fn()
        .mockResolvedValue([{ id: 2, name: 'Existing Product' }]),
      findById: jest.fn().mockResolvedValue(true),
    } as unknown as IProductRepository;

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

  it('should fail in update a product because the product does not exist', async () => {
    const mockOrderService: IOrderService = {} as unknown as IOrderService;

    const updateProductDto = new UpdateProductDto();
    updateProductDto.name = 'Nonexistent Product';

    const targetException = new AppException(
      'Product not found.',
      HttpStatus.NOT_FOUND,
      undefined,
      [],
      undefined,
    );

    const mockProductRepository: IProductRepository = {
      findById: jest.fn().mockResolvedValue(null),
    } as unknown as IProductRepository;

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
