import { Prisma, Product } from '@prisma/client';
import { CreateProductDto } from '@src/modules/product/dtos/create-product.dto';
import { ProductService } from '@src/modules/product/services/product.service';
import { IProductRepository } from '@src/modules/product/interfaces/product.repository.interface';
import { IOrderService } from '@src/modules/order/interfaces/order.service.interface';
import { MeasureUnit } from '@src/common/enums/measure-unit.enum';
import { ProductDto } from '@src/modules/product/dtos/product.dto';
import { AppException } from '@src/common/exceptions/app.exception';
import { HttpStatus } from '@nestjs/common';

describe('Create Product Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('deve criar um produto com sucesso', () => {
    it('should create a product successfully', async () => {
      const mockOrderService: IOrderService = {} as unknown as IOrderService;

      const createProductDto = new CreateProductDto();
      createProductDto.name = 'Test Product';
      createProductDto.brand = 'Test Brand';
      createProductDto.unit = MeasureUnit.UN;
      createProductDto.stockQuantity = 50.0;
      createProductDto.costPrice = 20.0;
      createProductDto.profitMargin = 30.0;
      createProductDto.profit = 6.0;
      createProductDto.salePrice = 26.0;

      const createMock = jest
        .fn()
        .mockImplementation((data: Prisma.ProductCreateInput) => {
          return Promise.resolve({
            ...data,
            createdAt: expect.any(Date),
            id: expect.any(Number),
          } as Product);
        });

      const mockProductRepository: IProductRepository = {
        create: createMock,
        existsByName: jest.fn().mockReturnValue(false),
      } as unknown as IProductRepository;

      const productService = new ProductService(
        mockProductRepository,
        mockOrderService,
      );

      const result = await productService.createProduct(createProductDto);

      expect(result).toEqual({
        id: expect.any(Number),
        name: 'Test Product',
        brand: 'Test Brand',
        unit: 'UN',
        stockQuantity: 50.0,
        costPrice: 20.0,
        profitMargin: 30.0,
        profit: 6.0,
        salePrice: 26.0,
        createdAt: expect.any(Date),
      } as ProductDto);

      const capturedArgs = createMock.mock.calls[0][0];

      expect(capturedArgs).toEqual({
        name: 'Test Product',
        brand: 'Test Brand',
        unit: MeasureUnit.UN,
        stockQuantity: 50.0,
        costPrice: 20.0,
        profitMargin: 30.0,
        profit: 6.0,
        salePrice: 26.0,
        createdAt: expect.any(Date),
      });
    });
  });

  describe('deve falhar ao criar um produto porque possui um número negativo', () => {
    it('should fail in create a product because have a negative number', async () => {
      const mockOrderService: IOrderService = {} as unknown as IOrderService;

      const createProductDto = new CreateProductDto();
      createProductDto.name = 'Test Product';
      createProductDto.brand = 'Test Brand';
      createProductDto.unit = MeasureUnit.UN;
      createProductDto.stockQuantity = -50.0;
      createProductDto.costPrice = -20.0;
      createProductDto.profitMargin = -30.0;
      createProductDto.profit = -6.0;
      createProductDto.salePrice = -26.0;

      const targetException = new AppException(
        'Negative numbers are not allowed.',
        HttpStatus.BAD_REQUEST,
        undefined,
        [
          'stockQuantity',
          'costPrice',
          'profitMargin',
          'profit',
          'salePrice',
        ].sort(),
        undefined,
      );

      const createMock = jest
        .fn()
        .mockImplementation((data: Prisma.ProductCreateInput) => {
          return Promise.resolve({
            ...data,
            createdAt: expect.any(Date),
            id: expect.any(Number),
          } as Product);
        });

      const mockProductRepository: IProductRepository = {
        create: createMock,
      } as unknown as IProductRepository;

      const productService = new ProductService(
        mockProductRepository,
        mockOrderService,
      );

      let capturedError: AppException | null = undefined;

      try {
        await productService.createProduct(createProductDto);
      } catch (error) {
        capturedError = error as AppException;
      }

      expect(capturedError).toBeInstanceOf(AppException);
      expect(capturedError?.message).toBe(targetException.message);
      expect(capturedError?.status).toBe(targetException.status);
      expect(capturedError?.validationErrorProperties).toEqual(
        targetException.validationErrorProperties,
      );
      expect(capturedError?.originalException).toBe(
        targetException.originalException,
      );
    });
  });

  describe('deve falhar ao criar um produto porque não possui propriedade obrigatória (todas ausentes)', () => {
    it("should fail in create a product because don't have obrigatory property", async () => {
      const mockOrderService: IOrderService = {} as unknown as IOrderService;

      const createProductDto = new CreateProductDto();

      const targetException = new AppException(
        'Missing or null required properties.',
        HttpStatus.BAD_REQUEST,
        undefined,
        [
          'name',
          'brand',
          'unit',
          'stockQuantity',
          'costPrice',
          'profitMargin',
          'profit',
          'salePrice',
        ].sort(),
        undefined,
      );

      const createMock = jest.fn();

      const mockProductRepository: IProductRepository = {
        create: createMock,
      } as unknown as IProductRepository;

      const productService = new ProductService(
        mockProductRepository,
        mockOrderService,
      );

      let capturedError: AppException | null = null;

      try {
        await productService.createProduct(createProductDto);
      } catch (error) {
        capturedError = error as AppException;
      }

      expect(capturedError?.message).toBe(targetException.message);
      expect(capturedError?.status).toBe(targetException.status);
      expect(capturedError?.validationErrorProperties).toEqual(
        targetException.validationErrorProperties,
      );
    });
  });

  describe('deve falhar ao criar um produto porque não possui propriedade obrigatória (algumas nulas)', () => {
    it("should fail in create a product because don't have obrigatory property", async () => {
      const mockOrderService: IOrderService = {} as unknown as IOrderService;

      const createProductDto = new CreateProductDto();
      createProductDto.name = 'Test Product';
      createProductDto.brand = 'Test Brand';
      createProductDto.unit = MeasureUnit.UN;
      createProductDto.stockQuantity = 50.0;
      createProductDto.costPrice = 20.0;
      createProductDto.profitMargin = null;
      createProductDto.profit = null;
      createProductDto.salePrice = null;

      const targetException = new AppException(
        'Missing or null required properties.',
        HttpStatus.BAD_REQUEST,
        undefined,
        ['profitMargin', 'profit', 'salePrice'].sort(),
        undefined,
      );

      const createMock = jest.fn();

      const mockProductRepository: IProductRepository = {
        create: createMock,
      } as unknown as IProductRepository;

      const productService = new ProductService(
        mockProductRepository,
        mockOrderService,
      );

      let capturedError: AppException | null = undefined;

      try {
        await productService.createProduct(createProductDto);
      } catch (error) {
        capturedError = error as AppException;
      }

      expect(capturedError?.message).toBe(targetException.message);
      expect(capturedError?.status).toBe(targetException.status);
      expect(capturedError?.validationErrorProperties).toEqual(
        targetException.validationErrorProperties,
      );
    });
  });

  describe('deve falhar ao criar um produto porque um produto com o mesmo nome já existe', () => {
    it('should fail in create a product because a product with the same name already exists', async () => {
      const mockOrderService: IOrderService = {} as unknown as IOrderService;

      const createProductDto = new CreateProductDto();
      createProductDto.name = 'Test Product';
      createProductDto.brand = 'Test Brand';
      createProductDto.unit = MeasureUnit.UN;
      createProductDto.stockQuantity = 50.0;
      createProductDto.costPrice = 20.0;
      createProductDto.profitMargin = 30.0;
      createProductDto.profit = 6.0;
      createProductDto.salePrice = 26.0;

      const targetException = new AppException(
        'Product with same name exists.',
        HttpStatus.BAD_REQUEST,
        undefined,
        [],
        undefined,
      );

      const createMock = jest
        .fn()
        .mockImplementation((data: Prisma.ProductCreateInput) => {
          return Promise.resolve({
            ...data,
            createdAt: expect.any(Date),
            id: expect.any(Number),
          } as Product);
        });

      const mockProductRepository: IProductRepository = {
        create: createMock,
        existsByName: jest.fn().mockReturnValue(true),
      } as unknown as IProductRepository;

      const productService = new ProductService(
        mockProductRepository,
        mockOrderService,
      );

      let capturedError: AppException | null = undefined;

      try {
        await productService.createProduct(createProductDto);
      } catch (error) {
        capturedError = error as AppException;
      }

      expect(capturedError).toBeInstanceOf(AppException);
      expect(capturedError?.message).toBe(targetException.message);
      expect(capturedError?.status).toBe(targetException.status);
      expect(capturedError?.validationErrorProperties).toEqual(
        targetException.validationErrorProperties,
      );
      expect(capturedError?.originalException).toBe(
        targetException.originalException,
      );
    });
  });
});
