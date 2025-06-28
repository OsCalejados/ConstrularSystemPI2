import { HttpStatus } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { AppException } from '@src/common/exceptions/app.exception';
import { ProductService } from '@src/modules/product/services/product.service';
import { ProductFactory } from '../factories/product.factory';
import { MeasureUnit } from '@src/common/enums/measure-unit.enum';

describe('Get Product Service Tests', () => {
  describe('deve recuperar os detalhes do produto com sucesso', () => {
    it('should retrieve product details successfully', async () => {
      const mockOrderService = ProductFactory.createMockOrderService();
      const existentProduct = ProductFactory.createProduct({
        name: 'Chave de fenda',
        brand: 'Tramontina',
        unit: MeasureUnit.UN,
        stockQuantity: new Decimal(50),
        costPrice: new Decimal(50.0),
        profitMargin: new Decimal(50.01),
        profit: new Decimal(50.0),
        salePrice: new Decimal(50.0),
      });

      const mockProductRepository = ProductFactory.createMockProductRepository({
        findById: jest.fn().mockResolvedValue(existentProduct),
      });

      const productService = new ProductService(
        mockProductRepository,
        mockOrderService,
      );

      const result = await productService.getProductById(1);

      expect(result).toEqual({
        id: 1,
        name: 'Chave de fenda',
        brand: 'Tramontina',
        unit: MeasureUnit.UN,
        stockQuantity: 50,
        costPrice: 50.0,
        profitMargin: 50.01,
        profit: 50.0,
        salePrice: 50.0,
        createdAt: expect.any(Date),
      });

      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('deve falhar ao recuperar detalhes de um produto inexistente', () => {
    it('should fail to retrieve product details for a non-existent product', async () => {
      const mockOrderService = ProductFactory.createMockOrderService();
      const mockProductRepository = ProductFactory.createMockProductRepository({
        findById: jest.fn().mockResolvedValue(null),
      });

      const productService = new ProductService(
        mockProductRepository,
        mockOrderService,
      );

      await expect(productService.getProductById(1000)).rejects.toThrow(
        new AppException('Product not found.', HttpStatus.NOT_FOUND),
      );

      expect(mockProductRepository.findById).toHaveBeenCalledWith(1000);
    });
  });

  describe('deve lançar AppException com INTERNAL_SERVER_ERROR se o repositório lançar um erro inesperado', () => {
    it('should throw AppException with INTERNAL_SERVER_ERROR if repository throws an unexpected error', async () => {
      const mockOrderService = ProductFactory.createMockOrderService();
      const errorMessage = 'Database connection lost';
      const mockProductRepository = ProductFactory.createMockProductRepository({
        findById: jest.fn().mockRejectedValue(new Error(errorMessage)),
      });

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
      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
    });
  });
});
