/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/common/services/prisma.service';
import { StartedTestContainer, GenericContainer, Wait } from 'testcontainers';
import { execSync } from 'child_process';
import { PrismaClient, Product, Order } from '@prisma/client';
import { HttpStatus } from '@nestjs/common';

// Implementações Reais
import { ProductService } from '@src/modules/product/services/product.service';
import { ProductRepository } from '@src/modules/product/repositories/product.repository';
import { OrderService } from '@src/modules/order/services/order.service';
import { OrderRepository } from '@src/modules/order/repositories/order.repository';
import { IOrderService } from '@src/modules/order/interfaces/order.service.interface';
import { CustomerRepository } from '@src/modules/customer/interfaces/customer.repository.interface';
import { PrismaCustomerRepository } from '@src/modules/customer/repositories/prisma-customer.repository';

// DTOs
import { CreateProductDto } from '@src/modules/product/dtos/create-product.dto';
import { UpdateProductDto } from '@src/modules/product/dtos/update-product.dto';
import { AppException } from '@src/common/exceptions/app.exception';
import { OrderStatus } from '@src/common/enums/order-status.enum';
import { MeasureUnit } from '@src/common/enums/measure-unit.enum';
import { ProductDto } from '@src/modules/product/dtos/product.dto';

describe('ProductService (Integration)', () => {
  let productService: ProductService;
  let orderRepository: OrderRepository;
  let customerRepository: CustomerRepository;
  let prismaTestClient: PrismaClient;
  let container: StartedTestContainer;
  let orderServiceInstance: IOrderService;

  const baseCreateDto: CreateProductDto = {
    name: 'Testable Product',
    brand: 'Test Brand',
    unit: MeasureUnit.UN,
    stockQuantity: 100,
    costPrice: 50,
    profitMargin: 0.2,
    profit: 10,
    salePrice: 60,
  };

  beforeAll(async () => {
    console.log(
      '[ProductService Integration] Starting PostgreSQL container...',
    );
    container = await new GenericContainer('postgres:latest') // Use a versão mais recente
      .withEnvironment({ POSTGRES_DB: 'test_db_product_service' })
      .withEnvironment({ POSTGRES_USER: 'test_user' })
      .withEnvironment({ POSTGRES_PASSWORD: 'test_password' })
      .withExposedPorts(5432) // Expondo a porta padrão do PostgreSQL
      .withWaitStrategy(
        Wait.forLogMessage('database system is ready to accept connections', 2),
      )
      .start();
    console.log('[ProductService Integration] PostgreSQL container started.');

    const databaseUrl = `postgresql://test_user:test_password@${container.getHost()}:${container.getFirstMappedPort()}/test_db_product_service`;
    process.env.DATABASE_URL = databaseUrl;
    console.log(
      `[ProductService Integration] DATABASE_URL set to: ${databaseUrl}`,
    );

    console.log('[ProductService Integration] Applying Prisma migrations...');
    try {
      execSync('npx prisma migrate deploy', {
        env: { ...process.env, DATABASE_URL: databaseUrl },
        stdio: 'inherit',
      });
      console.log(
        '[ProductService Integration] Prisma migrations applied successfully.',
      );
    } catch (error) {
      console.error(
        '[ProductService Integration] Failed to apply Prisma migrations:',
        error,
      );
      await container.stop();
      throw error;
    }

    prismaTestClient = new PrismaClient({
      datasources: { db: { url: databaseUrl } },
    });
    await prismaTestClient.$connect();
    console.log('[ProductService Integration] Direct Prisma client connected.');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        PrismaService,
        { provide: 'IProductRepository', useClass: ProductRepository },
        { provide: 'IOrderService', useClass: OrderService },
        OrderRepository,
        { provide: CustomerRepository, useClass: PrismaCustomerRepository },
      ],
    }).compile();
    console.log('[ProductService Integration] NestJS testing module compiled.');

    productService = module.get<ProductService>(ProductService);
    orderServiceInstance = module.get<IOrderService>('IOrderService');
    orderRepository = module.get<OrderRepository>(OrderRepository);
    customerRepository = module.get<CustomerRepository>(CustomerRepository);

    console.log('[ProductService Integration] Service instances obtained.');
  }, 300000);

  beforeEach(async () => {
    await prismaTestClient.orderItem.deleteMany({});
    await prismaTestClient.order.deleteMany({});
    await prismaTestClient.product.deleteMany({});
    await prismaTestClient.customer.deleteMany({});
    await prismaTestClient.address.deleteMany({});
  });

  afterAll(async () => {
    await prismaTestClient?.$disconnect();
    await container?.stop();
    delete process.env.DATABASE_URL;
  }, 60000);

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return all created products', async () => {
      await prismaTestClient.product.createMany({
        data: [
          { ...baseCreateDto, name: 'Product A', createdAt: new Date() } as any,
          {
            ...baseCreateDto,
            name: 'Product B',
            brand: 'Other Brand',
            createdAt: new Date(),
          } as any,
        ],
      });

      const products = await productService.getAllProducts();
      expect(products).toHaveLength(2);
      expect(products.map((p) => p.name).sort()).toEqual(
        ['Product A', 'Product B'].sort(),
      );
    });

    it('should return an empty array if no products exist', async () => {
      const products = await productService.getAllProducts();
      expect(products).toHaveLength(0);
    });

    it('should throw AppException with INTERNAL_SERVER_ERROR if repository findAll fails unexpectedly', async () => {
      jest
        .spyOn(productService['productRepository'], 'findAll')
        .mockRejectedValueOnce(new Error('DB connection error'));
      await expect(productService.getAllProducts()).rejects.toThrow(
        new AppException(
          'Failed to retrieve products from database.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('createProduct', () => {
    describe('deve criar um novo produto com sucesso', () => {
      it('should create a new product successfully', async () => {
        const result = await productService.createProduct(baseCreateDto);
        expect(result).toBeDefined();
        expect(result.name).toBe(baseCreateDto.name);
        expect(result.id).toBeGreaterThan(0);

        const dbProduct = await prismaTestClient.product.findUnique({
          where: { id: result.id },
        });
        expect(dbProduct).not.toBeNull();
        expect(dbProduct?.name).toBe(baseCreateDto.name);
      });
    });

    describe('deve lançar AppException se um produto com o mesmo nome já existir', () => {
      it('should throw AppException if product with the same name already exists', async () => {
        await productService.createProduct({
          ...baseCreateDto,
        });
        await expect(
          productService.createProduct({
            ...baseCreateDto,
            createdAt: new Date(),
          } as any),
        ).rejects.toThrow(AppException);
        try {
          await productService.createProduct({
            ...baseCreateDto,
            createdAt: new Date(),
          } as any);
        } catch (e) {
          expect(e.status).toBe(HttpStatus.BAD_REQUEST);
          expect(e.message).toBe('Product with same name exists.');
        }
      });
    });

    describe('deve lançar AppException por propriedades obrigatórias ausentes', () => {
      it('should throw AppException for missing required properties', async () => {
        const invalidDto: any = { brand: 'Test' };
        await expect(productService.createProduct(invalidDto)).rejects.toThrow(
          AppException,
        );
        try {
          await productService.createProduct(invalidDto);
        } catch (e) {
          expect(e.status).toBe(HttpStatus.BAD_REQUEST);
          expect(e.message).toBe('Missing or null required properties.');
          expect(e.validationErrorProperties).toEqual(
            expect.arrayContaining([
              'name',
              'unit',
              'stockQuantity',
              'costPrice',
              'profitMargin',
              'profit',
              'salePrice',
            ]),
          );
        }
      });
    });

    describe('deve lançar AppException com INTERNAL_SERVER_ERROR se o repositório create falhar inesperadamente', () => {
      it('should throw AppException with INTERNAL_SERVER_ERROR if repository create fails unexpectedly', async () => {
        jest
          .spyOn(productService['productRepository'], 'existsByName')
          .mockRejectedValueOnce(new Error('DB connection error'));
        await expect(
          productService.createProduct(baseCreateDto),
        ).rejects.toThrow(
          new AppException(
            'Failed to create product.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      });
    });
  });

  describe('getProductById', () => {
    describe('deve retornar um produto se encontrado', () => {
      it('should return a product if found', async () => {
        const created = await prismaTestClient.product.create({
          data: { ...baseCreateDto, createdAt: new Date() } as any,
        });
        const found = await productService.getProductById(created.id);
        expect(found).not.toBeNull();
        expect(found?.id).toBe(created.id);
      });
    });

    describe('deve lançar AppException se o produto não for encontrado', () => {
      it('should throw AppException if product is not found', async () => {
        await expect(productService.getProductById(99999)).rejects.toThrow(
          new AppException('Product not found.', HttpStatus.NOT_FOUND),
        );
      });
    });

    describe('deve lançar AppException com INTERNAL_SERVER_ERROR se o repositório findById falhar inesperadamente', () => {
      it('should throw AppException with INTERNAL_SERVER_ERROR if repository findById fails unexpectedly', async () => {
        jest
          .spyOn(productService['productRepository'], 'findById')
          .mockRejectedValueOnce(new Error('DB connection error'));
        await expect(productService.getProductById(1)).rejects.toThrow(
          new AppException(
            'Failed to retrieve product with ID 1.',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      });
    });
  });

  describe('updateProduct', () => {
    describe('deve atualizar um produto existente', () => {
      it('should update an existing product', async () => {
        const created = await prismaTestClient.product.create({
          data: { ...baseCreateDto, createdAt: new Date() } as any,
        });
        const updateDto: UpdateProductDto = {
          name: 'Updated Name',
          stockQuantity: 200,
        };
        const updated: ProductDto | null = await productService.updateProduct(
          created.id,
          updateDto,
        );

        expect(updated).not.toBeNull();
        expect(updated?.name).toBe('Updated Name');
        expect(updated?.brand).toBe(baseCreateDto.brand);
        expect(updated?.stockQuantity).toBe(200);

        const dbProduct = await prismaTestClient.product.findUnique({
          where: { id: created.id },
        });
        expect(dbProduct?.name).toBe('Updated Name');
      });
    });

    describe('deve lançar AppException se o produto a ser atualizado não for encontrado', () => {
      it('should throw AppException if product to update is not found', async () => {
        const updateDto: UpdateProductDto = { name: 'Updated Name' };
        await expect(
          productService.updateProduct(99999, {
            ...baseCreateDto,
            ...updateDto,
            name: 'NonExistent',
          }),
        ).rejects.toThrow(
          new AppException('Product not found.', HttpStatus.NOT_FOUND),
        );
      });
    });

    describe('deve lançar AppException com INTERNAL_SERVER_ERROR se o repositório update falhar inesperadamente', () => {
      it('should throw AppException with INTERNAL_SERVER_ERROR if repository update fails unexpectedly', async () => {
        const created = await prismaTestClient.product.create({
          data: { ...baseCreateDto, createdAt: new Date() } as any,
        });
        const updateDto: UpdateProductDto = { name: 'Updated Name' };
        jest
          .spyOn(productService['productRepository'], 'update')
          .mockRejectedValueOnce(new Error('DB connection error'));
        await expect(
          productService.updateProduct(created.id, updateDto),
        ).rejects.toThrow(
          new AppException(
            `Failed to update product with ID ${created.id}.`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      });
    });
  });

  describe('deleteProduct', () => {
    describe('deve deletar um produto com sucesso se não tiver histórico de vendas', () => {
      it('should delete a product successfully if it has no sales history', async () => {
        const created = await prismaTestClient.product.create({
          data: { ...baseCreateDto, createdAt: new Date() } as any,
        });
        await expect(
          productService.deleteProduct(created.id),
        ).resolves.toBeUndefined();
        const dbProduct = await prismaTestClient.product.findUnique({
          where: { id: created.id },
        });
        expect(dbProduct).toBeNull();
      });
    });

    describe('deve lançar AppException se o produto tiver histórico de vendas', () => {
      it('should throw AppException if product has sales history', async () => {
        const customer = await customerRepository.create({
          name: 'Test Customer for Order',
          email: 'ordercust@test.com',
          phone: '123456789',
          city: 'Test City',
          neighborhood: 'Test Neigh',
          street: 'Test Street',
          number: '123',
          complement: '',
          reference: '',
        });

        const product = await prismaTestClient.product.create({
          data: { ...baseCreateDto, createdAt: new Date() } as any,
        });

        const mockOrder: Partial<Order> = {
          id: 1,
          customerId: customer.id,
          status: OrderStatus.PENDING,
        };

        jest
          .spyOn(orderServiceInstance, 'getOrdersByProductId')
          .mockResolvedValueOnce([mockOrder as Order]);

        await expect(productService.deleteProduct(product.id)).rejects.toThrow(
          new AppException(
            'Cannot remove product. It has a sales history.',
            HttpStatus.BAD_REQUEST,
          ),
        );

        expect(orderServiceInstance.getOrdersByProductId).toHaveBeenCalledWith(
          product.id,
        );
      });
    });

    describe('deve lançar AppException se o produto a ser deletado não for encontrado', () => {
      it('should throw AppException if product to delete is not found', async () => {
        await expect(productService.deleteProduct(99999)).rejects.toThrow(
          new AppException('Product not found.', HttpStatus.NOT_FOUND),
        );
      });
    });

    describe('deve lançar AppException com INTERNAL_SERVER_ERROR se o repositório delete falhar inesperadamente', () => {
      it('should throw AppException with INTERNAL_SERVER_ERROR if repository delete fails unexpectedly', async () => {
        const product = await prismaTestClient.product.create({
          data: { ...baseCreateDto, createdAt: new Date() } as any,
        });
        jest
          .spyOn(productService['productRepository'], 'delete')
          .mockRejectedValueOnce(new Error('DB connection error'));
        await expect(productService.deleteProduct(product.id)).rejects.toThrow(
          new AppException(
            `Failed to delete product with ID ${product.id}.`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      });
    });
  });
});
