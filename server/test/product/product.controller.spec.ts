import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '@src/modules/product/controllers/product.controller';
import { IProductService } from '@src/modules/product/interfaces/product.service.interface';
import { ProductDto } from '@src/modules/product/dtos/product.dto';
import { MeasureUnit } from '@src/common/enums/measure-unit.enum';
import { CreateProductDto } from '@src/modules/product/dtos/create-product.dto';
import { UpdateProductDto } from '@src/modules/product/dtos/update-product.dto';
import { AppException } from '@src/common/exceptions/app.exception';
import { HttpStatus } from '@nestjs/common';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: IProductService;

  const mockProductDto: ProductDto = {
    id: 1,
    name: 'Test Product',
    brand: 'Test Brand',
    unit: MeasureUnit.UN,
    stockQuantity: 10,
    costPrice: 100,
    profitMargin: 0.2,
    profit: 20,
    salePrice: 120,
    createdAt: new Date(),
  };

  const mockCreateProductDto: CreateProductDto = {
    name: 'New Product',
    brand: 'New Brand',
    unit: MeasureUnit.KG,
    stockQuantity: 50,
    costPrice: 200,
    profitMargin: 0.25,
    profit: 50,
    salePrice: 250,
  };

  const mockUpdateProductDto: UpdateProductDto = {
    name: 'Updated Product Name',
    stockQuantity: 15,
  };

  const mockProductService = {
    getAllProducts: jest.fn(),
    getProductById: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: 'IProductService',
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<IProductService>('IProductService');

    mockProductService.getAllProducts.mockClear();
    mockProductService.getProductById.mockClear();
    mockProductService.createProduct.mockClear();
    mockProductService.updateProduct.mockClear();
    mockProductService.deleteProduct.mockClear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return an array of products', async () => {
      const result: ProductDto[] = [mockProductDto];
      mockProductService.getAllProducts.mockResolvedValue(result);

      expect(await controller.getAllProducts()).toBe(result);
      expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no products exist', async () => {
      const result: ProductDto[] = [];
      mockProductService.getAllProducts.mockResolvedValue(result);

      expect(await controller.getAllProducts()).toBe(result);
      expect(productService.getAllProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProductById', () => {
    it('should return a single product if found', async () => {
      mockProductService.getProductById.mockResolvedValue(mockProductDto);

      expect(await controller.getProductById(1)).toBe(mockProductDto);
      expect(productService.getProductById).toHaveBeenCalledWith(1);
      expect(productService.getProductById).toHaveBeenCalledTimes(1);
    });

    it('should throw AppException if product is not found', async () => {
      const errorMessage = 'Product not found.';
      mockProductService.getProductById.mockRejectedValue(
        new AppException(errorMessage, HttpStatus.NOT_FOUND),
      );

      await expect(controller.getProductById(999)).rejects.toThrow(
        new AppException(errorMessage, HttpStatus.NOT_FOUND),
      );
      expect(productService.getProductById).toHaveBeenCalledWith(999);
    });
  });

  describe('createProduct', () => {
    it('should create and return a new product', async () => {
      const createdProduct = {
        ...mockProductDto,
        ...mockCreateProductDto,
        id: 2,
      };
      mockProductService.createProduct.mockResolvedValue(createdProduct);

      expect(await controller.createProduct(mockCreateProductDto)).toBe(
        createdProduct,
      );
      expect(productService.createProduct).toHaveBeenCalledWith(
        mockCreateProductDto,
      );
      expect(productService.createProduct).toHaveBeenCalledTimes(1);
    });

    it('should throw AppException if creation fails (e.g., validation error)', async () => {
      const errorMessage = 'Invalid product data.';
      mockProductService.createProduct.mockRejectedValue(
        new AppException(errorMessage, HttpStatus.BAD_REQUEST),
      );

      await expect(
        controller.createProduct(mockCreateProductDto),
      ).rejects.toThrow(new AppException(errorMessage, HttpStatus.BAD_REQUEST));
    });
  });

  describe('updateProduct', () => {
    it('should update and return the product', async () => {
      const productId = 1;
      const updatedProduct = { ...mockProductDto, ...mockUpdateProductDto };
      mockProductService.updateProduct.mockResolvedValue(updatedProduct);

      expect(
        await controller.updateProduct(productId, mockUpdateProductDto),
      ).toBe(updatedProduct);
      expect(productService.updateProduct).toHaveBeenCalledWith(
        productId,
        mockUpdateProductDto,
      );
      expect(productService.updateProduct).toHaveBeenCalledTimes(1);
    });

    it('should throw AppException if product to update is not found', async () => {
      const productId = 999;
      const errorMessage = 'Product not found.';
      mockProductService.updateProduct.mockRejectedValue(
        new AppException(errorMessage, HttpStatus.NOT_FOUND),
      );

      await expect(
        controller.updateProduct(productId, mockUpdateProductDto),
      ).rejects.toThrow(new AppException(errorMessage, HttpStatus.NOT_FOUND));
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      const productId = 1;
      mockProductService.deleteProduct.mockResolvedValue(null);

      await expect(
        controller.deleteProduct(productId),
      ).resolves.toBeUndefined();
      expect(productService.deleteProduct).toHaveBeenCalledWith(productId);
      expect(productService.deleteProduct).toHaveBeenCalledTimes(1);
    });

    it('should throw AppException if product to delete is not found', async () => {
      const productId = 999;
      const errorMessage = 'Product not found.';
      mockProductService.deleteProduct.mockRejectedValue(
        new AppException(errorMessage, HttpStatus.NOT_FOUND),
      );

      await expect(controller.deleteProduct(productId)).rejects.toThrow(
        new AppException(errorMessage, HttpStatus.NOT_FOUND),
      );
    });

    it('should throw AppException if product has sales history', async () => {
      const productId = 1;
      const errorMessage = 'Cannot remove product. It has a sales history.';
      mockProductService.deleteProduct.mockRejectedValue(
        new AppException(errorMessage, HttpStatus.BAD_REQUEST),
      );

      await expect(controller.deleteProduct(productId)).rejects.toThrow(
        new AppException(errorMessage, HttpStatus.BAD_REQUEST),
      );
    });
  });
});
