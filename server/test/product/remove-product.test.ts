import { HttpStatus } from '@nestjs/common';
import { AppException } from '@src/common/exceptions/app.exception';
import { ProductService } from '@src/modules/product/services/product.service';
import { ProductFactory } from '../factories/product.factory';

describe('Remove Product Service Tests', () => {
  describe('deve remover um produto com sucesso', () => {
    it('should remove a product successfully', async () => {
      const mockOrderService = ProductFactory.createMockOrderService({
        getOrdersByProductId: jest.fn().mockResolvedValue([]),
      });
      const mockProductRepository = ProductFactory.createMockProductRepository({
        findById: jest
          .fn()
          .mockResolvedValue(
            ProductFactory.createProduct({ id: 1, name: 'Martelo de Unha' }),
          ),
        delete: jest.fn().mockResolvedValue(null),
      });

      const productService = new ProductService(
        mockProductRepository,
        mockOrderService,
      );

      await productService.deleteProduct(1);

      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
      expect(mockProductRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('deve falhar ao remover um produto inexistente', () => {
    it('should fail to remove a non-existent product', async () => {
      const mockOrderService = ProductFactory.createMockOrderService({
        getOrdersByProductId: jest.fn().mockResolvedValue([]),
      });
      const mockProductRepository = ProductFactory.createMockProductRepository({
        findById: jest.fn().mockResolvedValue(null),
      });

      const productService = new ProductService(
        mockProductRepository,
        mockOrderService,
      );

      await expect(productService.deleteProduct(999)).rejects.toThrow(
        new AppException('Product not found.', HttpStatus.NOT_FOUND),
      );

      expect(mockProductRepository.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('deve falhar ao remover um produto com histórico de vendas', () => {
    it('should fail to remove a product with sales history', async () => {
      const mockOrderService = ProductFactory.createMockOrderService({
        getOrdersByProductId: jest.fn().mockResolvedValue([{ id: 1 }]),
      });
      const mockProductRepository = ProductFactory.createMockProductRepository({
        findById: jest.fn().mockResolvedValue(
          ProductFactory.createProduct({
            id: 1,
            name: 'Cano soldável de 25mm',
          }),
        ),
      });

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

      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
      expect(mockOrderService.getOrdersByProductId).toHaveBeenCalledWith(1);
    });
  });
});
