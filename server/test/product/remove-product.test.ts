import { HttpStatus } from '@nestjs/common';
import { Product } from '@prisma/client';
import { AppException } from '@src/common/exceptions/app.exception';
import { IOrderService } from '@src/modules/order/interfaces/order.service.interface';
import { IProductRepository } from '@src/modules/product/interfaces/product.repository.interface';
import { ProductService } from '@src/modules/product/services/product.service';

describe('Remove Product Service Tests', () => {
  it('should remove a product successfully', async () => {
    const mockOrderService: IOrderService = {
      getOrdersByProductId: jest.fn().mockResolvedValue([]),
    } as unknown as IOrderService;

    const findByIdMock = jest.fn().mockResolvedValue({
      id: 1,
      name: 'Martelo de Unha',
    } as Product);

    const deleteMock = jest.fn().mockResolvedValue(null);

    const mockProductRepository: IProductRepository = {
      findById: findByIdMock,
      delete: deleteMock,
    } as unknown as IProductRepository;

    const productService = new ProductService(
      mockProductRepository,
      mockOrderService,
    );

    await productService.deleteProduct(1);

    expect(findByIdMock).toHaveBeenCalledWith(1);
    expect(deleteMock).toHaveBeenCalledWith(1);
  });

  it('should fail to remove a non-existent product', async () => {
    const mockOrderService: IOrderService = {
      getOrdersByProductId: jest.fn().mockResolvedValue([]),
    } as unknown as IOrderService;

    const findByIdMock = jest.fn().mockResolvedValue(null);

    const mockProductRepository: IProductRepository = {
      findById: findByIdMock,
    } as unknown as IProductRepository;

    const productService = new ProductService(
      mockProductRepository,
      mockOrderService,
    );

    await expect(productService.deleteProduct(999)).rejects.toThrow(
      new AppException('Product not found.', HttpStatus.NOT_FOUND),
    );

    expect(findByIdMock).toHaveBeenCalledWith(999);
  });

  it('should fail to remove a product with sales history', async () => {
    const mockOrderService: IOrderService = {
      getOrdersByProductId: jest.fn().mockResolvedValue([{ id: 1 }]), // Simula histórico de vendas
    } as unknown as IOrderService;

    const findByIdMock = jest.fn().mockResolvedValue({
      id: 1,
      name: 'Cano soldável de 25mm',
    } as Product);

    const mockProductRepository: IProductRepository = {
      findById: findByIdMock,
    } as unknown as IProductRepository;

    const productService = new ProductService(
      mockProductRepository,
      mockOrderService,
    );

    await expect(productService.deleteProduct(1)).rejects.toThrow(
      new AppException(
        'Cannot remove product. It has a sales history.',
        HttpStatus.BAD_REQUEST,
      ),
    );

    expect(findByIdMock).toHaveBeenCalledWith(1);
    expect(mockOrderService.getOrdersByProductId).toHaveBeenCalledWith(1);
  });
});
