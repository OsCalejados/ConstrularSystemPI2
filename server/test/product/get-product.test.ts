import { HttpStatus } from '@nestjs/common';
import { Product } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { AppException } from '@src/common/exceptions/app.exception';
import { IOrderService } from '@src/modules/order/interfaces/order.service.interface';
import { IProductRepository } from '@src/modules/product/interfaces/product.repository.interface';
import { ProductService } from '@src/modules/product/services/product.service';

describe('Get Product Service Tests', () => {
  it('should retrieve product details successfully', async () => {
    const mockOrderService: IOrderService = {} as unknown as IOrderService;

    const existentProduct = {
      id: 1,
      name: 'Chave de fenda',
      brand: 'Tramontina',
      unit: 'Metros',
      stockQuantity: new Decimal(50),
      costPrice: new Decimal(50.0),
      profitMargin: new Decimal(50.01),
      profit: new Decimal(50.0),
      salePrice: new Decimal(50.0),
      createdAt: new Date(),
    } as Product;

    const findByIdMock = jest.fn().mockResolvedValue(existentProduct);

    const mockProductRepository: IProductRepository = {
      findById: findByIdMock,
    } as unknown as IProductRepository;

    const productService = new ProductService(
      mockProductRepository,
      mockOrderService,
    );

    const result = await productService.getProductById(1);

    expect(result).toEqual({
      id: 1,
      name: 'Chave de fenda',
      brand: 'Tramontina',
      unit: 'Metros',
      stockQuantity: 50,
      costPrice: 50.0,
      profitMargin: 50.01,
      profit: 50.0,
      salePrice: 50.0,
      createdAt: expect.any(Date),
    });

    expect(findByIdMock).toHaveBeenCalledWith(1);
  });

  it('should fail to retrieve product details for a non-existent product', async () => {
    const mockOrderService: IOrderService = {} as unknown as IOrderService;

    const findByIdMock = jest.fn().mockResolvedValue(null);

    const mockProductRepository: IProductRepository = {
      findById: findByIdMock,
    } as unknown as IProductRepository;

    const productService = new ProductService(
      mockProductRepository,
      mockOrderService,
    );

    await expect(productService.getProductById(1000)).rejects.toThrow(
      new AppException('Product not found.', HttpStatus.NOT_FOUND),
    );

    expect(findByIdMock).toHaveBeenCalledWith(1000);
  });

  it('should throw AppException with INTERNAL_SERVER_ERROR if repository throws an unexpected error', async () => {
    const mockOrderService: IOrderService = {} as unknown as IOrderService;
    const errorMessage = 'Database connection lost';

    const findByIdMock = jest.fn().mockRejectedValue(new Error(errorMessage));

    const mockProductRepository: IProductRepository = {
      findById: findByIdMock,
    } as unknown as IProductRepository;

    const productService = new ProductService(
      mockProductRepository,
      mockOrderService,
    );

    await expect(productService.getProductById(1)).rejects.toThrow(
      new AppException(
        `Failed to retrieve product with ID 1.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        new Error(errorMessage),
      ),
    );
    expect(findByIdMock).toHaveBeenCalledWith(1);
  });
});
